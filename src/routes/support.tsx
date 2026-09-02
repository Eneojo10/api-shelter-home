import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BookOpen, MessagesSquare, Github } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PageHeader } from "@/components/portal/PortalShell";
import { supportTickets } from "@/lib/portal-data";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Support — Acme Developer Portal" },
      {
        name: "description",
        content: "Open a ticket, track existing requests and browse answers to common integration questions.",
      },
      { property: "og:title", content: "Support — Acme Developer Portal" },
      { property: "og:description", content: "Tickets, FAQs and developer support channels." },
    ],
  }),
  component: Support,
});

const faqs = [
  {
    q: "How often should I rotate credentials?",
    a: "Rotate production secrets every 90 days, and immediately whenever a value may have been exposed. Rotation keeps the previous value valid for 24 hours so you can roll out without downtime.",
  },
  {
    q: "Why am I getting 403 insufficient_scope?",
    a: "The credential was issued before the scope was granted. Grant the scope on the Permissions page, then re-issue the token or rotate the key.",
  },
  {
    q: "How do webhook retries work?",
    a: "Failed deliveries retry with exponential backoff for 24 hours. After that the event is marked failed and can be replayed manually from the Webhooks page.",
  },
  {
    q: "Can I raise my rate limit?",
    a: "Yes. Open a ticket with your expected peak RPS and the endpoints involved; limits are usually adjusted within one business day.",
  },
];

function Support() {
  const [subject, setSubject] = useState("");
  const [priority, setPriority] = useState("medium");
  const [message, setMessage] = useState("");

  const submit = () => {
    if (!subject.trim() || !message.trim()) {
      toast.error("Add a subject and a description");
      return;
    }
    setSubject("");
    setMessage("");
    toast.success("Ticket submitted — expect a reply within 4 hours");
  };

  return (
    <>
      <PageHeader
        title="Support"
        description="Scale plan includes 4-hour first response, 24/5. Critical production incidents are always 1 hour."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Open a ticket</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-[1fr_10rem]">
              <div className="space-y-2">
                <Label htmlFor="sub">Subject</Label>
                <Input
                  id="sub"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Webhook signature mismatch on refunds"
                />
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="msg">Description</Label>
              <Textarea
                id="msg"
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Include request IDs, timestamps and the environment."
              />
            </div>
            <Button onClick={submit}>Submit ticket</Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Your tickets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {supportTickets.map((t) => (
                <div key={t.id} className="rounded-lg border border-border p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs text-muted-foreground">{t.id}</span>
                    <Badge
                      variant={
                        t.status === "open" ? "default" : t.status === "waiting" ? "secondary" : "outline"
                      }
                    >
                      {t.status}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm">{t.subject}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {t.priority} priority · updated {t.updated}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Other channels</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="flex items-center gap-2 text-muted-foreground">
                <BookOpen className="size-4 text-primary" /> Guides and API reference
              </p>
              <p className="flex items-center gap-2 text-muted-foreground">
                <MessagesSquare className="size-4 text-primary" /> Developer Slack community
              </p>
              <p className="flex items-center gap-2 text-muted-foreground">
                <Github className="size-4 text-primary" /> SDK issues on GitHub
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-base">Frequent questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible>
            {faqs.map((f) => (
              <AccordionItem key={f.q} value={f.q}>
                <AccordionTrigger className="text-sm">{f.q}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </>
  );
}
