import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Play } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/portal/PortalShell";

export const Route = createFileRoute("/sandbox")({
  head: () => ({
    meta: [
      { title: "Sandbox — Acme Developer Portal" },
      {
        name: "description",
        content: "Fire test requests against the Acme sandbox with simulated cards and mock responses.",
      },
      { property: "og:title", content: "Sandbox — Acme Developer Portal" },
      { property: "og:description", content: "Test the API safely with mock data and test cards." },
    ],
  }),
  component: Sandbox,
});

const endpoints = [
  { value: "POST /v1/payments", body: `{\n  "amount": 4500,\n  "currency": "usd",\n  "source": "tok_visa"\n}` },
  { value: "GET /v1/payments", body: "{}" },
  { value: "POST /v1/refunds", body: `{\n  "payment_id": "pi_77c",\n  "amount": 4500\n}` },
  { value: "POST /v1/identity/verify", body: `{\n  "document": "passport",\n  "country": "NG"\n}` },
];

const testCards = [
  ["4242 4242 4242 4242", "Succeeds immediately"],
  ["4000 0000 0000 9995", "Declined — insufficient funds"],
  ["4000 0025 0000 3155", "Requires 3-D Secure"],
  ["4000 0000 0000 0069", "Expired card"],
];

function Sandbox() {
  const [endpoint, setEndpoint] = useState(endpoints[0]!.value);
  const [body, setBody] = useState(endpoints[0]!.body);
  const [response, setResponse] = useState<string | null>(null);
  const [running, setRunning] = useState(false);

  const send = () => {
    setRunning(true);
    setResponse(null);
    setTimeout(() => {
      let parsed: unknown = {};
      try {
        parsed = JSON.parse(body || "{}");
      } catch {
        setResponse(
          JSON.stringify({ error: { code: "invalid_request", message: "Body is not valid JSON" } }, null, 2),
        );
        setRunning(false);
        return;
      }
      setResponse(
        JSON.stringify(
          {
            id: `pi_${Math.random().toString(16).slice(2, 10)}`,
            object: endpoint.split(" ")[1],
            livemode: false,
            status: "succeeded",
            created: Math.floor(Date.now() / 1000),
            request: parsed,
          },
          null,
          2,
        ),
      );
      setRunning(false);
    }, 550);
  };

  return (
    <>
      <PageHeader
        title="Sandbox"
        description="A full mirror of the production API with fake money. Sandbox keys never touch live data."
        actions={<Badge variant="secondary">sandbox mode</Badge>}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Request</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Endpoint</Label>
              <Select
                value={endpoint}
                onValueChange={(v) => {
                  setEndpoint(v);
                  setBody(endpoints.find((e) => e.value === v)?.body ?? "{}");
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {endpoints.map((e) => (
                    <SelectItem key={e.value} value={e.value} className="font-mono text-xs">
                      {e.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sbx-body">JSON body</Label>
              <Textarea
                id="sbx-body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={10}
                className="font-mono text-xs"
              />
            </div>
            <Button onClick={send} disabled={running}>
              <Play className="size-4" /> {running ? "Sending…" : "Send request"}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Response</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="min-h-48 overflow-x-auto rounded-lg border border-border bg-secondary/40 p-4 font-mono text-xs">
{response ?? "// Send a request to see the mock response"}
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Test cards</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              {testCards.map(([num, desc]) => (
                <div key={num} className="flex justify-between gap-3 border-b border-border/60 pb-2 last:border-0">
                  <code className="font-mono">{num}</code>
                  <span className="text-muted-foreground">{desc}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
