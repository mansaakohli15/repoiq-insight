import { Activity } from "lucide-react";

import { HealthRing } from "@/components/shared/HealthRing";
import { Badge } from "@/components/ui/badge";

export function StatusCard({
  healthScore,
  analysisStatus,
  primaryLanguage,
}: {
  healthScore: number;
  analysisStatus: string;
  primaryLanguage: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center gap-2">
        <Activity className="h-4 w-4 text-primary" />
        <h2 className="font-display text-lg font-semibold">Status</h2>
      </div>

      <div className="mt-5 flex flex-col items-center gap-4">
        <HealthRing score={healthScore} size={112} label="overall" />
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Badge variant="outline">{primaryLanguage || "Unknown"}</Badge>
          <Badge variant="outline">{analysisStatus}</Badge>
        </div>
      </div>
    </div>
  );
}
