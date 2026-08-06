import { createFileRoute } from "@tanstack/react-router";
import { Boxes, PackageCheck, Truck, Users } from "lucide-react";
import { toast } from "sonner";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { DashboardShell, StatCard } from "@/components/dashboard/shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { inventory, distributions, volunteers, resourceSplit } from "@/data/mock";

export const Route = createFileRoute("/dashboard/ngo")({
  head: () => ({
    meta: [
      { title: "NGO Relief Dashboard — ResQNet Inventory & Distribution" },
      {
        name: "description",
        content:
          "Track food, water, medicine and clothing stock, plan camp distributions and manage volunteer teams.",
      },
      { property: "og:title", content: "NGO Relief Dashboard — ResQNet" },
      { property: "og:description", content: "Relief inventory, distribution tracking and volunteer management." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NgoDashboard,
});

const chartColors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)"];

function NgoDashboard() {
  return (
    <DashboardShell
      title="NGO relief operations"
      subtitle="SahayataTrust · 4 warehouses · 62 field volunteers"
      role="NGO"
      actions={
        <Button className="gradient-signal border-0 text-primary-foreground" onClick={() => toast.success("Convoy scheduled")}>
          <Truck className="mr-1.5 size-4" /> Schedule convoy
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="SKUs in stock" value="6" delta="2 below reorder level" icon={Boxes} tone="primary" />
        <StatCard label="Beneficiaries served" value="18,420" delta="+2,310 today" icon={Users} tone="success" />
        <StatCard label="Convoys in transit" value="4" delta="1 delayed by road cut" icon={Truck} tone="warning" />
        <StatCard label="Deliveries verified" value="97%" delta="Photo proof + camp sign-off" icon={PackageCheck} tone="info" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-border/60 bg-card/70 backdrop-blur lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Resource inventory</CardTitle>
            <CardDescription>Live stock vs allocated across all warehouses.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                  <TableHead className="w-40">Allocated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventory.map((i) => {
                  const pct = Math.round((i.allocated / i.stock) * 100);
                  return (
                    <TableRow key={i.item}>
                      <TableCell className="font-medium">{i.item}</TableCell>
                      <TableCell><Badge variant="secondary">{i.category}</Badge></TableCell>
                      <TableCell className="text-right tabular-nums">
                        {i.stock.toLocaleString()} {i.unit}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={pct} className="h-1.5" />
                          <span className="w-10 text-right text-xs tabular-nums text-muted-foreground">{pct}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/70 backdrop-blur">
          <CardHeader><CardTitle className="text-base">Distribution mix</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={resourceSplit} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>
                  {resourceSplit.map((_, i) => (
                    <Cell key={i} fill={chartColors[i % chartColors.length]} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    color: "var(--popover-foreground)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-3 text-xs text-muted-foreground">
              {resourceSplit.map((r, i) => (
                <span key={r.name} className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full" style={{ background: chartColors[i] }} />
                  {r.name} {r.value}%
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/60 bg-card/70 backdrop-blur">
          <CardHeader><CardTitle className="text-base">Distribution tracking</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {distributions.map((d) => (
              <div key={d.id} className="flex items-center justify-between rounded-lg border border-border/60 bg-secondary/40 p-3">
                <div>
                  <p className="text-sm font-medium">{d.camp}</p>
                  <p className="text-xs text-muted-foreground">
                    {d.items} · {d.beneficiaries.toLocaleString()} beneficiaries · {d.at}
                  </p>
                </div>
                <Badge variant={d.status === "delivered" ? "secondary" : "default"} className="capitalize">
                  {d.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/70 backdrop-blur">
          <CardHeader><CardTitle className="text-base">Volunteer management</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {volunteers.map((v) => (
              <div key={v.id} className="flex items-center justify-between rounded-lg border border-border/60 bg-secondary/40 p-3">
                <div>
                  <p className="text-sm font-medium">{v.name}</p>
                  <p className="text-xs text-muted-foreground">{v.skill} · {v.missions} missions · ★ {v.rating}</p>
                </div>
                <Badge variant="outline" className="capitalize">{v.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
