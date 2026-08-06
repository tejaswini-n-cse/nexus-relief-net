import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Activity,
  Boxes,
  BrainCircuit,
  HeartHandshake,
  Landmark,
  LifeBuoy,
  MapPinned,
  Quote,
  Radio,
  ShieldCheck,
  Siren,
  Stethoscope,
  Zap,
} from "lucide-react";
import { Navbar, Footer } from "@/components/site/chrome";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { OperationsMap } from "@/components/map/operations-map";
import { platformStats, testimonials, aiModules, ROLES } from "@/data/mock";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ResQNet — AI Disaster Response & Relief Command Platform" },
      {
        name: "description",
        content:
          "ResQNet unifies citizens, volunteers, NGOs, hospitals and government agencies on one AI-assisted disaster response, rescue and relief management platform.",
      },
      { property: "og:title", content: "ResQNet — AI Disaster Response & Relief Command Platform" },
      {
        property: "og:description",
        content:
          "ResQNet unifies citizens, volunteers, NGOs, hospitals and government agencies on one AI-assisted disaster response, rescue and relief management platform.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const roleIcons = { LifeBuoy, HeartHandshake, Boxes, Stethoscope, Landmark, ShieldCheck } as const;

const features = [
  { icon: Siren, title: "One-tap SOS with live GPS", desc: "Citizens raise verified rescue, food, water, medicine and shelter requests with photo, video and precise coordinates." },
  { icon: MapPinned, title: "Unified operational map", desc: "Disasters, requests, shelters, hospitals, relief camps, volunteers and safe zones on a single layered view." },
  { icon: BrainCircuit, title: "AI triage & severity index", desc: "Requests are re-scored every minute by survival risk, vulnerability and access difficulty." },
  { icon: Boxes, title: "Relief supply chain", desc: "NGO warehouses, stock levels and camp-level distribution tracked end to end with delivery proof." },
  { icon: Stethoscope, title: "Live hospital capacity", desc: "Beds, ICU, blood units, ambulances and on-call doctors streamed to the command room." },
  { icon: Activity, title: "Decision-grade analytics", desc: "Heat maps, response-time trends and shelter occupancy for cabinet-level situation reports." },
];

function Landing() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 hero-aurora" />
        <div className="pointer-events-none absolute inset-0 grid-lines opacity-40" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-28">
          <div className="rise-in">
            <Badge variant="outline" className="gap-2 border-primary/40 bg-primary/10 text-primary">
              <span className="size-1.5 rounded-full bg-primary" /> Live in 340 agencies · 99.98% event uptime
            </Badge>
            <h1 className="mt-6 font-display text-4xl font-bold leading-[1.05] sm:text-6xl">
              When minutes decide lives,{" "}
              <span className="text-gradient">every responder sees the same map.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              ResQNet is an AI-powered disaster response and relief management platform that connects
              citizens, volunteers, NGOs, hospitals and government control rooms into one live
              operational picture — from the first SOS to the last relief truck.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="gradient-signal border-0 text-primary-foreground glow">
                <Link to="/dashboard/government">
                  Launch command center <ArrowRight className="ml-1 size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/dashboard/citizen">
                  <Siren className="mr-1 size-4" /> Citizen SOS demo
                </Link>
              </Button>
            </div>
            <dl className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {platformStats.map((s) => (
                <div key={s.label}>
                  <dt className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</dt>
                  <dd className="mt-1 font-display text-2xl font-bold">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="rise-in [animation-delay:150ms]">
            <OperationsMap height="h-[440px]" title="Coastal Command — live feed" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">Built for the whole response chain</h2>
          <p className="mt-3 text-muted-foreground">
            Six role-specific workspaces sharing one verified source of truth, with strict role-based
            access control on every record.
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ROLES.map((r) => {
            const Icon = roleIcons[r.icon as keyof typeof roleIcons];
            return (
              <Link key={r.id} to={`/dashboard/${r.id}`}>
                <Card className="lift h-full border-border/60 bg-card/70 backdrop-blur">
                  <CardContent className="p-6">
                    <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </span>
                    <h3 className="mt-4 font-display text-lg font-semibold">{r.label}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{r.blurb}</p>
                    <p className="mt-4 flex items-center gap-1 text-sm font-medium text-primary">
                      Open workspace <ArrowRight className="size-3.5" />
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="border-y border-border/60 bg-card/30">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <h2 className="max-w-2xl font-display text-3xl font-bold sm:text-4xl">
            Everything a control room needs on day zero
          </h2>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <Card key={f.title} className="lift border-border/60 bg-card/70 backdrop-blur">
                <CardContent className="p-6">
                  <f.icon className="size-5 text-accent" />
                  <h3 className="mt-4 font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <Badge variant="outline" className="border-accent/40 text-accent">
              <Zap className="mr-1 size-3" /> Intelligence layer
            </Badge>
            <h2 className="mt-4 font-display text-3xl font-bold sm:text-4xl">AI modules, future-ready</h2>
            <p className="mt-3 text-muted-foreground">
              Every module ships behind a stable contract, so models can be swapped without touching the
              response workflows.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link to="/ai">Explore AI modules</Link>
          </Button>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {aiModules.map((m) => (
            <Card key={m.key} className="lift border-border/60 bg-card/70 backdrop-blur">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <BrainCircuit className="size-5 text-primary" />
                  <Badge variant="secondary">{m.status}</Badge>
                </div>
                <h3 className="mt-4 font-semibold">{m.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{m.desc}</p>
                <p className="mt-4 text-xs font-medium text-primary">{m.metric}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-y border-border/60 bg-card/30">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">Trusted in the field</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {testimonials.map((t) => (
              <Card key={t.name} className="lift border-border/60 bg-card/70 backdrop-blur">
                <CardContent className="p-6">
                  <Quote className="size-5 text-accent" />
                  <p className="mt-4 text-sm leading-relaxed">{t.quote}</p>
                  <div className="mt-6">
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.title}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <Card className="overflow-hidden border-primary/30 bg-card/70 backdrop-blur">
          <div className="relative p-10 text-center">
            <div className="pointer-events-none absolute inset-0 hero-aurora opacity-80" />
            <div className="relative">
              <Radio className="mx-auto size-6 text-primary" />
              <h2 className="mt-4 font-display text-3xl font-bold sm:text-4xl">
                Stand up your state command center
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
                Deploy ResQNet for your district or state agency with role-based onboarding, offline-first
                field capture and full audit trails.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button asChild size="lg" className="gradient-signal border-0 text-primary-foreground">
                  <Link to="/auth">Create an account</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/map">View live map</Link>
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </section>

      <Footer />
    </div>
  );
}
