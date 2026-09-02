import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, RefreshCw, Ban } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/portal/PortalShell";
import { CopyField } from "@/components/portal/CopyField";
import { apiKeys as seed, type ApiKey } from "@/lib/portal-data";

export const Route = createFileRoute("/api-keys")({
  head: () => ({
    meta: [
      { title: "API Keys — Acme Developer Portal" },
      {
        name: "description",
        content: "Create, scope, rotate and revoke API keys across sandbox and production.",
      },
      { property: "og:title", content: "API Keys — Acme Developer Portal" },
      { property: "og:description", content: "Scope, rotate and revoke your API keys." },
    ],
  }),
  component: ApiKeysPage,
});

function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>(seed);
  const [freshKey, setFreshKey] = useState<string | null>(null);

  const createKey = () => {
    const secret = `sk_test_${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`;
    setKeys((prev) => [
      {
        id: `key_${Math.random().toString(16).slice(2, 6)}`,
        name: "New sandbox key",
        prefix: `${secret.slice(0, 12)}…${secret.slice(-4)}`,
        env: "sandbox",
        scopes: ["payments:read"],
        lastUsed: "never",
        createdAt: new Date().toISOString().slice(0, 10),
        status: "active",
        rateLimit: "100 req/min",
      },
      ...prev,
    ]);
    setFreshKey(secret);
    toast.success("API key created — copy it now, it won't be shown again.");
  };

  const rotate = (id: string) => {
    const secret = `sk_live_${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`;
    setKeys((prev) =>
      prev.map((k) =>
        k.id === id ? { ...k, prefix: `${secret.slice(0, 12)}…${secret.slice(-4)}`, lastUsed: "never" } : k,
      ),
    );
    setFreshKey(secret);
    toast.success("Key rotated. Old key expires in 24 hours.");
  };

  const revoke = (id: string) => {
    setKeys((prev) => prev.map((k) => (k.id === id ? { ...k, status: "revoked", rateLimit: "—" } : k)));
    toast.error("Key revoked.");
  };

  return (
    <>
      <PageHeader
        title="API Keys"
        description="Server-side keys authenticate your backend. Keep them out of browsers and mobile bundles."
        actions={
          <Button onClick={createKey}>
            <Plus className="size-4" /> Create key
          </Button>
        }
      />

      {freshKey ? (
        <Card className="mb-6 border-primary/40">
          <CardHeader>
            <CardTitle className="text-base text-primary">Your new key</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <CopyField value={freshKey} secret label="API key" />
            <p className="text-xs text-muted-foreground">
              Store it in a secret manager now — this is the only time the full value is shown.
            </p>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Key</TableHead>
                <TableHead>Scopes</TableHead>
                <TableHead>Rate limit</TableHead>
                <TableHead>Last used</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {keys.map((k) => (
                <TableRow key={k.id} className={k.status === "revoked" ? "opacity-50" : undefined}>
                  <TableCell>
                    <div className="font-medium">{k.name}</div>
                    <div className="flex gap-1 pt-1">
                      <Badge variant={k.env === "production" ? "default" : "secondary"}>{k.env}</Badge>
                      {k.status === "revoked" ? <Badge variant="destructive">revoked</Badge> : null}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{k.prefix}</TableCell>
                  <TableCell className="max-w-52">
                    <div className="flex flex-wrap gap-1">
                      {k.scopes.map((s) => (
                        <Badge key={s} variant="outline" className="font-mono text-[10px]">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{k.rateLimit}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{k.lastUsed}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={k.status === "revoked"}
                        onClick={() => rotate(k.id)}
                      >
                        <RefreshCw className="size-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={k.status === "revoked"}
                        onClick={() => revoke(k.id)}
                      >
                        <Ban className="size-3.5 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
