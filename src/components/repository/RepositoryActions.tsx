import { Button } from "@/components/ui/button";

export function RepositoryActions({
  onGenerateHealthScore,
  isGenerating,
}: {
  onGenerateHealthScore: () => void;
  isGenerating: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Button variant="outline" onClick={onGenerateHealthScore} disabled={isGenerating}>
          {isGenerating ? "Generating..." : "Generate Health Score"}
        </Button>
        {[
          "Analyze Repository",
          "Generate README",
          "Interview Questions",
          "Chat with Repository",
        ].map((label) => (
          <Button
            key={label}
            variant="outline"
            disabled
            className="cursor-not-allowed opacity-70"
          >
            {label} · Coming in the next milestone
          </Button>
        ))}
      </div>
    </div>
  );
}
