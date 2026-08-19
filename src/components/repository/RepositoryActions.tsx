import { Button } from "@/components/ui/button";

export function RepositoryActions({
  onGenerateHealthScore,
  isGenerating,
  onAnalyze,
  isAnalyzing,
  onGenerateReadme,
  isGeneratingReadme,
  onGenerateInterviewQuestions,
  isGeneratingInterviewQuestions,
}: {
  onGenerateHealthScore: () => void;
  isGenerating: boolean;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  onGenerateReadme: () => void;
  isGeneratingReadme: boolean;
  onGenerateInterviewQuestions: () => void;
  isGeneratingInterviewQuestions: boolean;
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
        <Button
          variant="outline"
          onClick={onGenerateInterviewQuestions}
          disabled={isGeneratingInterviewQuestions}
        >
          {isGeneratingInterviewQuestions ? "Generating..." : "Interview Questions"}
        </Button>
      </div>
    </div>
  );
}