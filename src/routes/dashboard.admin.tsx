import { createFileRoute } from "@tanstack/react-router";
import { Building2, Megaphone, ShieldCheck, UserCog } from "lucide-react";
import { toast } from "sonner";
import { DashboardShell, StatCard } from "@/components/dashboard/shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { adminUsers, disasters, hospitals, inventory, volunteers, aidRequests } from "@/data/mock";

export const Route = createFileRoute("/dashboard/admin")({
  head: () => ({
    meta: [
      { title: "Administrator Panel — ResQNet Platform Governance" },
      {
        name: "description",
        content:
          "Manage users, verification, reports, hospitals, NGOs, volunteers, disasters, resources and public announcements.",
      },
      { property: "og:title", content: "Administrator Panel — ResQNet" },
      { property: "og:description", content: "Platform-wide governance for the ResQNet disaster response network." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdminDashboard,
});

function AdminDashboard() {
  return (
    <DashboardShell
      title="Administrator panel"
      subtitle="Platform governance · 5 pending verifications · audit log enabled"
      role="Admin"
      actions={
        <Button className="gradient-signal border-0 text-primary-foreground" onClick={() => toast.success("Broadcast queued for approval")}>
          <Megaphone className="mr-1.5 size-4" /> New announcement
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Registered users" value="24,318" delta="+412 this week" icon={UserCog} tone="primary" />
        <StatCard label="Verified organisations" value="340" delta="8 awaiting review" icon={ShieldCheck} tone="success" />
        <StatCard label="Facilities onboard" value="126" delta="Hospitals + NGO warehouses" icon={Building2} tone="info" />
        <StatCard label="Reports today" value="1,204" delta="97 flagged for review" icon={Megaphone} tone="warning" />
      </div>

      <Card className="border-border/60 bg-card/70 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-base">Management console</CardTitle>
          <CardDescription>Every action here is written to the immutable audit trail.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="users">
            <TabsList className="flex-wrap">
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
              <TabsTrigger value="facilities">Hospitals & NGOs</TabsTrigger>
              <TabsTrigger value="volunteers">Volunteers</TabsTrigger>
              <TabsTrigger value="disasters">Disasters</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="announcements">Announcements</TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>District</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adminUsers.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell>
                        <p className="font-medium">{u.name}</p>
                        <p className="text-xs text-muted-foreground">{u.id}</p>
                      </TableCell>
                      <TableCell><Badge variant="secondary" className="capitalize">{u.role}</Badge></TableCell>
                      <TableCell className="text-sm">{u.district}</TableCell>
                      <TableCell>
                        <Badge variant={u.status === "verified" ? "outline" : "destructive"} className="capitalize">
                          {u.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline" onClick={() => toast.success(`${u.name} updated`)}>
                          {u.status === "verified" ? "Suspend" : "Verify"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="reports" className="mt-4 space-y-3">
              {aidRequests.map((r) => (
                <div key={r.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/60 bg-secondary/40 p-3">
                  <div>
                    <p className="font-medium">{r.kind} report · {r.requester}</p>
                    <p className="text-xs text-muted-foreground">{r.id} · {r.location} · {r.raisedAt}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => toast.success("Report verified")}>Verify</Button>
                    <Button size="sm" variant="ghost" onClick={() => toast.error("Report flagged as duplicate")}>Flag</Button>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="facilities" className="mt-4 grid gap-3 md:grid-cols-3">
              {hospitals.map((h) => (
                <div key={h.id} className="rounded-lg border border-border/60 bg-secondary/40 p-3">
                  <p className="font-medium">{h.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{h.beds} beds · {h.icu} ICU · {h.ambulances} ambulances</p>
                  <Badge variant="outline" className="mt-3">Verified facility</Badge>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="volunteers" className="mt-4 grid gap-3 md:grid-cols-2">
              {volunteers.map((v) => (
                <div key={v.id} className="flex items-center justify-between rounded-lg border border-border/60 bg-secondary/40 p-3">
                  <div>
                    <p className="font-medium">{v.name}</p>
                    <p className="text-xs text-muted-foreground">{v.skill} · ★ {v.rating} · {v.missions} missions</p>
                  </div>
                  <Switch defaultChecked onCheckedChange={() => toast.success("Volunteer access updated")} />
                </div>
              ))}
            </TabsContent>

            <TabsContent value="disasters" className="mt-4 space-y-3">
              {disasters.map((d) => (
                <div key={d.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/60 bg-secondary/40 p-3">
                  <div>
                    <p className="font-medium">{d.type} — {d.district}</p>
                    <p className="text-xs text-muted-foreground">{d.id} · declared {d.startedAt}</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => toast.success(`${d.id} closed`)}>Close incident</Button>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="resources" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Stock</TableHead>
                    <TableHead className="text-right">Allocated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventory.map((i) => (
                    <TableRow key={i.item}>
                      <TableCell className="font-medium">{i.item}</TableCell>
                      <TableCell><Badge variant="secondary">{i.category}</Badge></TableCell>
                      <TableCell className="text-right tabular-nums">{i.stock.toLocaleString()}</TableCell>
                      <TableCell className="text-right tabular-nums">{i.allocated.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="announcements" className="mt-4 max-w-2xl space-y-4">
              <div className="space-y-1.5">
                <Label>Title</Label>
                <Input placeholder="Evacuation order for Ward 9-14" />
              </div>
              <div className="space-y-1.5">
                <Label>Message</Label>
                <Textarea rows={4} placeholder="Residents must move to designated shelters before 18:00 IST." />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border/60 bg-secondary/40 p-3">
                <div>
                  <p className="text-sm font-medium">Send over SMS and IVR</p>
                  <p className="text-xs text-muted-foreground">Geo-fenced to affected wards</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Button className="gradient-signal border-0 text-primary-foreground" onClick={() => toast.success("Announcement broadcast")}>
                Broadcast now
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
