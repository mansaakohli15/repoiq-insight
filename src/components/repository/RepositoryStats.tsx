import { ArrowUpRight, CircleDot, GitFork, Star } from "lucide-react";

import type { Repo } from "@/types/repository";

export function RepositoryStats({ repo }: { repo: Repo }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-lg border border-border bg-surface/60 p-4">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Star className="h-3.5 w-3.5" /> Stars
          </div>
          <div className="mt-2 font-display text-lg font-semibold">{repo.stars?.toLocaleString?.() ?? "0"}</div>
        </div>
        <div className="rounded-lg border border-border bg-surface/60 p-4">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <GitFork className="h-3.5 w-3.5" /> Forks
          </div>
          <div className="mt-2 font-display text-lg font-semibold">{repo.forks}</div>
        </div>
        <div className="rounded-lg border border-border bg-surface/60 p-4">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <CircleDot className="h-3.5 w-3.5" /> Default branch
          </div>
          <div className="mt-2 font-display text-lg font-semibold">{repo.defaultBranch ?? "main"}</div>
        </div>
        <div className="rounded-lg border border-border bg-surface/60 p-4">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <ArrowUpRight className="h-3.5 w-3.5" /> Imported date
          </div>
          <div className="mt-2 font-display text-lg font-semibold">{repo.importedAt ?? "—"}</div>
        </div>
      </div>
    </div>
  );
}
