import { createFileRoute } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/portal/PortalShell";
import { endpointUsage, usageSeries } from "@/lib/portal-data";

export const Route = createFileRoute("/usage")({
  head: () => ({
    meta: [
      { title: "Usage — Acme Developer Portal" },
      {
        name: "description",
        content: "Track request volume, error rate, quota consumption and per-endpoint usage.",
      },
      { property: "og:title", content: "Usage — Acme Developer Portal" },
      { property: "og:description", content: "Request volume, quotas and per-endpoint breakdown." },
    ],
  }),
  component: Usage,
});

function Usage() {
  const total = usageSeries.reduce((a, d) => a + d.requests, 0);
  const quota = 2_000_000;

  return (
    <>
      <PageHeader
        title="Usage"
        description="Billing period Sep 1 – Sep 30. Overage is billed at $0.40 per 1,000 requests."
        actions={<Badge variant="outline">Scale plan</Badge>}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Requests over time</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={usageSeries} margin={{ left: -12, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="req" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="day" stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="requests"
                  stroke="var(--color-chart-1)"
                  fill="url(#req)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quota</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Requests</span>
                <span className="font-mono">
                  {total.toLocaleString()} / {quota.toLocaleString()}
                </span>
              </div>
              <Progress value={(total / quota) * 100} className="mt-2 h-2" />
            </div>
            <div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Webhook deliveries</span>
                <span className="font-mono">184,220 / 500,000</span>
              </div>
              <Progress value={36.8} className="mt-2 h-2" />
            </div>
            <div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Sandbox calls</span>
                <span className="font-mono">unlimited</span>
              </div>
              <Progress value={12} className="mt-2 h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-base">Top endpoints</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {endpointUsage.map((e) => (
            <div key={e.endpoint} className="flex items-center gap-3">
              <span className="w-56 truncate font-mono text-xs">{e.endpoint}</span>
              <Progress value={e.share * 2.5} className="h-2 flex-1" />
              <span className="w-24 text-right font-mono text-xs">{e.calls.toLocaleString()}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </>
  );
}
