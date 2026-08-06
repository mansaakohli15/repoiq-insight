import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function RepositoryImportModal({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (githubUrl: string) => Promise<void>;
}) {
  const [githubUrl, setGithubUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 px-4">
      <div className="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-elevated">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-lg font-semibold">Import repository</h2>
            <p className="text-sm text-muted-foreground">Paste a GitHub repository URL.</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>

        <div className="space-y-3">
          <Input
            value={githubUrl}
            onChange={(event) => {
              setGithubUrl(event.target.value);
              setError(null);
            }}
            placeholder="https://github.com/vercel/next.js"
            disabled={isSubmitting}
          />
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={async () => {
              if (!githubUrl.trim()) {
                setError("Please paste a GitHub URL.");
                return;
              }

              try {
                setIsSubmitting(true);
                setError(null);
                await onSubmit(githubUrl.trim());
                setGithubUrl("");
                onClose();
              } catch (requestError) {
                setError(
                  requestError instanceof Error
                    ? requestError.message
                    : "Import failed. Please try again.",
                );
              } finally {
                setIsSubmitting(false);
              }
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Importing..." : "Import repository"}
          </Button>
        </div>
      </div>
    </div>
  );
}
