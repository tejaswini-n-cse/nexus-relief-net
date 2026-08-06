import { createFileRoute } from "@tanstack/react-router";
import { Ambulance, BedDouble, Droplet, HeartPulse, Stethoscope } from "lucide-react";
import { toast } from "sonner";
import { DashboardShell, StatCard } from "@/components/dashboard/shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { hospitals } from "@/data/mock";

export const Route = createFileRoute("/dashboard/hospital")({
  head: () => ({
    meta: [
      { title: "Hospital Dashboard — ResQNet Capacity & Triage" },
      {
        name: "description",
        content:
          "Publish live bed, ICU, blood and ambulance availability, track emergency doctors and incoming disaster patients.",
      },
      { property: "og:title", content: "Hospital Dashboard — ResQNet" },
      { property: "og:description", content: "Live hospital capacity for disaster response coordination." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HospitalDashboard,
});

const patients = [
  { id: "PT-8821", name: "Ravi Sahu", condition: "Hypothermia", triage: "Yellow", from: "REQ-90341", status: "In observation" },
  { id: "PT-8819", name: "Kavita Das", condition: "Fracture (tibia)", triage: "Yellow", from: "Camp B", status: "Surgery scheduled" },
  { id: "PT-8815", name: "Unidentified male", condition: "Near drowning", triage: "Red", from: "Boat rescue", status: "ICU" },
  { id: "PT-8808", name: "Sunita Behera", condition: "Snake bite", triage: "Red", from: "Ambulance 108", status: "Stabilised" },
];

const triageTone: Record<string, string> = {
  Red: "bg-destructive/15 text-destructive border-destructive/30",
  Yellow: "bg-warning/15 text-warning border-warning/30",
  Green: "bg-success/15 text-success border-success/30",
};

function HospitalDashboard() {
  const h = hospitals[0]!;

  return (
    <DashboardShell
      title="Hospital capacity"
      subtitle={`${h.name} · reporting live to district control room`}
      role="Hospital"
      actions={
        <Button className="gradient-signal border-0 text-primary-foreground" onClick={() => toast.success("Capacity published to control room")}>
          Publish update
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Beds available" value={`${h.bedsFree}`} delta={`of ${h.beds} total`} icon={BedDouble} tone="primary" />
        <StatCard label="ICU available" value={`${h.icuFree}`} delta={`of ${h.icu} ICU beds`} icon={HeartPulse} tone="destructive" />
        <StatCard label="Ambulances free" value={`${h.ambulancesFree}`} delta={`of ${h.ambulances} in fleet`} icon={Ambulance} tone="warning" />
        <StatCard label="Doctors on call" value={`${h.doctorsOnCall}`} delta="6 emergency specialists" icon={Stethoscope} tone="success" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-border/60 bg-card/70 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Droplet className="size-4 text-destructive" /> Blood bank availability
            </CardTitle>
            <CardDescription>Units in store, refreshed every 15 minutes.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(h.blood).map(([group, units]) => (
              <div key={group}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{group}</span>
                  <span className={units < 10 ? "text-destructive" : "text-muted-foreground"}>{units} units</span>
                </div>
                <Progress value={Math.min(units, 100)} className="mt-2 h-1.5" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/70 backdrop-blur lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Patient tracking</CardTitle>
            <CardDescription>Disaster-linked admissions with triage colour coding.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Triage</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <p className="font-medium">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.id}</p>
                    </TableCell>
                    <TableCell className="text-sm">{p.condition}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={triageTone[p.triage]}>{p.triage}</Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{p.from}</TableCell>
                    <TableCell className="text-sm">{p.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/60 bg-card/70 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-base">Network capacity</CardTitle>
          <CardDescription>Other facilities visible to the control room for load balancing.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {hospitals.map((x) => (
            <div key={x.id} className="rounded-xl border border-border/60 bg-secondary/40 p-4">
              <p className="font-medium">{x.name}</p>
              <div className="mt-3 space-y-2 text-xs text-muted-foreground">
                <div className="flex justify-between"><span>Beds free</span><span className="tabular-nums text-foreground">{x.bedsFree}</span></div>
                <div className="flex justify-between"><span>ICU free</span><span className="tabular-nums text-foreground">{x.icuFree}</span></div>
                <div className="flex justify-between"><span>Ambulances</span><span className="tabular-nums text-foreground">{x.ambulancesFree}/{x.ambulances}</span></div>
              </div>
              <Progress value={(x.bedsFree / x.beds) * 100} className="mt-3 h-1.5" />
            </div>
          ))}
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
