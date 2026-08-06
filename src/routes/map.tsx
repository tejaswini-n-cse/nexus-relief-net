import { createFileRoute } from "@tanstack/react-router";
import { Navbar, Footer } from "@/components/site/chrome";
import { OperationsMap } from "@/components/map/operations-map";
import { Card, CardContent } from "@/components/ui/card";
import { disasters, severityTone } from "@/data/mock";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Live Disaster Map — ResQNet" },
      {
        name: "description",
        content:
          "Layered live map of active disasters, rescue requests, shelters, hospitals, relief camps, volunteers and safe zones.",
      },
      { property: "og:title", content: "Live Disaster Map — ResQNet" },
      { property: "og:description", content: "One layered operational picture for every responding agency." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MapPage,
});

function MapPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-10 sm:px-6">
        <div>
          <h1 className="font-display text-3xl font-bold sm:text-4xl">Live operational map</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Toggle layers to isolate disasters, open requests, shelters, hospitals, volunteers and verified
            safe zones. Click any marker for its live record.
          </p>
        </div>
        <OperationsMap height="h-[620px]" title="National feed — all layers" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {disasters.map((d) => (
            <Card key={d.id} className="lift border-border/60 bg-card/70 backdrop-blur">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className={cn("capitalize", severityTone[d.severity])}>
                    {d.severity}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{d.startedAt}</span>
                </div>
                <h2 className="mt-3 font-display text-lg font-semibold">{d.type}</h2>
                <p className="text-sm text-muted-foreground">{d.district}</p>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Affected</p>
                    <p className="font-semibold tabular-nums">{d.affected.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Displaced</p>
                    <p className="font-semibold tabular-nums">{d.displaced.toLocaleString()}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-xs text-muted-foreground">AI severity index</p>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-secondary">
                    <div className="h-full gradient-signal" style={{ width: `${d.aiSeverityScore}%` }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
