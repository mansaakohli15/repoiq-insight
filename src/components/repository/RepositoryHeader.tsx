import type { Repo } from "@/types/repository";

export function RepositoryHeader({ repo }: { repo: Repo }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{repo.owner}</p>
          <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight">{repo.name}</h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            {repo.description}
          </p>
        </div>
      </div>
    </div>
  );
}
