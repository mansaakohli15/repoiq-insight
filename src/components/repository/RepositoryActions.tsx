import { Button } from "@/components/ui/button";

export function RepositoryActions({
  onGenerateHealthScore,
  isGenerating,
  onAnalyze,
  isAnalyzing,
  onGenerateReadme,
  isGeneratingReadme,
}: {
  onGenerateHealthScore: () => void;
  isGenerating: boolean;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  onGenerateReadme: () => void;
  isGeneratingReadme: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Button variant="outline" onClick={onGenerateHealthScore} disabled={isGenerating}>
          {isGenerating ? "Generating..." : "Generate Health Score"}
        </Button>
        <Button variant="outline" onClick={onAnalyze} disabled={isAnalyzing}>
          {isAnalyzing ? "Analyzing..." : "Analyze Repository"}
        </Button>
        <Button variant="outline" onClick={onGenerateReadme} disabled={isGeneratingReadme}>
          {isGeneratingReadme ? "Generating..." : "Generate README"}
        </Button>
        {["Interview Questions", "Chat with Repository"].map((label) => (
          <Button
            key={label}
            variant="outline"
            disabled
            className="cursor-not-allowed opacity-70"
          >
            {label} · Coming soon
          </Button>
        ))}
      </div>
    </div>
  );
}