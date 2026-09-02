import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, AlertTriangle, KeyRound, Boxes, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PageHeader, StatusDot } from "@/components/portal/PortalShell";
import { applications, logs, usageSeries, webhooks } from "@/lib/portal-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Acme Developer Portal" },
      {
        name: "description",
        content:
          "Live overview of API traffic, application health, key rotation status and webhook delivery.",
      },
      { property: "og:title", content: "Dashboard — Acme Developer Portal" },
      {
        property: "og:description",
        content: "Live overview of API traffic, app health, keys and webhook delivery.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const today = usageSeries[usageSeries.length - 1]!;
  const stats = [
    { label: "Requests today", value: today.requests.toLocaleString(), icon: Activity, hint: "+7.4% vs yesterday" },
    { label: "Active applications", value: String(applications.filter((a) => a.status === "active").length), icon: Boxes, hint: `${applications.length} total` },
    { label: "Active API keys", value: "3", icon: KeyRound, hint: "1 revoked" },
    { label: "Errors today", value: today.errors.toLocaleString(), icon: AlertTriangle, hint: "0.21% error rate" },
  ];

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Everything happening across your integrations right now."
        actions={
          <Button asChild>
            <Link to="/applications">New application</Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">{s.label}</p>
                <s.icon className="size-4 text-primary" />
              </div>
              <p className="mt-3 font-mono text-2xl font-semibold">{s.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{s.hint}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base">Traffic, last 7 days</CardTitle>
            <Link to="/usage" className="text-xs text-primary hover:underline">
              View usage
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {usageSeries.map((d) => (
              <div key={d.day} className="flex items-center gap-3">
                <span className="w-16 text-xs text-muted-foreground">{d.day}</span>
                <Progress value={(d.requests / 250_000) * 100} className="h-2 flex-1" />
                <span className="w-20 text-right font-mono text-xs">
                  {(d.requests / 1000).toFixed(1)}k
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Webhook health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {webhooks.map((w) => (
              <div key={w.id} className="space-y-1">
                <div className="flex items-center gap-2">
                  <StatusDot
                    tone={
                      w.status === "healthy" ? "success" : w.status === "degraded" ? "warning" : "muted"
                    }
                  />
                  <span className="truncate font-mono text-xs">{w.url.replace("https://", "")}</span>
                </div>
                <p className="pl-4 text-xs text-muted-foreground">
                  {w.successRate}% delivered · {w.lastDelivery}
                </p>
              </div>
            ))}
            <Button variant="outline" size="sm" asChild className="w-full">
              <Link to="/webhooks">
                Manage webhooks <ArrowUpRight className="size-3.5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="text-base">Recent requests</CardTitle>
          <Link to="/logs" className="text-xs text-primary hover:underline">
            Open logs
          </Link>
        </CardHeader>
        <CardContent className="space-y-2">
          {logs.slice(0, 5).map((l) => (
            <div key={l.id} className="flex items-center gap-3 border-b border-border/60 pb-2 text-xs last:border-0">
              <span className="w-16 font-mono text-muted-foreground">{l.time}</span>
              <Badge variant="outline" className="font-mono">
                {l.method}
              </Badge>
              <span className="flex-1 truncate font-mono">{l.path}</span>
              <span
                className={`font-mono ${l.status >= 500 ? "text-destructive" : l.status >= 400 ? "text-warning" : "text-success"}`}
              >
                {l.status}
              </span>
              <span className="w-14 text-right font-mono text-muted-foreground">{l.latency}ms</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </>
  );
}
