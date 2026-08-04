import { createFileRoute } from "@tanstack/react-router";
import { Github, Globe, Mail, MapPin, Twitter } from "lucide-react";

import { AppShell } from "@/components/layout/AppShell";
import { HealthRing } from "@/components/shared/HealthRing";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { recentAnalyses, repositories } from "@/lib/data";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — RepoIQ" },
      { name: "description", content: "Your RepoIQ profile, activity and analyzed repositories." },
      { property: "og:title", content: "Profile — RepoIQ" },
      { property: "og:description", content: "Your RepoIQ profile and analysis activity." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  return (
    <AppShell title="Profile" subtitle="How you appear across the workspace">
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-6">
          <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center">
            <Avatar className="h-20 w-20 shrink-0">
              <AvatarFallback className="bg-primary/15 font-display text-xl text-primary">
                AK
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <h2 className="truncate font-display text-xl font-semibold">Ava Kirchner</h2>
              <p className="text-sm text-muted-foreground">Staff Engineer · Northwind Labs</p>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
                Platform engineer focused on API gateways, developer tooling and making large
                codebases legible to the people who inherit them.
              </p>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" /> ava@northwind.dev
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" /> Berlin, DE
                </span>
                <span className="flex items-center gap-1.5">
                  <Github className="h-3.5 w-3.5" /> @avakirchner
                </span>
                <span className="flex items-center gap-1.5">
                  <Twitter className="h-3.5 w-3.5" /> @avakir
                </span>
                <span className="flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5" /> ava.dev
                </span>
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm">
            Edit profile
          </Button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-4">
          {[
            ["Repositories", "24"],
            ["Analyses run", "312"],
            ["Avg. score", "86"],
            ["Member since", "2024"],
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
            <TabsTrigger value="repos">Repositories</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
          </TabsList>

          <TabsContent value="repos" className="mt-5 space-y-2">
            {repositories.slice(0, 4).map((r) => (
              <div
                key={r.id}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-lg border border-border bg-surface/60 p-4"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {r.owner}/{r.name}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">{r.description}</p>
                </div>
                <HealthRing score={r.health} size={44} />
              </div>
            ))}
          </TabsContent>

          <TabsContent value="activity" className="mt-5 space-y-2">
            {recentAnalyses.map((a) => (
              <div
                key={a.repo}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-lg border border-border bg-surface/60 p-4"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm">
                    Ran an analysis on <span className="font-medium">{a.repo}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">{a.time}</p>
                </div>
                <Badge variant="outline">{a.status}</Badge>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="skills" className="mt-5">
            <div className="flex flex-wrap gap-2">
              {[
                "TypeScript",
                "Go",
                "GraphQL",
                "Distributed systems",
                "Terraform",
                "PostgreSQL",
                "Observability",
                "API design",
                "Kubernetes",
              ].map((s) => (
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
