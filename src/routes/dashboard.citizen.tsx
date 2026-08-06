import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Ambulance,
  Camera,
  Droplets,
  Home,
  MapPin,
  Pill,
  Siren,
  Utensils,
  Video,
  LifeBuoy,
  Clock,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";
import { DashboardShell, StatCard } from "@/components/dashboard/shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { aidRequests, shelters, hospitals, emergencyContacts, safetyGuides, alerts, severityTone } from "@/data/mock";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/citizen")({
  head: () => ({
    meta: [
      { title: "Citizen Dashboard — ResQNet SOS & Relief Requests" },
      {
        name: "description",
        content:
          "Report disasters with photos and GPS, raise SOS, request rescue, food, water, medicine or shelter and track status live.",
      },
      { property: "og:title", content: "Citizen Dashboard — ResQNet" },
      { property: "og:description", content: "SOS, relief requests and nearby shelters for citizens." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CitizenDashboard,
});

const needs = [
  { key: "Rescue", icon: LifeBuoy },
  { key: "Food", icon: Utensils },
  { key: "Water", icon: Droplets },
  { key: "Medicine", icon: Pill },
  { key: "Shelter", icon: Home },
];

function CitizenDashboard() {
  const [need, setNeed] = useState("Rescue");
  const myRequests = aidRequests.slice(0, 4);

  return (
    <DashboardShell
      title="Citizen workspace"
      subtitle="Kendrapara, Odisha · GPS lock 20.5°N, 86.4°E · accuracy 6 m"
      role="Citizen"
      actions={
        <Button
          className="bg-destructive text-destructive-foreground hover:bg-destructive/90 glow"
          onClick={() =>
            toast.error("SOS transmitted", {
              description: "Live location shared with the nearest control room and 3 volunteers.",
            })
          }
        >
          <Siren className="mr-1.5 size-4" /> SOS
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Open requests" value="3" delta="1 en-route" icon={LifeBuoy} tone="warning" />
        <StatCard label="Nearest shelter" value="1.8 km" delta="Govt High School Camp" icon={Home} tone="info" />
        <StatCard label="Nearest hospital" value="4.2 km" delta="58 beds free" icon={Ambulance} tone="primary" />
        <StatCard label="Active alerts" value="2" delta="1 red alert in your ward" icon={ShieldAlert} tone="destructive" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-border/60 bg-card/70 backdrop-blur lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Report a disaster / request help</CardTitle>
            <CardDescription>Attach media and your live GPS so responders can verify instantly.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-2 sm:grid-cols-5">
              {needs.map((n) => (
                <button
                  key={n.key}
                  onClick={() => setNeed(n.key)}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-xl border p-3 text-xs font-medium transition-colors",
                    need === n.key
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:text-foreground",
                  )}
                >
                  <n.icon className="size-5" />
                  {n.key}
                </button>
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Disaster type</Label>
                <Select defaultValue="flood">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flood">Flood</SelectItem>
                    <SelectItem value="earthquake">Earthquake</SelectItem>
                    <SelectItem value="cyclone">Cyclone</SelectItem>
                    <SelectItem value="landslide">Landslide</SelectItem>
                    <SelectItem value="fire">Fire</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>People affected</Label>
                <Input type="number" defaultValue={4} min={1} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Describe the situation</Label>
              <Textarea rows={3} placeholder="Water level rising on the ground floor, two elderly people need evacuation." />
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <Button variant="outline" className="justify-start"><Camera className="mr-2 size-4" /> Upload photos</Button>
              <Button variant="outline" className="justify-start"><Video className="mr-2 size-4" /> Upload video</Button>
              <Button variant="outline" className="justify-start"><MapPin className="mr-2 size-4" /> Use live GPS</Button>
            </div>

            <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 text-xs text-muted-foreground">
              AI damage assessment will grade uploaded media and pre-fill severity before a human verifies.
            </div>

            <Button
              className="w-full gradient-signal border-0 text-primary-foreground"
              onClick={() => toast.success("Request submitted", { description: `${need} request queued for AI triage.` })}
            >
              Submit {need.toLowerCase()} request
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-border/60 bg-card/70 backdrop-blur">
            <CardHeader><CardTitle className="text-base">Track my requests</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {myRequests.map((r) => (
                <div key={r.id} className="rounded-lg border border-border/60 bg-secondary/40 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{r.kind}</span>
                    <Badge variant="outline" className={cn("capitalize", severityTone[r.priority])}>{r.status}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{r.id} · {r.raisedAt}</p>
                  {r.eta && (
                    <p className="mt-2 flex items-center gap-1 text-xs text-primary">
                      <Clock className="size-3" /> ETA {r.eta}
                    </p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card/70 backdrop-blur">
            <CardHeader><CardTitle className="text-base">Emergency contacts</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {emergencyContacts.slice(0, 4).map((c, i) => (
                <div key={c.number}>
                  {i > 0 && <Separator className="my-2" />}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{c.name}</span>
                    <a href={`tel:${c.number}`} className="font-semibold text-primary">{c.number}</a>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-border/60 bg-card/70 backdrop-blur">
          <CardHeader><CardTitle className="text-base">Nearby shelters</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {shelters.map((s) => (
              <div key={s.id}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{s.name}</span>
                  <span className="text-xs text-muted-foreground">{s.occupied}/{s.capacity}</span>
                </div>
                <Progress value={(s.occupied / s.capacity) * 100} className="mt-2 h-1.5" />
                <p className="mt-1 text-xs text-muted-foreground">{s.district} · meals {s.meals}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/70 backdrop-blur">
          <CardHeader><CardTitle className="text-base">Nearby hospitals</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {hospitals.map((h) => (
              <div key={h.id} className="rounded-lg border border-border/60 bg-secondary/40 p-3">
                <p className="text-sm font-medium">{h.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {h.bedsFree} beds · {h.icuFree} ICU · {h.ambulancesFree} ambulances free
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/70 backdrop-blur">
          <CardHeader><CardTitle className="text-base">Government alerts</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {alerts.map((a) => (
              <div key={a.id} className="rounded-lg border border-border/60 bg-secondary/40 p-3">
                <p className="text-sm font-medium">{a.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{a.issuer} · {a.at}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/60 bg-card/70 backdrop-blur">
        <CardHeader><CardTitle className="text-base">Disaster safety guidelines</CardTitle></CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {safetyGuides.map((g) => (
              <AccordionItem key={g.title} value={g.title}>
                <AccordionTrigger>{g.title}</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                    {g.tips.map((t) => <li key={t}>{t}</li>)}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
