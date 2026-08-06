import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { disasters, aidRequests, shelters, hospitals, volunteers } from "@/data/mock";

type LayerKey = "disasters" | "requests" | "shelters" | "hospitals" | "volunteers" | "safe";

const layerMeta: { key: LayerKey; label: string; dot: string }[] = [
  { key: "disasters", label: "Disasters", dot: "bg-destructive" },
  { key: "requests", label: "Rescue requests", dot: "bg-warning" },
  { key: "shelters", label: "Shelters & camps", dot: "bg-info" },
  { key: "hospitals", label: "Hospitals", dot: "bg-primary" },
  { key: "volunteers", label: "Volunteers", dot: "bg-success" },
  { key: "safe", label: "Safe zones", dot: "bg-muted-foreground" },
];

const safeZones = [
  { id: "SZ-1", name: "Highland Ridge Assembly", x: 34, y: 28 },
  { id: "SZ-2", name: "NH-16 Elevated Corridor", x: 78, y: 62 },
];

interface Pin {
  id: string;
  name: string;
  meta: string;
  x: number;
  y: number;
  tone: string;
  pulse?: boolean;
}

export function OperationsMap({
  height = "h-[560px]",
  title = "Live operational picture",
}: {
  height?: string;
  title?: string;
}) {
  const [active, setActive] = useState<Record<LayerKey, boolean>>({
    disasters: true,
    requests: true,
    shelters: true,
    hospitals: true,
    volunteers: true,
    safe: true,
  });
  const [selected, setSelected] = useState<Pin | null>(null);

  const pins: Pin[] = [
    ...(active.disasters
      ? disasters.map((d) => ({ id: d.id, name: `${d.type} — ${d.district}`, meta: `Severity ${d.aiSeverityScore}/100 · ${d.affected.toLocaleString()} affected`, x: d.x, y: d.y, tone: "bg-destructive", pulse: true }))
      : []),
    ...(active.requests
      ? aidRequests.filter((r) => r.status !== "resolved").map((r) => ({ id: r.id, name: `${r.kind} request — ${r.requester}`, meta: `${r.people} people · AI priority ${r.aiPriorityScore}`, x: r.x, y: r.y, tone: "bg-warning" }))
      : []),
    ...(active.shelters
      ? shelters.map((s) => ({ id: s.id, name: s.name, meta: `${s.occupied}/${s.capacity} occupied · meals ${s.meals}`, x: s.x, y: s.y, tone: "bg-info" }))
      : []),
    ...(active.hospitals
      ? hospitals.map((h) => ({ id: h.id, name: h.name, meta: `${h.bedsFree} beds · ${h.icuFree} ICU · ${h.ambulancesFree} ambulances free`, x: h.x, y: h.y, tone: "bg-primary" }))
      : []),
    ...(active.volunteers
      ? volunteers.map((v) => ({ id: v.id, name: v.name, meta: `${v.skill} · ${v.status}`, x: v.x, y: v.y, tone: "bg-success" }))
      : []),
    ...(active.safe
      ? safeZones.map((z) => ({ id: z.id, name: z.name, meta: "Verified safe zone", x: z.x, y: z.y, tone: "bg-muted-foreground" }))
      : []),
  ];

  return (
    <Card className="overflow-hidden border-border/60 bg-card/70 backdrop-blur">
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3">
        <CardTitle className="text-base">{title}</CardTitle>
        <div className="flex flex-wrap gap-1.5">
          {layerMeta.map((l) => (
            <button
              key={l.key}
              onClick={() => setActive((p) => ({ ...p, [l.key]: !p[l.key] }))}
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition-colors",
                active[l.key]
                  ? "border-border bg-secondary text-foreground"
                  : "border-border/50 text-muted-foreground opacity-60",
              )}
            >
              <span className={cn("size-2 rounded-full", l.dot)} />
              {l.label}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div
          className={cn(
            "relative w-full overflow-hidden rounded-xl border border-border/60 bg-secondary/40 grid-lines",
            height,
          )}
        >
          <div className="pointer-events-none absolute inset-0 hero-aurora opacity-70" />
          <svg className="pointer-events-none absolute inset-0 size-full opacity-40" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 62 C 18 54, 30 70, 46 60 S 74 40, 100 48" fill="none" stroke="var(--info)" strokeWidth="0.6" />
            <path d="M8 100 C 22 78, 38 82, 52 62 S 72 34, 88 0" fill="none" stroke="var(--info)" strokeWidth="0.4" />
            <path d="M0 20 L100 24" fill="none" stroke="var(--muted-foreground)" strokeWidth="0.25" strokeDasharray="2 2" />
          </svg>
          <div className="pointer-events-none absolute left-1/2 top-1/2 size-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/20">
            <div className="radar-sweep size-full rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,color-mix(in_oklab,var(--primary)_18%,transparent)_40deg,transparent_70deg)]" />
          </div>

          {pins.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelected(p)}
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              aria-label={p.name}
            >
              <span className="relative grid place-items-center">
                {p.pulse && <span className={cn("absolute size-4 rounded-full ping-ring", p.tone)} />}
                <span
                  className={cn(
                    "size-3.5 rounded-full border-2 border-background transition-transform hover:scale-150",
                    p.tone,
                    selected?.id === p.id && "scale-150 ring-2 ring-ring",
                  )}
                />
              </span>
            </button>
          ))}

          {selected && (
            <div className="absolute bottom-4 left-4 right-4 rise-in rounded-xl glass p-4 sm:max-w-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Badge variant="outline" className="mb-2 text-[10px]">{selected.id}</Badge>
                  <p className="font-semibold leading-tight">{selected.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{selected.meta}</p>
                </div>
                <button
                  className="text-xs text-muted-foreground hover:text-foreground"
                  onClick={() => setSelected(null)}
                >
                  Close
                </button>
              </div>
            </div>
          )}
          <div className="absolute right-3 top-3 rounded-lg glass px-3 py-2 text-[11px] text-muted-foreground">
            {pins.length} live entities · updated 12s ago
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
