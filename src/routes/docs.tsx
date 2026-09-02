import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/portal/PortalShell";
import { docSections } from "@/lib/portal-data";

export const Route = createFileRoute("/docs")({
  head: () => ({
    meta: [
      { title: "API Documentation — Acme Developer Portal" },
      {
        name: "description",
        content: "Reference for authentication, payments, webhooks and key management endpoints.",
      },
      { property: "og:title", content: "API Documentation — Acme Developer Portal" },
      { property: "og:description", content: "Endpoint reference, auth guide and code samples." },
    ],
  }),
  component: Docs,
});

function Docs() {
  return (
    <>
      <PageHeader
        title="API Documentation"
        description="Base URL https://api.acme.dev — all requests require TLS 1.2+ and a bearer token."
      />

      <div className="grid gap-6 lg:grid-cols-[14rem_1fr]">
        <nav className="h-fit rounded-xl border border-border bg-card p-4 text-sm lg:sticky lg:top-20">
          <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">On this page</p>
          <ul className="space-y-2">
            <li>
              <a href="#authentication" className="text-muted-foreground hover:text-primary">
                Authentication
              </a>
            </li>
            {docSections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="text-muted-foreground hover:text-primary">
                  {s.title}
                </a>
              </li>
            ))}
            <li>
              <a href="#errors" className="text-muted-foreground hover:text-primary">
                Error codes
              </a>
            </li>
          </ul>
        </nav>

        <div className="space-y-6">
          <Card id="authentication">
            <CardHeader>
              <CardTitle className="text-base">Authentication</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Server-to-server calls use a secret API key in the Authorization header. Browser
                clients exchange a client ID + PKCE flow for a short-lived auth token.
              </p>
              <pre className="overflow-x-auto rounded-lg border border-border bg-secondary/40 p-4 font-mono text-xs text-foreground">
{`Authorization: Bearer sk_live_...
Acme-Version: 2026-06-01`}
              </pre>
            </CardContent>
          </Card>

          {docSections.map((s) => (
            <Card key={s.id} id={s.id}>
              <CardHeader className="flex-row items-center gap-3">
                <Badge variant="outline" className="font-mono">
                  {s.method}
                </Badge>
                <CardTitle className="font-mono text-sm">{s.path}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm font-medium">{s.title}</p>
                <p className="text-sm text-muted-foreground">{s.summary}</p>
                <pre className="overflow-x-auto rounded-lg border border-border bg-secondary/40 p-4 font-mono text-xs">
{s.sample}
                </pre>
              </CardContent>
            </Card>
          ))}

          <Card id="errors">
            <CardHeader>
              <CardTitle className="text-base">Error codes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {[
                ["400", "invalid_request — a parameter is missing or malformed"],
                ["401", "unauthorized — key revoked, expired or missing"],
                ["403", "insufficient_scope — the credential lacks the required permission"],
                ["409", "idempotency_conflict — same key, different payload"],
                ["429", "rate_limited — retry after the Retry-After header"],
                ["500", "server_error — safe to retry with the same idempotency key"],
              ].map(([code, text]) => (
                <div key={code} className="flex gap-3 border-b border-border/60 pb-2 last:border-0">
                  <code className="w-10 font-mono text-primary">{code}</code>
                  <span className="text-muted-foreground">{text}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
