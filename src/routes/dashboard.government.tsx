import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Home, Radar, Siren, UserSearch, Users } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DashboardShell, StatCard } from "@/components/dashboard/shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OperationsMap } from "@/components/map/operations-map";
import {
  disasters,
  aidRequests,
  shelters,
  hospitals,
  volunteers,
  requestTrend,
  responseTimes,
  severityTone,
} from "@/data/mock";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/government")({
  head: () => ({
    meta: [
      { title: "Government Command Center — ResQNet Analytics" },
      {
        name: "description",
        content:
          "Active disasters, rescue requests, missing persons, shelter occupancy, hospital status, heat maps and response analytics.",
      },
      { property: "og:title", content: "Government Command Center — ResQNet" },
      { property: "og:description", content: "Decision-grade disaster analytics for state and district authorities." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GovDashboard,
});

const heatRows = ["Kendrapara", "Pattamundai", "Aul", "Marshaghai", "Rajnagar"];
const heatCols = ["00", "04", "08", "12", "16", "20"];
const heatData = heatRows.map((r, ri) =>
  heatCols.map((_, ci) => Math.round(((ri * 7 + ci * 13) % 10) * 10 + (ci === 3 ? 20 : 0))),
);

const missing = [
  { id: "MP-441", name: "Bikash Jena", age: 34, lastSeen: "Ward 12 embankment", status: "searching" },
  { id: "MP-438", name: "Laxmi Barik", age: 61, lastSeen: "Rajnagar market", status: "found" },
  { id: "MP-430", name: "Sanjay Rout", age: 9, lastSeen: "Relief Camp A", status: "searching" },
];

function GovDashboard() {
  const totalAffected = disasters.reduce((a, d) => a + d.affected, 0);

  return (
    <DashboardShell
      title="State command center"
      subtitle="Coastal Command · 5 active incidents · data refreshed 12s ago"
      role="Government"
      actions={<Badge className="bg-destructive text-destructive-foreground">RED ALERT ACTIVE</Badge>}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active disasters" value={`${disasters.length}`} delta="1 critical · 2 high" icon={AlertTriangle} tone="destructive" />
        <StatCard label="People affected" value={`${(totalAffected / 1000).toFixed(0)}k`} delta="37k displaced" icon={Users} tone="warning" />
        <StatCard label="Open requests" value={`${aidRequests.filter((r) => r.status !== "resolved").length}`} delta="Avg dispatch 18 min" icon={Siren} tone="primary" />
        <StatCard label="Shelter occupancy" value="86%" delta="3,510 of 4,050 places" icon={Home} tone="info" />
      </div>

      <OperationsMap height="h-[420px]" title="Coastal Command — all layers" />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-border/60 bg-card/70 backdrop-blur lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Request volume by hour</CardTitle>
            <CardDescription>Rescue, medical and supply requests across the last 24 hours.</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={requestTrend}>
                <defs>
                  {["chart-1", "chart-2", "chart-3"].map((c) => (
                    <linearGradient key={c} id={c} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={`var(--${c})`} stopOpacity={0.5} />
                      <stop offset="100%" stopColor={`var(--${c})`} stopOpacity={0.02} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="hour" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12, color: "var(--popover-foreground)" }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="rescue" stroke="var(--chart-1)" fill="url(#chart-1)" strokeWidth={2} />
                <Area type="monotone" dataKey="medical" stroke="var(--chart-2)" fill="url(#chart-2)" strokeWidth={2} />
                <Area type="monotone" dataKey="supplies" stroke="var(--chart-3)" fill="url(#chart-3)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/70 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Radar className="size-4 text-primary" /> Request density heat map
            </CardTitle>
            <CardDescription>Block × hour intensity.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-[auto_repeat(6,1fr)] gap-1 text-[10px]">
              <span />
              {heatCols.map((c) => (
                <span key={c} className="text-center text-muted-foreground">{c}</span>
              ))}
              {heatRows.map((r, ri) => (
                <>
                  <span key={r} className="pr-2 text-right text-muted-foreground">{r.slice(0, 8)}</span>
                  {heatData[ri]!.map((v, ci) => (
                    <div
                      key={`${ri}-${ci}`}
                      title={`${r} @ ${heatCols[ci]}h — ${v}`}
                      className="aspect-square rounded-[4px]"
                      style={{
                        background: `color-mix(in oklab, var(--destructive) ${Math.min(v, 100)}%, var(--secondary))`,
                      }}
                    />
                  ))}
                </>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2 text-[10px] text-muted-foreground">
              Low
              <div className="h-2 flex-1 rounded-full bg-[linear-gradient(to_right,var(--secondary),var(--destructive))]" />
              High
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/60 bg-card/70 backdrop-blur">
        <CardHeader><CardTitle className="text-base">Operational registers</CardTitle></CardHeader>
        <CardContent>
          <Tabs defaultValue="disasters">
            <TabsList className="flex-wrap">
              <TabsTrigger value="disasters">Disasters</TabsTrigger>
              <TabsTrigger value="requests">Requests</TabsTrigger>
              <TabsTrigger value="missing">Missing persons</TabsTrigger>
              <TabsTrigger value="shelters">Shelters</TabsTrigger>
              <TabsTrigger value="hospitals">Hospitals</TabsTrigger>
              <TabsTrigger value="volunteers">Volunteers</TabsTrigger>
            </TabsList>

            <TabsContent value="disasters" className="mt-4 space-y-3">
              {disasters.map((d) => (
                <div key={d.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/60 bg-secondary/40 p-3">
                  <div>
                    <p className="font-medium">{d.type} — {d.district}</p>
                    <p className="text-xs text-muted-foreground">{d.id} · {d.startedAt} · {d.affected.toLocaleString()} affected</p>
                  </div>
                  <Badge variant="outline" className={cn("capitalize", severityTone[d.severity])}>{d.severity} · {d.aiSeverityScore}</Badge>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="requests" className="mt-4 space-y-3">
              {aidRequests.map((r) => (
                <div key={r.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/60 bg-secondary/40 p-3">
                  <div>
                    <p className="font-medium">{r.kind} · {r.location}</p>
                    <p className="text-xs text-muted-foreground">{r.id} · {r.people} people · {r.raisedAt}</p>
                  </div>
                  <Badge variant="outline" className="capitalize">{r.status}</Badge>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="missing" className="mt-4 space-y-3">
              {missing.map((m) => (
                <div key={m.id} className="flex items-center justify-between rounded-lg border border-border/60 bg-secondary/40 p-3">
                  <div className="flex items-center gap-3">
                    <UserSearch className="size-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{m.name}, {m.age}</p>
                      <p className="text-xs text-muted-foreground">{m.id} · last seen {m.lastSeen}</p>
                    </div>
                  </div>
                  <Badge variant={m.status === "found" ? "secondary" : "destructive"} className="capitalize">{m.status}</Badge>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="shelters" className="mt-4 space-y-4">
              {shelters.map((s) => (
                <div key={s.id}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{s.name} · {s.district}</span>
                    <span className="text-xs text-muted-foreground">{s.occupied}/{s.capacity} · meals {s.meals}</span>
                  </div>
                  <Progress value={(s.occupied / s.capacity) * 100} className="mt-2 h-1.5" />
                </div>
              ))}
            </TabsContent>

            <TabsContent value="hospitals" className="mt-4 grid gap-3 md:grid-cols-3">
              {hospitals.map((h) => (
                <div key={h.id} className="rounded-lg border border-border/60 bg-secondary/40 p-3">
                  <p className="font-medium">{h.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {h.bedsFree} beds · {h.icuFree} ICU · {h.doctorsOnCall} doctors
                  </p>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="volunteers" className="mt-4 grid gap-3 md:grid-cols-2">
              {volunteers.map((v) => (
                <div key={v.id} className="flex items-center justify-between rounded-lg border border-border/60 bg-secondary/40 p-3">
                  <div>
                    <p className="font-medium">{v.name}</p>
                    <p className="text-xs text-muted-foreground">{v.skill} · {v.missions} missions</p>
                  </div>
                  <Badge variant="outline" className="capitalize">{v.status}</Badge>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/60 bg-card/70 backdrop-blur">
          <CardHeader><CardTitle className="text-base">Average dispatch time trend</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={responseTimes}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12, color: "var(--popover-foreground)" }} />
                <Line type="monotone" dataKey="minutes" stroke="var(--chart-4)" strokeWidth={3} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/70 backdrop-blur">
          <CardHeader><CardTitle className="text-base">Resource distribution by block</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={heatRows.map((r, i) => ({ block: r, food: 40 + i * 12, medicine: 20 + i * 7 }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="block" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12, color: "var(--popover-foreground)" }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="food" stackId="a" fill="var(--chart-1)" radius={[0, 0, 0, 0]} />
                <Bar dataKey="medicine" stackId="a" fill="var(--chart-2)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
