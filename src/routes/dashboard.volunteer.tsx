import { createFileRoute } from "@tanstack/react-router";
import { Award, Camera, Navigation, Route as RouteIcon, Timer, Trophy, Users } from "lucide-react";
import { toast } from "sonner";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DashboardShell, StatCard } from "@/components/dashboard/shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { OperationsMap } from "@/components/map/operations-map";
import { aidRequests, missions, responseTimes, severityTone } from "@/data/mock";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/volunteer")({
  head: () => ({
    meta: [
      { title: "Volunteer Dashboard — ResQNet Rescue Missions" },
      {
        name: "description",
        content:
          "Accept nearby rescue missions, navigate to victims, update mission status and upload rescue evidence.",
      },
      { property: "og:title", content: "Volunteer Dashboard — ResQNet" },
      { property: "og:description", content: "Nearby rescue requests, navigation and mission performance." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VolunteerDashboard,
});

function VolunteerDashboard() {
  const open = aidRequests.filter((r) => r.status !== "resolved");

  return (
    <DashboardShell
      title="Volunteer operations"
      subtitle="Arjun Mehta · Boat Rescue · on duty since 04:20"
      role="Volunteer"
      actions={
        <Button variant="outline" onClick={() => toast.success("Status set to available")}>
          <Timer className="mr-1.5 size-4" /> Go available
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Missions completed" value="42" delta="+3 this week" icon={Trophy} tone="success" />
        <StatCard label="People rescued" value="187" delta="+11 this week" icon={Users} tone="primary" />
        <StatCard label="Avg. response" value="19 min" delta="Team avg 27 min" icon={Timer} tone="info" />
        <StatCard label="Reliability score" value="4.9" delta="Top 3% in district" icon={Award} tone="warning" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-border/60 bg-card/70 backdrop-blur lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Nearby rescue requests</CardTitle>
            <CardDescription>Ranked by AI priority score within a 10 km radius.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {open.map((r) => (
              <div
                key={r.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/60 bg-secondary/40 p-4"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium">{r.kind} · {r.requester}</p>
                    <Badge variant="outline" className={cn("capitalize", severityTone[r.priority])}>
                      {r.priority}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {r.location} · {r.people} people · {r.raisedAt}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[11px] text-muted-foreground">AI priority</span>
                    <Progress value={r.aiPriorityScore} className="h-1.5 w-28" />
                    <span className="text-[11px] font-medium tabular-nums">{r.aiPriorityScore}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => toast.info("Route opened", { description: `Navigating to ${r.location}` })}>
                    <Navigation className="mr-1.5 size-3.5" /> Navigate
                  </Button>
                  <Button
                    size="sm"
                    className="gradient-signal border-0 text-primary-foreground"
                    onClick={() => toast.success("Mission accepted", { description: `${r.id} assigned to you.` })}
                  >
                    Accept
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/70 backdrop-blur">
          <CardHeader><CardTitle className="text-base">My missions</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {missions.map((m) => (
              <div key={m.id} className="rounded-lg border border-border/60 bg-secondary/40 p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{m.type}</p>
                  <Badge variant={m.status === "completed" ? "secondary" : "default"} className="capitalize">
                    {m.status}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {m.people} people · {m.distanceKm} km · ETA {m.eta}
                </p>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => toast.success("Status updated")}>
                    <RouteIcon className="mr-1 size-3.5" /> Update
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => toast.success("Evidence uploaded")}>
                    <Camera className="mr-1 size-3.5" /> Evidence
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/60 bg-card/70 backdrop-blur">
          <CardHeader><CardTitle className="text-base">Weekly response time (minutes)</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={responseTimes}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    color: "var(--popover-foreground)",
                  }}
                />
                <Bar dataKey="minutes" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <OperationsMap height="h-64" title="Assignments near me" />
      </div>
    </DashboardShell>
  );
}
