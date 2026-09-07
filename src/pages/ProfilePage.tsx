import { Github, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { AppShell } from "@/layouts/AppShell";
import { HealthRing } from "@/components/shared/HealthRing";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { listRepositories, type RepositoryImportResponse } from "@/services/repositoryApi";

export function ProfilePage() {
  const { user } = useAuth();
  const [repos, setRepos] = useState<RepositoryImportResponse[]>([]);
  const [isLoadingRepos, setIsLoadingRepos] = useState(true);

  useEffect(() => {
    listRepositories()
      .then(setRepos)
      .catch(() => setRepos([]))
      .finally(() => setIsLoadingRepos(false));
  }, []);

  const initials = user?.username ? user.username.slice(0, 2).toUpperCase() : "U";
  const memberSinceYear = user?.created_at
    ? new Date(user.created_at).getFullYear()
    : new Date().getFullYear();

  const scoredRepos = repos.filter((r) => typeof r.health_score === "number" && r.health_score > 0);
  const avgHealth =
    scoredRepos.length > 0
      ? Math.round(
          scoredRepos.reduce((acc, r) => acc + (r.health_score || 0), 0) / scoredRepos.length,
        )
      : 0;

  // Derive unique languages
  const detectedSkills = Array.from(
    new Set(repos.map((r) => r.primary_language).filter(Boolean)),
  ) as string[];

  const defaultSkills = [
    "Full-Stack Engineering",
    "API Design",
    "Code Quality & CI/CD",
    "Repository Health",
    "FastAPI & React",
    "Groq AI Integration",
  ];

  const allSkills = Array.from(new Set([...detectedSkills, ...defaultSkills]));

  return (
    <AppShell title="Profile" subtitle="How you appear across the workspace">
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-6">
          <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center">
            <Avatar className="h-20 w-20 shrink-0">
              <AvatarFallback className="bg-primary/15 font-display text-xl text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <h2 className="truncate font-display text-xl font-semibold">
                {user?.username || "Developer"}
              </h2>
              <p className="text-sm text-muted-foreground">Software Engineer · RepoIQ Developer</p>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
                Building, evaluating, and accelerating codebase comprehension with deterministic
                health scoring and Groq-powered AI insights.
              </p>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" /> {user?.email || "developer@example.com"}
                </span>
                <span className="flex items-center gap-1.5">
                  <Github className="h-3.5 w-3.5" /> @{user?.username || "github-user"}
                </span>
              </div>
            </div>
          </div>
          <Badge variant="outline" className="border-primary/40 text-primary">
            Free Plan
          </Badge>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-4">
          {[
            ["Repositories", String(repos.length)],
            ["Health Scored", String(scoredRepos.length)],
            ["Avg. score", avgHealth > 0 ? `${avgHealth}%` : "—"],
            ["Member since", String(memberSinceYear)],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg border border-border bg-surface/60 p-4">
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="mt-1 font-display text-lg font-semibold">{value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-border bg-card p-6">
        <Tabs defaultValue="repos">
          <TabsList>
            <TabsTrigger value="repos">Repositories ({repos.length})</TabsTrigger>
            <TabsTrigger value="activity">Recent Imports</TabsTrigger>
            <TabsTrigger value="skills">Detected Tech & Skills</TabsTrigger>
          </TabsList>

          <TabsContent value="repos" className="mt-5 space-y-2">
            {isLoadingRepos ? (
              <p className="text-sm text-muted-foreground">Loading repositories…</p>
            ) : repos.length === 0 ? (
              <p className="py-4 text-sm text-muted-foreground">
                No repositories imported yet. Import one from the Dashboard!
              </p>
            ) : (
              repos.map((r) => (
                <Link
                  key={r.id}
                  to={`/repository/${r.id}`}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-lg border border-border bg-surface/60 p-4 transition-colors hover:bg-surface-2/60"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {r.owner}/{r.name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {r.description || `${r.primary_language || "General"} repository`}
                    </p>
                  </div>
                  <HealthRing score={r.health_score ?? 0} size={44} />
                </Link>
              ))
            )}
          </TabsContent>

          <TabsContent value="activity" className="mt-5 space-y-2">
            {repos.length === 0 ? (
              <p className="py-4 text-sm text-muted-foreground">No recent activity.</p>
            ) : (
              repos.slice(0, 5).map((r) => (
                <Link
                  key={r.id}
                  to={`/repository/${r.id}`}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-lg border border-border bg-surface/60 p-4 transition-colors hover:bg-surface-2/60"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm">
                      Imported{" "}
                      <span className="font-medium">
                        {r.owner}/{r.name}
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(r.imported_at).toLocaleDateString()} ·{" "}
                      {r.primary_language || "Codebase"}
                    </p>
                  </div>
                  <Badge variant="outline" className="border-success/40 text-success">
                    {r.health_score ? `${r.health_score}%` : "Imported"}
                  </Badge>
                </Link>
              ))
            )}
          </TabsContent>

          <TabsContent value="skills" className="mt-5">
            <div className="flex flex-wrap gap-2">
              {allSkills.map((s) => (
                <Badge key={s} variant="secondary" className="font-normal">
                  {s}
                </Badge>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
