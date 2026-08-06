import { Link } from "@tanstack/react-router";
import { Menu, Moon, Radio, Sun } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme";

const links = [
  { to: "/", label: "Home" },
  { to: "/map", label: "Live Map" },
  { to: "/ai", label: "AI Modules" },
  { to: "/alerts", label: "Alerts" },
  { to: "/dashboard/government", label: "Command Center" },
];

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <Button variant="ghost" size="icon" aria-label="Toggle theme" onClick={toggle}>
      {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  );
}

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="relative grid size-9 place-items-center rounded-xl gradient-signal">
        <Radio className="size-4.5 text-primary-foreground" />
        <span className="absolute inset-0 rounded-xl border border-primary/40 ping-ring" />
      </span>
      {!compact && (
        <span className="font-display text-lg font-bold tracking-tight">
          ResQ<span className="text-primary">Net</span>
        </span>
      )}
    </Link>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 glass-soft">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Brand />
        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeProps={{ className: "text-foreground bg-secondary" }}
              inactiveProps={{ className: "text-muted-foreground" }}
              activeOptions={{ exact: l.to === "/" }}
              className="rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link to="/auth">Sign in</Link>
          </Button>
          <Button asChild size="sm" className="gradient-signal border-0 text-primary-foreground">
            <Link to="/dashboard/citizen">Open app</Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
          >
            <Menu className="size-4" />
          </Button>
        </div>
      </nav>
      {open && (
        <div className="border-t border-border/60 px-4 py-3 md:hidden">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-card/40">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <Brand />
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            ResQNet is a unified disaster response and relief management platform connecting citizens,
            volunteers, NGOs, hospitals and government agencies on one live operational picture.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Platform</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/map" className="hover:text-foreground">Live map</Link></li>
            <li><Link to="/ai" className="hover:text-foreground">AI modules</Link></li>
            <li><Link to="/alerts" className="hover:text-foreground">Alert feed</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Dashboards</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/dashboard/citizen" className="hover:text-foreground">Citizen</Link></li>
            <li><Link to="/dashboard/volunteer" className="hover:text-foreground">Volunteer</Link></li>
            <li><Link to="/dashboard/government" className="hover:text-foreground">Government</Link></li>
            <li><Link to="/dashboard/admin" className="hover:text-foreground">Administrator</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 px-4 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} ResQNet. Emergency numbers: 112 · 108 · 1078
      </div>
    </footer>
  );
}
