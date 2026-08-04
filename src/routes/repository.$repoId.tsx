import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowUpRight,
  CircleDot,
  GitFork,
  Lightbulb,
  RefreshCw,
  Sparkle,
  Star,
} from "lucide-react";

import { AppShell } from "@/components/layout/AppShell";
import { HealthRing } from "@/components/shared/HealthRing";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  healthBreakdown,
  interviewQuestions,
  readmePreview,
  repositories,
  suggestions,
} from "@/lib/data";
import type { Repo } from "@/lib/data";

export const Route = createFileRoute("/repository/$repoId")({
  loader: ({ params }) => {
    const repo = repositories.find((r) => r.id === params.repoId);
    if (!repo) throw notFound();
    return { repo };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Repository unavailable — RepoIQ" }, { name: "robots", content: "noindex" }] };
    }
    const title = `${loaderData.repo.name} — Repository analysis | RepoIQ`;
    return {
      meta: [
        { title },
        { name: "description", content: loaderData.repo.description },
        { property: "og:title", content: title },
        { property: "og:description", content: loaderData.repo.description },
      ],
    };
  },
  component: RepositoryPage,
});

const impactTone: Record<string, string> = {
  High: "border-destructive/40 text-destructive",
  Medium: "border-warning/40 text-warning",
  Low: "border-border text-muted-foreground",
};

const difficultyTone: Record<string, string> = {
  Hard: "border-destructive/40 text-destructive",
  Medium: "border-warning/40 text-warning",
  Easy: "border-success/40 text-success",
};

function RepositoryPage() {
  const { repo } = Route.useLoaderData() as { repo: Repo };

  return (
    <AppShell title={repo.name} subtitle={`${repo.owner}/${repo.name} · analyzed 12 minutes ago`}>
      <div className="grid gap-4 lg:grid-cols-3">
        <section className="rounded-xl border border-border bg-card p-6 lg:col-span-2">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
            <div className="min-w-0">
              <h2 className="font-display text-lg font-semibold">Repository overview</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {repo.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {repo.topics.map((t) => (
                  <Badge key={t} variant="secondary" className="font-normal">
                    {t}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button variant="outline" size="sm" className="gap-1.5">
                <RefreshCw className="h-3.5 w-3.5" /> Re-analyze
              </Button>
            </div>
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { icon: Star, label: "Stars", value: repo.stars.toLocaleString() },
              { icon: GitFork, label: "Forks", value: repo.forks.toString() },
              { icon: CircleDot, label: "Open issues", value: repo.issues.toString() },
              { icon: ArrowUpRight, label: "Updated", value: repo.updated },
            ].map((s) => (
              <div key={s.label} className="rounded-lg border border-border bg-surface/60 p-4">
                <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <s.icon className="h-3.5 w-3.5" /> {s.label}
                </dt>
                <dd className="mt-1.5 truncate font-display text-lg font-semibold">{s.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-display text-lg font-semibold">Health score</h2>
          <div className="mt-5 flex flex-col items-center">
            <HealthRing score={repo.health} size={120} label="overall" />
          </div>
          <div className="mt-6 space-y-3">
            {healthBreakdown.map((h) => (
              <div key={h.label}>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{h.label}</span>
                  <span className="font-medium">{h.value}</span>
                </div>
                <Progress value={h.value} className="mt-1.5 h-1.5" />
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="mt-4 rounded-xl border border-primary/25 bg-card p-6 shadow-glow">
        <div className="flex items-center gap-2">
          <Sparkle className="h-4 w-4 text-primary" />
          <h2 className="font-display text-lg font-semibold">AI summary</h2>
        </div>
        <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            <span className="text-foreground">{repo.name}</span> is a {repo.language}-first service
            organised around a thin ingress layer, a resolver core and a set of pluggable adapters.
            Roughly 62% of the code lives under the core module, which also absorbs most of the
            recent commit activity.
          </p>
          <p>
            The architecture is conventional and easy to follow: requests enter through the gateway,
            are authenticated, resolved against downstream services, then cached in a layered store.
            Observability is wired throughout, which makes the runtime behaviour unusually legible.
          </p>
          <p>
            The main risk is concentration — the most-changed module also carries the least test
            coverage, and the caching strategy is undocumented. Both are cheap to fix and would move
            the health score into the low nineties.
          </p>
        </div>
        <div className="mt-5">
          <Button asChild variant="outline" size="sm">
            <Link to="/chat">Ask a follow-up question</Link>
          </Button>
        </div>
      </section>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-display text-lg font-semibold">Languages</h2>
          <div className="mt-5 flex h-2.5 w-full overflow-hidden rounded-full">
            {repo.languages.map((l, i) => (
              <span
                key={l.name}
                style={{
                  width: `${l.percent}%`,
                  background: `var(--chart-${(i % 5) + 1})`,
                }}
              />
            ))}
          </div>
          <ul className="mt-5 space-y-2.5">
            {repo.languages.map((l, i) => (
              <li key={l.name} className="flex items-center gap-2 text-sm">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: `var(--chart-${(i % 5) + 1})` }}
                />
                <span className="text-muted-foreground">{l.name}</span>
                <span className="ml-auto font-medium">{l.percent}%</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-lg font-semibold">README preview</h2>
            <Badge variant="outline">README.md</Badge>
          </div>
          <pre className="mt-5 max-h-72 overflow-auto rounded-lg border border-border bg-surface/70 p-4 font-mono text-xs leading-relaxed text-muted-foreground">
            {readmePreview}
          </pre>
        </section>
      </div>

      <section className="mt-4 rounded-xl border border-border bg-card p-6">
        <Tabs defaultValue="questions">
          <TabsList>
            <TabsTrigger value="questions">Interview questions</TabsTrigger>
            <TabsTrigger value="suggestions">Improvement suggestions</TabsTrigger>
          </TabsList>

          <TabsContent value="questions" className="mt-5">
            <ul className="space-y-3">
              {interviewQuestions.map((q) => (
                <li
                  key={q.q}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 rounded-lg border border-border bg-surface/60 p-4"
                >
                  <div className="min-w-0">
                    <p className="text-sm leading-relaxed">{q.q}</p>
                    <p className="mt-1.5 text-xs text-muted-foreground">{q.tag}</p>
                  </div>
                  <Badge variant="outline" className={difficultyTone[q.difficulty]}>
                    {q.difficulty}
                  </Badge>
                </li>
              ))}
            </ul>
          </TabsContent>

          <TabsContent value="suggestions" className="mt-5">
            <Accordion type="single" collapsible className="w-full">
              {suggestions.map((s) => (
                <AccordionItem key={s.title} value={s.title}>
                  <AccordionTrigger className="text-left">
                    <span className="flex min-w-0 items-center gap-3">
                      <Lightbulb className="h-4 w-4 shrink-0 text-primary" />
                      <span className="truncate text-sm">{s.title}</span>
                      <Badge variant="outline" className={`${impactTone[s.impact]} shrink-0`}>
                        {s.impact}
                      </Badge>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                    {s.detail}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>
        </Tabs>
      </section>
    </AppShell>
  );
}
