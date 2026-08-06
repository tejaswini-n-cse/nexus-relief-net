import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Info, Megaphone, Radio, Siren } from "lucide-react";
import { Navbar, Footer } from "@/components/site/chrome";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { alerts, missions, emergencyContacts } from "@/data/mock";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/alerts")({
  head: () => ({
    meta: [
      { title: "Emergency Alerts & Broadcasts — ResQNet" },
      {
        name: "description",
        content:
          "Real-time emergency alerts, government broadcasts, rescue mission updates and verified emergency contact numbers.",
      },
      { property: "og:title", content: "Emergency Alerts & Broadcasts — ResQNet" },
      { property: "og:description", content: "Real-time alerts, rescue updates and government broadcasts." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AlertsPage,
});

const levelStyle = {
  critical: { icon: Siren, cls: "border-destructive/40 bg-destructive/10 text-destructive" },
  warning: { icon: AlertTriangle, cls: "border-warning/40 bg-warning/10 text-warning" },
  info: { icon: Info, cls: "border-info/40 bg-info/10 text-info" },
} as const;

function AlertsPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div>
            <h1 className="font-display text-3xl font-bold sm:text-4xl">Alert & broadcast feed</h1>
            <p className="mt-2 text-muted-foreground">
              Real-time notifications from state authorities, control rooms and active rescue missions.
            </p>
          </div>
          {alerts.map((a) => {
            const s = levelStyle[a.level];
            return (
              <Card key={a.id} className={cn("border bg-card/70 backdrop-blur rise-in", s.cls)}>
                <CardContent className="flex gap-4 p-5">
                  <s.icon className="mt-0.5 size-5 shrink-0" />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-semibold text-foreground">{a.title}</h2>
                      <Badge variant="outline" className="text-[10px] uppercase">{a.level}</Badge>
                    </div>
                    <p className="mt-1.5 text-sm text-muted-foreground">{a.body}</p>
                    <p className="mt-3 text-xs text-muted-foreground">
                      {a.issuer} · {a.at}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          <Card className="border-border/60 bg-card/70 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Radio className="size-4 text-primary" /> Rescue mission updates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {missions.map((m) => (
                <div key={m.id} className="flex items-center justify-between rounded-lg border border-border/60 bg-secondary/40 p-3">
                  <div>
                    <p className="text-sm font-medium">{m.type} · {m.people} people</p>
                    <p className="text-xs text-muted-foreground">{m.id} → {m.request} · {m.distanceKm} km</p>
                  </div>
                  <Badge variant={m.status === "completed" ? "secondary" : "default"} className="capitalize">
                    {m.status} {m.eta !== "—" && `· ETA ${m.eta}`}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-border/60 bg-card/70 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Megaphone className="size-4 text-accent" /> Emergency contacts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {emergencyContacts.map((c, i) => (
                <div key={c.number}>
                  {i > 0 && <Separator className="my-2" />}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{c.name}</span>
                    <a href={`tel:${c.number}`} className="font-display font-semibold text-primary hover:underline">
                      {c.number}
                    </a>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="border-destructive/30 bg-destructive/10">
            <CardContent className="p-5">
              <p className="font-display text-lg font-bold text-destructive">Broadcast policy</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Critical alerts fan out over push, SMS and IVR within 30 seconds of authority approval, and
                are geo-fenced to affected wards.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
