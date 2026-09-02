import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/portal/PortalShell";
import { logs } from "@/lib/portal-data";

export const Route = createFileRoute("/logs")({
  head: () => ({
    meta: [
      { title: "Logs — Acme Developer Portal" },
      {
        name: "description",
        content: "Search request logs by endpoint, status code, application and environment.",
      },
      { property: "og:title", content: "Logs — Acme Developer Portal" },
      { property: "og:description", content: "Searchable request logs with status and latency." },
    ],
  }),
  component: Logs,
});

function Logs() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [env, setEnv] = useState("all");

  const filtered = logs.filter((l) => {
    const matchQuery =
      !query || l.path.toLowerCase().includes(query.toLowerCase()) || l.id.includes(query);
    const matchStatus =
      status === "all" ||
      (status === "2xx" && l.status < 300) ||
      (status === "4xx" && l.status >= 400 && l.status < 500) ||
      (status === "5xx" && l.status >= 500);
    const matchEnv = env === "all" || l.env === env;
    return matchQuery && matchStatus && matchEnv;
  });

  return (
    <>
      <PageHeader
        title="Logs"
        description="Request-level traces retained for 30 days. Click an ID in production to open the full trace."
      />

      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative min-w-64 flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search path or request id"
            className="pl-9"
          />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="2xx">2xx success</SelectItem>
            <SelectItem value="4xx">4xx client</SelectItem>
            <SelectItem value="5xx">5xx server</SelectItem>
          </SelectContent>
        </Select>
        <Select value={env} onValueChange={setEnv}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All envs</SelectItem>
            <SelectItem value="production">Production</SelectItem>
            <SelectItem value="sandbox">Sandbox</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Request</TableHead>
                <TableHead>Endpoint</TableHead>
                <TableHead>Application</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Latency</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((l) => (
                <TableRow key={l.id}>
                  <TableCell className="font-mono text-xs text-muted-foreground">{l.time}</TableCell>
                  <TableCell className="font-mono text-xs">{l.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono text-[10px]">
                        {l.method}
                      </Badge>
                      <span className="font-mono text-xs">{l.path}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">
                    {l.app}
                    <Badge variant="secondary" className="ml-2 text-[10px]">
                      {l.env}
                    </Badge>
                  </TableCell>
                  <TableCell
                    className={`font-mono text-xs ${l.status >= 500 ? "text-destructive" : l.status >= 400 ? "text-warning" : "text-success"}`}
                  >
                    {l.status}
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs">{l.latency}ms</TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                    No requests match these filters.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
