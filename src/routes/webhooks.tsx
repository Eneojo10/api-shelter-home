import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Send, Power } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { PageHeader, StatusDot } from "@/components/portal/PortalShell";
import { CopyField } from "@/components/portal/CopyField";
import { credentials, webhooks as seed, type Webhook } from "@/lib/portal-data";

export const Route = createFileRoute("/webhooks")({
  head: () => ({
    meta: [
      { title: "Webhooks — Acme Developer Portal" },
      {
        name: "description",
        content: "Register endpoints, inspect delivery health, replay events and rotate signing secrets.",
      },
      { property: "og:title", content: "Webhooks — Acme Developer Portal" },
      { property: "og:description", content: "Endpoints, delivery health, replays and signing secrets." },
    ],
  }),
  component: Webhooks,
});

const recentDeliveries = [
  { id: "evt_7741", event: "payment.succeeded", status: 200, at: "06:04:52" },
  { id: "evt_7740", event: "payment.failed", status: 200, at: "06:03:11" },
  { id: "evt_7739", event: "settlement.completed", status: 503, at: "05:58:40" },
  { id: "evt_7738", event: "refund.created", status: 200, at: "05:51:07" },
];

function Webhooks() {
  const [hooks, setHooks] = useState<Webhook[]>(seed);
  const [url, setUrl] = useState("");
  const signingSecret = credentials.find((c) => c.kind === "webhook_secret")!;

  const add = () => {
    if (!/^https:\/\/.+/.test(url)) {
      toast.error("Endpoint must be a valid https URL");
      return;
    }
    setHooks((prev) => [
      {
        id: `wh_${Math.random().toString(16).slice(2, 6)}`,
        url,
        events: ["payment.succeeded"],
        status: "healthy",
        successRate: 100,
        lastDelivery: "never",
        env: "sandbox",
      },
      ...prev,
    ]);
    setUrl("");
    toast.success("Endpoint registered");
  };

  const toggle = (id: string) =>
    setHooks((prev) =>
      prev.map((h) =>
        h.id === id ? { ...h, status: h.status === "disabled" ? "healthy" : "disabled" } : h,
      ),
    );

  return (
    <>
      <PageHeader
        title="Webhooks"
        description="Acme retries failed deliveries with exponential backoff for 24 hours. Always verify the signature header."
      />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Add endpoint</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-end gap-3">
            <div className="min-w-64 flex-1 space-y-2">
              <Label htmlFor="wh-url">Endpoint URL</Label>
              <Input
                id="wh-url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://api.yourapp.com/hooks/acme"
              />
            </div>
            <Button onClick={add}>
              <Plus className="size-4" /> Add
            </Button>
          </div>
          <div className="space-y-2">
            <Label>Signing secret</Label>
            <CopyField value={signingSecret.value} secret label="Signing secret" />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {hooks.map((h) => (
            <Card key={h.id}>
              <CardHeader className="flex-row items-start justify-between gap-3">
                <div>
                  <CardTitle className="flex items-center gap-2 font-mono text-sm">
                    <StatusDot
                      tone={
                        h.status === "healthy" ? "success" : h.status === "degraded" ? "warning" : "muted"
                      }
                    />
                    {h.url}
                  </CardTitle>
                  <p className="mt-1 text-xs text-muted-foreground">Last delivery {h.lastDelivery}</p>
                </div>
                <Badge variant={h.env === "production" ? "default" : "secondary"}>{h.env}</Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-1">
                  {h.events.map((e) => (
                    <Badge key={e} variant="outline" className="font-mono text-[10px]">
                      {e}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <Progress value={h.successRate} className="h-2 flex-1" />
                  <span className="font-mono text-xs">{h.successRate}%</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toast.success("Test event queued to " + h.url)}
                  >
                    <Send className="size-3.5" /> Send test
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => toggle(h.id)}>
                    <Power className="size-3.5" /> {h.status === "disabled" ? "Enable" : "Disable"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-base">Recent deliveries</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentDeliveries.map((d) => (
              <div key={d.id} className="flex items-center justify-between gap-2 text-xs">
                <div className="min-w-0">
                  <p className="truncate font-mono">{d.event}</p>
                  <p className="text-muted-foreground">{d.at}</p>
                </div>
                <span
                  className={`font-mono ${d.status >= 500 ? "text-destructive" : "text-success"}`}
                >
                  {d.status}
                </span>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => toast.success("Failed deliveries queued for replay")}
            >
              Replay failed events
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
