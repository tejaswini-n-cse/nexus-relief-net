import { Link } from "@tanstack/react-router";
import {
  Bell,
  Boxes,
  HeartHandshake,
  Landmark,
  LifeBuoy,
  Map as MapIcon,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { Brand, ThemeToggle } from "@/components/site/chrome";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const nav: { to: string; label: string; icon: LucideIcon }[] = [
  { to: "/dashboard/citizen", label: "Citizen", icon: LifeBuoy },
  { to: "/dashboard/volunteer", label: "Volunteer", icon: HeartHandshake },
  { to: "/dashboard/ngo", label: "NGO Relief", icon: Boxes },
  { to: "/dashboard/hospital", label: "Hospital", icon: Stethoscope },
  { to: "/dashboard/government", label: "Command Center", icon: Landmark },
  { to: "/dashboard/admin", label: "Administrator", icon: ShieldCheck },
];

const tools: { to: string; label: string; icon: LucideIcon }[] = [
  { to: "/map", label: "Live Map", icon: MapIcon },
  { to: "/ai", label: "AI Modules", icon: Sparkles },
  { to: "/alerts", label: "Alerts", icon: Bell },
];

export function DashboardShell({
  title,
  subtitle,
  role,
  actions,
  children,
}: {
  title: string;
  subtitle: string;
  role: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="pointer-events-none fixed inset-0 hero-aurora opacity-60" aria-hidden />
      <div className="relative mx-auto flex max-w-[1600px]">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border/60 bg-sidebar/70 px-4 py-5 backdrop-blur-xl lg:flex">
          <Brand />
          <nav className="mt-8 space-y-1">
            <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Workspaces
            </p>
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeProps={{ className: "bg-sidebar-accent text-sidebar-accent-foreground glow" }}
                inactiveProps={{ className: "text-muted-foreground" }}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:text-foreground"
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            ))}
            <p className="px-3 pb-2 pt-6 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Operations
            </p>
            {tools.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeProps={{ className: "bg-sidebar-accent text-sidebar-accent-foreground" }}
                inactiveProps={{ className: "text-muted-foreground" }}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:text-foreground"
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            ))}
          </nav>
          <Card className="mt-auto border-destructive/30 bg-destructive/10">
            <CardContent className="space-y-2 p-4">
              <p className="text-sm font-semibold text-destructive">National emergency</p>
              <p className="text-2xl font-display font-bold">112</p>
              <p className="text-xs text-muted-foreground">Ambulance 108 · Disaster 1078</p>
            </CardContent>
          </Card>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-40 flex flex-wrap items-center justify-between gap-3 border-b border-border/60 glass-soft px-4 py-3 sm:px-6">
            <div className="lg:hidden">
              <Brand compact />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="truncate font-display text-lg font-bold sm:text-xl">{title}</h1>
                <Badge variant="outline" className="border-primary/40 text-primary">
                  {role}
                </Badge>
              </div>
              <p className="truncate text-xs text-muted-foreground sm:text-sm">{subtitle}</p>
            </div>
            <div className="flex items-center gap-2">
              {actions}
              <Button variant="ghost" size="icon" aria-label="Notifications" asChild>
                <Link to="/alerts">
                  <span className="relative">
                    <Bell className="size-4" />
                    <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-destructive" />
                  </span>
                </Link>
              </Button>
              <ThemeToggle />
              <Avatar className="size-8">
                <AvatarFallback className="bg-secondary text-xs">RN</AvatarFallback>
              </Avatar>
            </div>
          </header>
          <main className="space-y-6 p-4 sm:p-6">{children}</main>
          <nav className="sticky bottom-0 z-40 flex gap-1 overflow-x-auto border-t border-border/60 glass-soft p-2 lg:hidden">
            {[...nav, ...tools].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeProps={{ className: "bg-secondary text-foreground" }}
                className="flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground"
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}

export function StatCard({
  label,
  value,
  delta,
  icon: Icon,
  tone = "primary",
}: {
  label: string;
  value: string;
  delta?: string;
  icon: LucideIcon;
  tone?: "primary" | "destructive" | "success" | "warning" | "info";
}) {
  const tones = {
    primary: "text-primary bg-primary/10",
    destructive: "text-destructive bg-destructive/10",
    success: "text-success bg-success/10",
    warning: "text-warning bg-warning/10",
    info: "text-info bg-info/10",
  } as const;

  return (
    <Card className="lift overflow-hidden border-border/60 bg-card/70 backdrop-blur">
      <CardContent className="flex items-start justify-between gap-4 p-5">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="mt-2 font-display text-3xl font-bold tabular-nums">{value}</p>
          {delta && <p className="mt-1 text-xs text-muted-foreground">{delta}</p>}
        </div>
        <span className={cn("grid size-10 shrink-0 place-items-center rounded-xl", tones[tone])}>
          <Icon className="size-5" />
        </span>
      </CardContent>
    </Card>
  );
}
