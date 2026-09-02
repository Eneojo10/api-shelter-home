import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/portal/PortalShell";
import { permissions as seed, type Permission } from "@/lib/portal-data";

export const Route = createFileRoute("/permissions")({
  head: () => ({
    meta: [
      { title: "Permissions — Acme Developer Portal" },
      {
        name: "description",
        content: "Grant or revoke OAuth scopes per application with least-privilege defaults.",
      },
      { property: "og:title", content: "Permissions — Acme Developer Portal" },
      { property: "og:description", content: "Manage OAuth scopes and role access for your apps." },
    ],
  }),
  component: Permissions,
});

const roles = [
  { name: "Owner", members: 1, can: "Full access, billing, key revocation" },
  { name: "Developer", members: 4, can: "Create apps, rotate sandbox keys, read logs" },
  { name: "Read-only", members: 7, can: "View dashboards, usage and documentation" },
];

function Permissions() {
  const [scopes, setScopes] = useState<Permission[]>(seed);

  const toggle = (scope: string) => {
    setScopes((prev) =>
      prev.map((p) => {
        if (p.scope !== scope) return p;
        toast[p.granted ? "message" : "success"](
          `${p.scope} ${p.granted ? "revoked" : "granted"}`,
        );
        return { ...p, granted: !p.granted };
      }),
    );
  };

  const categories = [...new Set(scopes.map((s) => s.category))];

  return (
    <>
      <PageHeader
        title="Permissions"
        description="Scopes attach to credentials at issue time. Changing a scope takes effect on the next token exchange."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {categories.map((cat) => (
            <Card key={cat}>
              <CardHeader>
                <CardTitle className="text-base">{cat}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {scopes
                  .filter((s) => s.category === cat)
                  .map((s, i, arr) => (
                    <div key={s.scope}>
                      <div className="flex items-start justify-between gap-4 py-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <code className="font-mono text-sm">{s.scope}</code>
                            {s.sensitive ? (
                              <Badge variant="destructive" className="gap-1 text-[10px]">
                                <ShieldAlert className="size-3" /> sensitive
                              </Badge>
                            ) : null}
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground">{s.description}</p>
                        </div>
                        <Switch checked={s.granted} onCheckedChange={() => toggle(s.scope)} />
                      </div>
                      {i < arr.length - 1 ? <Separator /> : null}
                    </div>
                  ))}
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-base">Team roles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {roles.map((r) => (
              <div key={r.name} className="rounded-lg border border-border p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{r.name}</p>
                  <Badge variant="secondary">{r.members}</Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{r.can}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
