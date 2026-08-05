import { Link } from "react-router-dom";
import { GitFork, Star, CircleDot, Lock, Globe } from "lucide-react";

import { HealthRing } from "@/components/shared/HealthRing";
import { Badge } from "@/components/ui/badge";
import type { Repo } from "@/types/repository";

export function RepoCard({ repo }: { repo: Repo }) {
  return (
    <Link
      to={`/repository/${repo.id}`}
      className="group flex flex-col rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/40 hover:shadow-elevated"
    >
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-2">
            <h3 className="truncate font-display text-base font-semibold group-hover:text-primary">
              {repo.name}
            </h3>
            <Badge variant="outline" className="shrink-0 gap-1 text-[10px] font-normal">
              {repo.visibility === "Private" ? (
                <Lock className="h-2.5 w-2.5" />
              ) : (
                <Globe className="h-2.5 w-2.5" />
              )}
              {repo.visibility}
            </Badge>
          </div>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">{repo.owner}</p>
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {repo.description}
          </p>
        </div>
        <HealthRing score={repo.health} size={56} />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-primary" />
          {repo.language}
        </span>
        <span className="flex items-center gap-1.5">
          <Star className="h-3.5 w-3.5" />
          {repo.stars.toLocaleString()}
        </span>
        <span className="flex items-center gap-1.5">
          <GitFork className="h-3.5 w-3.5" />
          {repo.forks}
        </span>
        <span className="flex items-center gap-1.5">
          <CircleDot className="h-3.5 w-3.5" />
          {repo.issues}
        </span>
        <span className="ml-auto">{repo.updated}</span>
      </div>
    </Link>
  );
}
