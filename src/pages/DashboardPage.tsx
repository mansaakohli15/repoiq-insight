import { useState } from "react";
import { Link } from "react-router-dom";
import { Activity, FolderGit2, GaugeCircle, Plus, ShieldAlert } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { RepoCard } from "@/components/dashboard/RepoCard";
import { StatCard } from "@/components/dashboard/StatCard";
import { RepositoryImportModal } from "@/components/RepositoryImportModal";
import { AppShell } from "@/layouts/AppShell";
import { HealthRing } from "@/components/shared/HealthRing";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { importRepository } from "@/services/repositoryApi";
import type { Repo } from "@/types/repository";
import {
  analyticsSeries,
  healthBreakdown,
  languageSplit,
  recentAnalyses,
  repositories,
} from "@/utils/mockData";

const pieColors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

const statusTone: Record<string, string> = {
  Completed: "border-success/40 text-success",
  "Needs review": "border-warning/40 text-warning",
  Failed: "border-destructive/40 text-destructive",
};

export function DashboardPage() {
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [repositoryList, setRepositoryList] = useState<Repo[]>(repositories);

  const refreshDashboard = (importedRepo: Repo) => {
    setRepositoryList((current) => [importedRepo, ...current]);
  };

  return (
    <AppShell title="Dashboard" subtitle="Workspace overview for Northwind Labs">
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <Button className="gap-2" onClick={() => setIsImportOpen(true)}>
          <Plus className="h-4 w-4" /> Import Repository
        </Button>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Analyze repository
        </Button>
        <Button variant="outline" asChild>
          <Link to="/chat">Ask the AI</Link>
        </Button>
      </div>

      {notice ? (
        <div className="mb-4 rounded-md border border-success/40 bg-success/10 px-3 py-2 text-sm text-success">
          {notice}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={FolderGit2} label="Repositories" value="24" delta="+3" />
        <StatCard icon={Activity} label="Analyses this month" value="63" delta="+18%" />
        <StatCard icon={GaugeCircle} label="Median health" value="86" delta="+4" />
        <StatCard icon={ShieldAlert} label="Open risks" value="11" delta="+2" positive={false} />
      </div>

      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="font-display text-lg font-semibold">Repositories</h2>
          <span className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
            View all
          </span>
        </div>
        <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {repositoryList.map((r) => (
            <RepoCard key={r.id} repo={r} />
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-6 lg:col-span-1">
          <h2 className="font-display text-base font-semibold">Workspace health</h2>
          <div className="mt-5 flex items-center gap-6">
            <HealthRing score={86} size={104} />
            <div className="min-w-0 flex-1 space-y-3">
              {healthBreakdown.map((h) => (
                <div key={h.label}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="truncate text-muted-foreground">{h.label}</span>
                    <span className="font-medium">{h.value}</span>
                  </div>
                  <Progress value={h.value} className="mt-1.5 h-1.5" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="font-display text-base font-semibold">Recent analyses</h2>
            <Badge variant="outline">Last 7 days</Badge>
          </div>
          <div className="space-y-1">
            {recentAnalyses.map((a) => (
              <div
                key={a.repo}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-surface-2/60"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{a.repo}</p>
                  <p className="text-xs text-muted-foreground">
                    {a.time} · {a.duration}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <Badge variant="outline" className={statusTone[a.status]}>
                    {a.status}
                  </Badge>
                  <span className="w-8 text-right font-display text-sm font-semibold">
                    {a.score || "—"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="mb-4 font-display text-lg font-semibold">Analytics</h2>
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-6 lg:col-span-2">
            <h3 className="text-sm font-medium">Analyses & average score</h3>
            <div className="mt-6 h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analyticsSeries}>
                  <defs>
                    <linearGradient id="fillAnalyses" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis
                    dataKey="month"
                    stroke="var(--muted-foreground)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="var(--muted-foreground)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "var(--popover)",
                      border: "1px solid var(--border)",
                      borderRadius: 10,
                      fontSize: 12,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="analyses"
                    stroke="var(--chart-1)"
                    strokeWidth={2}
                    fill="url(#fillAnalyses)"
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="var(--chart-2)"
                    strokeWidth={2}
                    fillOpacity={0}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-sm font-medium">Language distribution</h3>
            <div className="mt-4 h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={languageSplit}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={3}
                    stroke="none"
                  >
                    {languageSplit.map((entry, i) => (
                      <Cell key={entry.name} fill={pieColors[i % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "var(--popover)",
                      border: "1px solid var(--border)",
                      borderRadius: 10,
                      fontSize: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="mt-4 space-y-2">
              {languageSplit.map((l, i) => (
                <li key={l.name} className="flex items-center gap-2 text-xs">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: pieColors[i % pieColors.length] }}
                  />
                  <span className="text-muted-foreground">{l.name}</span>
                  <span className="ml-auto font-medium">{l.value}%</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 lg:col-span-3">
            <h3 className="text-sm font-medium">Health score by repository</h3>
            <div className="mt-6 h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={repositories.map((r) => ({ name: r.name, health: r.health }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis
                    dataKey="name"
                    stroke="var(--muted-foreground)"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="var(--muted-foreground)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: "var(--surface-2)" }}
                    contentStyle={{
                      background: "var(--popover)",
                      border: "1px solid var(--border)",
                      borderRadius: 10,
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="health" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      <RepositoryImportModal
        open={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onSubmit={async (githubUrl) => {
          const imported = await importRepository(githubUrl);
          refreshDashboard({
            id: String(imported.id),
            name: imported.name,
            owner: imported.owner,
            description: imported.description ?? "",
            language: imported.primary_language ?? "Unknown",
            stars: imported.stars,
            forks: imported.forks,
            issues: 0,
            health: imported.health_score ?? 0,
            visibility: "Public",
            updated: "just now",
            topics: [],
            languages: [],
          });
          setNotice(`Repository imported successfully: ${imported.owner}/${imported.name}.`);
          setIsImportOpen(false);
        }}
      />
    </AppShell>
  );
}
