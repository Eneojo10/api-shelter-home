import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PageHeader } from "@/components/portal/PortalShell";
import { applications as seed, type Application } from "@/lib/portal-data";

export const Route = createFileRoute("/applications")({
  head: () => ({
    meta: [
      { title: "My Applications — Acme Developer Portal" },
      {
        name: "description",
        content: "Register, review and manage the applications connected to the Acme API.",
      },
      { property: "og:title", content: "My Applications — Acme Developer Portal" },
      { property: "og:description", content: "Register and manage your API applications." },
    ],
  }),
  component: Applications,
});

function Applications() {
  const [apps, setApps] = useState<Application[]>(seed);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const create = () => {
    if (!name.trim()) {
      toast.error("Give your application a name");
      return;
    }
    setApps((prev) => [
      {
        id: `app_${Math.random().toString(16).slice(2, 8)}`,
        name: name.trim(),
        description: description.trim() || "No description yet.",
        env: "sandbox",
        status: "pending",
        createdAt: new Date().toISOString().slice(0, 10),
        requests30d: 0,
        owner: "you",
      },
      ...prev,
    ]);
    setName("");
    setDescription("");
    setOpen(false);
    toast.success("Application created in sandbox");
  };

  return (
    <>
      <PageHeader
        title="My Applications"
        description="Each application gets its own credentials, scopes and rate limits."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="size-4" /> New application
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create application</DialogTitle>
                <DialogDescription>
                  New applications start in sandbox until they pass review.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="app-name">Name</Label>
                  <Input
                    id="app-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Mobile Checkout"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="app-desc">Description</Label>
                  <Textarea
                    id="app-desc"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What will this application do?"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={create}>Create</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid gap-4 md:grid-cols-2">
        {apps.map((app) => (
          <Card key={app.id}>
            <CardHeader className="flex-row items-start justify-between gap-3">
              <div>
                <CardTitle className="text-base">{app.name}</CardTitle>
                <p className="mt-1 font-mono text-xs text-muted-foreground">{app.id}</p>
              </div>
              <div className="flex gap-2">
                <Badge variant={app.env === "production" ? "default" : "secondary"}>{app.env}</Badge>
                <Badge
                  variant={
                    app.status === "active"
                      ? "outline"
                      : app.status === "pending"
                        ? "secondary"
                        : "destructive"
                  }
                >
                  {app.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{app.description}</p>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <p className="text-muted-foreground">Requests 30d</p>
                  <p className="font-mono">{app.requests30d.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Created</p>
                  <p className="font-mono">{app.createdAt}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Owner</p>
                  <p className="font-mono">{app.owner}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" asChild>
                  <Link to="/credentials">Credentials</Link>
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <Link to="/permissions">Permissions</Link>
                </Button>
                <Button size="sm" variant="ghost" asChild>
                  <Link to="/logs">Logs</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
