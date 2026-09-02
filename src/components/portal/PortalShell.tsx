import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Boxes,
  KeyRound,
  ShieldCheck,
  Webhook,
  BookOpen,
  FlaskConical,
  ScrollText,
  BarChart3,
  LifeBuoy,
  Fingerprint,
  Terminal,
} from "lucide-react";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/applications", label: "My Applications", icon: Boxes },
  { to: "/credentials", label: "Credentials", icon: Fingerprint },
  { to: "/api-keys", label: "API Keys", icon: KeyRound },
  { to: "/permissions", label: "Permissions", icon: ShieldCheck },
  { to: "/webhooks", label: "Webhooks", icon: Webhook },
  { to: "/docs", label: "API Documentation", icon: BookOpen },
  { to: "/sandbox", label: "Sandbox", icon: FlaskConical },
  { to: "/logs", label: "Logs", icon: ScrollText },
  { to: "/usage", label: "Usage", icon: BarChart3 },
  { to: "/support", label: "Support", icon: LifeBuoy },
] as const;

export function PortalShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[16rem_1fr]">
      <aside className="border-b border-sidebar-border bg-sidebar lg:sticky lg:top-0 lg:h-screen lg:border-r lg:border-b-0">
        <div className="flex items-center gap-2 px-5 py-5">
          <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Terminal className="size-5" />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-sidebar-foreground">Acme Developers</p>
            <p className="text-xs text-muted-foreground">Platform v1</p>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-4 lg:flex-col lg:overflow-visible">
          {nav.map((item) => {
            const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-sidebar-accent font-medium text-sidebar-primary"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-border bg-background/80 px-6 py-3 backdrop-blur">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="outline" className="border-primary/40 text-primary">
              Production
            </Badge>
            <span className="font-mono">org_acme_7741</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-muted-foreground sm:inline">
              ameh@acme.dev
            </span>
            <span className="grid size-8 place-items-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">
              AS
            </span>
          </div>
        </header>
        <main className="flex-1 px-6 py-8">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
      </div>
      {actions ? <div className="flex gap-2">{actions}</div> : null}
    </div>
  );
}

export function StatusDot({ tone }: { tone: "success" | "warning" | "destructive" | "muted" }) {
  const map = {
    success: "bg-success",
    warning: "bg-warning",
    destructive: "bg-destructive",
    muted: "bg-muted-foreground",
  } as const;
  return <span className={`inline-block size-2 rounded-full ${map[tone]}`} />;
}
