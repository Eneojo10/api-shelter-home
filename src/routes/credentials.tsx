import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { RefreshCw, Ban } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { PageHeader } from "@/components/portal/PortalShell";
import { CopyField } from "@/components/portal/CopyField";
import {
  credentialKindLabel,
  credentials as seed,
  type Credential,
} from "@/lib/portal-data";

export const Route = createFileRoute("/credentials")({
  head: () => ({
    meta: [
      { title: "Credentials — Acme Developer Portal" },
      {
        name: "description",
        content:
          "Client IDs, client secrets, API keys, webhook secrets and auth tokens with rotation and revocation.",
      },
      { property: "og:title", content: "Credentials — Acme Developer Portal" },
      {
        property: "og:description",
        content: "Manage client IDs, secrets, tokens and webhook signing keys.",
      },
    ],
  }),
  component: Credentials,
});

const groups = [
  { key: "all", label: "All" },
  { key: "client_id", label: "Client IDs" },
  { key: "client_secret", label: "Client Secrets" },
  { key: "api_key", label: "API Keys" },
  { key: "webhook_secret", label: "Webhook Secrets" },
  { key: "auth_token", label: "Auth Tokens" },
] as const;

function randomValue(prefix: string) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let out = "";
  for (let i = 0; i < 30; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return `${prefix}${out}`;
}

function Credentials() {
  const [items, setItems] = useState<Credential[]>(seed);

  const rotate = (id: string) => {
    setItems((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              value: randomValue(`${c.value.split("_").slice(0, 2).join("_")}_`),
              lastRotated: new Date().toISOString().slice(0, 10),
              status: "active",
            }
          : c,
      ),
    );
    toast.success("Credential rotated. The previous value stays valid for 24 hours.");
  };

  const revoke = (id: string) => {
    setItems((prev) => prev.map((c) => (c.id === id ? { ...c, status: "revoked" } : c)));
    toast.error("Credential revoked immediately.");
  };

  return (
    <>
      <PageHeader
        title="Credentials"
        description="Every secret your integration needs, in one vault. Rotate on a schedule, revoke instantly on exposure."
      />

      <Tabs defaultValue="all">
        <TabsList className="mb-5 flex-wrap">
          {groups.map((g) => (
            <TabsTrigger key={g.key} value={g.key}>
              {g.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {groups.map((g) => (
          <TabsContent key={g.key} value={g.key} className="space-y-4">
            {items
              .filter((c) => g.key === "all" || c.kind === g.key)
              .map((c) => (
                <Card key={c.id} className={c.status === "revoked" ? "opacity-60" : undefined}>
                  <CardHeader className="flex-row flex-wrap items-start justify-between gap-3">
                    <div>
                      <CardTitle className="text-base">{c.label}</CardTitle>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {c.app} · created {c.createdAt} · rotated {c.lastRotated}
                        {c.expiresAt ? ` · expires ${c.expiresAt}` : " · no expiry"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="secondary">{credentialKindLabel[c.kind]}</Badge>
                      <Badge variant={c.env === "production" ? "default" : "outline"}>{c.env}</Badge>
                      <Badge
                        variant={
                          c.status === "active"
                            ? "outline"
                            : c.status === "rotating"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {c.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <CopyField value={c.value} secret={c.masked} label={credentialKindLabel[c.kind]} />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={c.status === "revoked"}
                        onClick={() => rotate(c.id)}
                      >
                        <RefreshCw className="size-3.5" /> Rotate
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="destructive" disabled={c.status === "revoked"}>
                            <Ban className="size-3.5" /> Revoke
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Revoke {c.label}?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This takes effect immediately. Any request using this credential will
                              fail with 401 and cannot be restored.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => revoke(c.id)}>
                              Revoke credential
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>
        ))}
      </Tabs>
    </>
  );
}
