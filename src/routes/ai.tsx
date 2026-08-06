import { createFileRoute } from "@tanstack/react-router";
import { BrainCircuit, Sparkles, TrendingUp, Workflow } from "lucide-react";
import { Navbar, Footer } from "@/components/site/chrome";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { aiModules } from "@/data/mock";

export const Route = createFileRoute("/ai")({
  head: () => ({
    meta: [
      { title: "AI Modules — ResQNet Disaster Intelligence" },
      {
        name: "description",
        content:
          "Damage assessment, severity prediction, rescue triage, resource allocation, emergency chat and report summarization modules.",
      },
      { property: "og:title", content: "AI Modules — ResQNet Disaster Intelligence" },
      { property: "og:description", content: "Future-ready AI layer behind stable API contracts." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AiPage,
});

const pipeline = [
  { step: "Ingest", detail: "Citizen media, IoT gauges, satellite tiles, field logs" },
  { step: "Enrich", detail: "Geo-tagging, deduplication, vulnerability lookup" },
  { step: "Infer", detail: "Vision, tabular risk and language models" },
  { step: "Act", detail: "Triage queue, dispatch, allocation, SITREP" },
];

function AiPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-7xl space-y-10 px-4 py-12 sm:px-6">
        <header className="max-w-3xl">
          <Badge variant="outline" className="border-accent/40 text-accent">
            <Sparkles className="mr-1 size-3" /> Intelligence layer
          </Badge>
          <h1 className="mt-4 font-display text-4xl font-bold">AI modules</h1>
          <p className="mt-3 text-muted-foreground">
            Each module is an isolated service behind a versioned contract. Until a model is attached,
            the platform falls back to deterministic heuristics so operations never block on AI.
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {aiModules.map((m) => (
            <Card key={m.key} className="lift border-border/60 bg-card/70 backdrop-blur">
              <CardHeader className="flex flex-row items-start justify-between gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                  <BrainCircuit className="size-5" />
                </span>
                <Badge variant={m.status === "Live" ? "default" : "secondary"}>{m.status}</Badge>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-base">{m.name}</CardTitle>
                <p className="mt-2 text-sm text-muted-foreground">{m.desc}</p>
                <p className="mt-4 flex items-center gap-1.5 text-xs font-medium text-primary">
                  <TrendingUp className="size-3.5" /> {m.metric}
                </p>
                <code className="mt-4 block truncate rounded-md bg-secondary/60 px-2 py-1.5 text-[11px] text-muted-foreground">
                  POST /api/v1/ai/{m.key}
                </code>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-border/60 bg-card/70 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Workflow className="size-4 text-accent" /> Inference pipeline
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-4">
            {pipeline.map((p, i) => (
              <div key={p.step} className="rounded-xl border border-border/60 bg-secondary/40 p-4">
                <p className="text-xs text-muted-foreground">Stage {i + 1}</p>
                <p className="mt-1 font-display font-semibold">{p.step}</p>
                <p className="mt-1 text-sm text-muted-foreground">{p.detail}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-primary/30 bg-card/70 p-8 text-center backdrop-blur">
          <h2 className="font-display text-2xl font-bold">Bring your own models</h2>
          <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
            Swap in a state-hosted vision model or a hosted LLM without changing a single response
            workflow — the module contracts stay identical.
          </p>
          <div className="mt-6">
            <Button className="gradient-signal border-0 text-primary-foreground">Request integration guide</Button>
          </div>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
