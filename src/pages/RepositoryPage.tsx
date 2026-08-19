import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import {
  ArrowUpRight,
  CircleDot,
  GitFork,
  Lightbulb,
  RefreshCw,
  Sparkle,
  Star,
} from "lucide-react";

import { AppShell } from "@/layouts/AppShell";
import { HealthRing } from "@/components/shared/HealthRing";
import { RepositoryActions } from "@/components/repository/RepositoryActions";
import { RepositoryHeader } from "@/components/repository/RepositoryHeader";
import { RepositoryStats } from "@/components/repository/RepositoryStats";
import { StatusCard } from "@/components/repository/StatusCard";
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
  generateAnalysis,
  generateHealthScore,
  generateReadme,
  getAnalysis,
  getRepositoryDetails,
  type AnalysisResponse,
} from "@/services/repositoryApi";
import { healthBreakdown, interviewQuestions, suggestions } from "@/utils/mockData";
import type { HealthScoreCheck, Repo } from "@/types/repository";

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

export function RepositoryPage() {
  const { repoId } = useParams();
  const [repo, setRepo] = useState<Repo | null>(null);
  const [isMissing, setIsMissing] = useState(false);
  const [healthChecks, setHealthChecks] = useState<HealthScoreCheck[]>([]);
  const [isGeneratingHealthScore, setIsGeneratingHealthScore] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [isGeneratingReadme, setIsGeneratingReadme] = useState(false);
  const [readmeError, setReadmeError] = useState<string | null>(null);

  useEffect(() => {
    if (!repoId) {
      setIsMissing(true);
      return;
    }

    void getRepositoryDetails(Number(repoId))
      .then((details) => {
        const importedAt = details.imported_at
          ? new Date(details.imported_at).toLocaleDateString()
          : "—";

        const nextRepo: Repo = {
          id: String(details.id),
          name: details.name,
          owner: details.owner,
          description: details.description ?? "",
          language: details.primary_language ?? "Unknown",
          stars: Number.isFinite(details.stars) ? details.stars : 0,
          forks: Number.isFinite(details.forks) ? details.forks : 0,
          issues: 0,
          health: details.health_score ?? 0,
          visibility: "Public",
          updated: importedAt,
          topics: [],
          languages: [],
          defaultBranch: details.default_branch ?? "main",
          importedAt,
        };

        setRepo(nextRepo);
        setHealthChecks(nextRepo.healthChecks ?? []);
      })
      .catch(() => {
        setIsMissing(true);
      });

    void getAnalysis(Number(repoId)).then(setAnalysis).catch(() => setAnalysis(null));
  }, [repoId]);

  const handleGenerateHealthScore = async () => {
    if (!repoId) return;

    setIsGeneratingHealthScore(true);

    try {
      const result = await generateHealthScore(Number(repoId));
      setRepo((current) =>
        current
          ? {
              ...current,
              health: result.score,
              healthChecks: result.breakdown,
            }
          : current,
      );
      setHealthChecks(result.breakdown);
    } catch {
      setIsMissing(true);
    } finally {
      setIsGeneratingHealthScore(false);
    }
  };

  const handleAnalyze = async () => {
    if (!repoId) return;

    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const result = await generateAnalysis(Number(repoId));
      setAnalysis(result);
    } catch {
      setAnalysisError("Could not generate an AI summary right now. Try again in a moment.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateReadme = async () => {
    if (!repoId) return;

    setIsGeneratingReadme(true);
    setReadmeError(null);

    try {
      const result = await generateReadme(Number(repoId));
      setAnalysis(result);
    } catch {
      setReadmeError("Could not generate a README right now. Try again in a moment.");
    } finally {
      setIsGeneratingReadme(false);
    }
  };

  if (isMissing) return <Navigate to="/dashboard" replace />;
  if (!repo) {
    return (
      <AppShell title="Loading" subtitle="Loading repository details">
        <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
          Loading repository details...
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title={repo.name} subtitle={`${repo.owner}/${repo.name}`}>
      <div className="space-y-4">
        <RepositoryHeader repo={repo} />
        <RepositoryActions
          onGenerateHealthScore={handleGenerateHealthScore}
          isGenerating={isGeneratingHealthScore}
          onAnalyze={handleAnalyze}
          isAnalyzing={isAnalyzing}
          onGenerateReadme={handleGenerateReadme}
          isGeneratingReadme={isGeneratingReadme}
        />
        <div className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
          <RepositoryStats repo={repo} />
          <StatusCard
            healthScore={repo.health}
            analysisStatus={analysis ? "Analyzed" : "Imported"}
            primaryLanguage={repo.language}
          />
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <section className="rounded-xl border border-border bg-card p-6 lg:col-span-2">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
            <div className="min-w-0">
              <h2 className="font-display text-lg font-semibold">Repository overview</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{repo.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {repo.topics?.length ? (
                  repo.topics.map((t) => (
                    <Badge key={t} variant="secondary" className="font-normal">
                      {t}
                    </Badge>
                  ))
                ) : null}
              </div>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button variant="outline" size="sm" className="gap-1.5" onClick={handleAnalyze} disabled={isAnalyzing}>
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
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-lg font-semibold">Health score</h2>
            <span className="text-sm font-medium text-primary">{repo.health}%</span>
          </div>
          <div className="mt-5 flex flex-col items-center">
            <HealthRing score={repo.health} size={120} label="overall" />
          </div>
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Repository health</span>
              <span className="font-medium">{repo.health}%</span>
            </div>
            <Progress value={repo.health} className="mt-1.5 h-1.5" />
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
          <div className="mt-6 rounded-lg border border-border bg-surface/60 p-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-medium">Checklist</h3>
              <span className="text-xs text-muted-foreground">Deterministic GitHub signals</span>
            </div>
            <div className="mt-4 space-y-2">
              {healthChecks.length > 0 ? (
                healthChecks.map((check) => (
                  <div
                    key={check.name}
                    className="flex items-start justify-between gap-3 rounded-md border border-border bg-card px-3 py-2 text-xs"
                  >
                    <div className="min-w-0">
                      <div className="font-medium text-foreground">{check.name}</div>
                      <div className="mt-1 text-muted-foreground">{check.detail}</div>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2 py-1 ${
                        check.passed
                          ? "bg-success/15 text-success"
                          : "bg-destructive/15 text-destructive"
                      }`}
                    >
                      {check.passed ? "Pass" : "Fail"}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground">
                  No health score checks have been generated yet.
                </p>
              )}
            </div>
          </div>
        </section>
      </div>

      <section className="mt-4 rounded-xl border border-primary/25 bg-card p-6 shadow-glow">
        <div className="flex items-center gap-2">
          <Sparkle className="h-4 w-4 text-primary" />
          <h2 className="font-display text-lg font-semibold">AI summary</h2>
        </div>

        {analysisError ? (
          <p className="mt-3 text-sm text-destructive">{analysisError}</p>
        ) : null}

        {isAnalyzing ? (
          <p className="mt-4 text-sm text-muted-foreground">Analyzing repository with AI…</p>
        ) : analysis ? (
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
            {analysis.summary ? (
              <p>
                <span className="font-medium text-foreground">Summary: </span>
                {analysis.summary}
              </p>
            ) : null}
            {analysis.architecture ? (
              <p>
                <span className="font-medium text-foreground">Architecture: </span>
                {analysis.architecture}
              </p>
            ) : null}
            {analysis.tech_stack ? (
              <p>
                <span className="font-medium text-foreground">Tech stack: </span>
                {analysis.tech_stack}
              </p>
            ) : null}
            {analysis.use_cases ? (
              <p>
                <span className="font-medium text-foreground">Use cases: </span>
                {analysis.use_cases}
              </p>
            ) : null}
            {analysis.limitations ? (
              <p>
                <span className="font-medium text-foreground">Limitations: </span>
                {analysis.limitations}
              </p>
            ) : null}
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">
            No AI summary yet. Click "Analyze Repository" above to generate one.
          </p>
        )}

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
            <h2 className="font-display text-lg font-semibold">README</h2>
            <Badge variant="outline">README.md</Badge>
          </div>

          {readmeError ? (
            <p className="mt-3 text-sm text-destructive">{readmeError}</p>
          ) : null}

          {isGeneratingReadme ? (
            <p className="mt-4 text-sm text-muted-foreground">Generating README with AI…</p>
          ) : analysis?.readme_markdown ? (
            <pre className="mt-5 max-h-72 overflow-auto whitespace-pre-wrap rounded-lg border border-border bg-surface/70 p-4 font-mono text-xs leading-relaxed text-muted-foreground">
              {analysis.readme_markdown}
            </pre>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              No README generated yet. Click "Generate README" above.
            </p>
          )}
        </section>
      </div>

      <div className="mt-4">
        <RepositoryActions
          onGenerateHealthScore={handleGenerateHealthScore}
          isGenerating={isGeneratingHealthScore}
          onAnalyze={handleAnalyze}
          isAnalyzing={isAnalyzing}
          onGenerateReadme={handleGenerateReadme}
          isGeneratingReadme={isGeneratingReadme}
        />
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