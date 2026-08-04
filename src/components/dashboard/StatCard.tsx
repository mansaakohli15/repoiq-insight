import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export function StatCard({
  icon: Icon,
  label,
  value,
  delta,
  positive = true,
  className,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  delta?: string;
  positive?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("rounded-xl border border-border bg-card p-5", className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
        <Icon className="h-4 w-4 shrink-0 text-primary" />
      </div>
      <div className="mt-3 flex items-end gap-2">
        <span className="font-display text-2xl font-semibold">{value}</span>
        {delta && (
          <span
            className={cn(
              "pb-1 text-xs font-medium",
              positive ? "text-success" : "text-destructive",
            )}
          >
            {delta}
          </span>
        )}
      </div>
    </div>
  );
}
