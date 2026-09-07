import { ArrowUp, HelpCircle, MessageSquare, Sparkle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { AppShell } from "@/layouts/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  getChatMessages,
  listRepositories,
  sendChatMessage,
  type ChatMessageResponse,
  type RepositoryImportResponse,
} from "@/services/repositoryApi";
import { cn } from "@/utils/cn";

const SUGGESTED_PROMPTS = [
  "Give me an architectural overview of this repository.",
  "What is the complete tech stack and key dependencies?",
  "What are the main risks, bottlenecks, or trade-offs in this design?",
  "How should a new developer get started with this codebase?",
];

export function ChatPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryRepoId = searchParams.get("repoId");

  const [repositories, setRepositories] = useState<RepositoryImportResponse[]>([]);
  const [selectedRepoId, setSelectedRepoId] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessageResponse[]>([]);
  const [draft, setDraft] = useState("");
  const [isLoadingRepos, setIsLoadingRepos] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRepositories()
      .then((repos) => {
        setRepositories(repos);
        if (repos.length > 0) {
          const target = queryRepoId ? repos.find((r) => r.id === Number(queryRepoId)) : null;
          setSelectedRepoId(target ? target.id : repos[0].id);
        }
      })
      .catch(() => setError("Could not load your repositories."))
      .finally(() => setIsLoadingRepos(false));
  }, [queryRepoId]);

  useEffect(() => {
    if (selectedRepoId === null) return;

    setIsLoadingMessages(true);
    setError(null);
    getChatMessages(selectedRepoId)
      .then(setMessages)
      .catch(() => setError("Could not load chat history for this repository."))
      .finally(() => setIsLoadingMessages(false));
  }, [selectedRepoId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSelectRepo = (id: number) => {
    setSelectedRepoId(id);
    setSearchParams({ repoId: String(id) });
  };

  const selectedRepo = repositories.find((r) => r.id === selectedRepoId) ?? null;

  const send = async (text: string) => {
    const value = text.trim();
    if (!value || selectedRepoId === null || isSending) return;

    setIsSending(true);
    setError(null);
    setDraft("");

    setMessages((current) => [
      ...current,
      {
        id: -Date.now(),
        repository_id: selectedRepoId,
        role: "user",
        content: value,
        created_at: new Date().toISOString(),
      },
    ]);

    try {
      const reply = await sendChatMessage(selectedRepoId, value);
      setMessages((current) => [...current, reply]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not get a response right now. Try again in a moment.",
      );
    } finally {
      setIsSending(false);
    }
  };

  if (isLoadingRepos) {
    return (
      <AppShell title="AI Chat">
        <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
          Loading your repositories...
        </div>
      </AppShell>
    );
  }

  if (repositories.length === 0) {
    return (
      <AppShell title="AI Chat">
        <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          Import a repository from the Dashboard first, then come back here to ask questions about
          it.
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="AI Chat" flush>
      <div className="flex h-[calc(100vh-4rem)] min-w-0">
        <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-surface/40 xl:flex">
          <div className="p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Your repositories
            </p>
          </div>
          <ScrollArea className="flex-1 px-3 pb-4">
            {repositories.map((r) => (
              <button
                key={r.id}
                onClick={() => handleSelectRepo(r.id)}
                className={cn(
                  "mb-1 w-full rounded-lg px-3 py-2.5 text-left transition-colors",
                  selectedRepoId === r.id
                    ? "bg-surface-2 text-foreground font-medium"
                    : "text-muted-foreground hover:bg-surface-2/60 hover:text-foreground",
                )}
              >
                <p className="truncate text-sm">
                  {r.owner}/{r.name}
                </p>
                <p className="truncate text-[11px] text-muted-foreground">
                  {r.primary_language || "Repository"} · {r.health_score ?? 0}% health
                </p>
              </button>
            ))}
          </ScrollArea>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-3 bg-surface/20">
            <div className="flex items-center gap-2.5">
              <Sparkle className="h-4 w-4 shrink-0 text-primary" />
              <p className="text-sm font-medium">Ask about this repository</p>
            </div>

            <div className="flex items-center gap-2">
              {/* Mobile/Tablet dropdown selector */}
              <div className="xl:hidden">
                <Select
                  value={selectedRepoId ? String(selectedRepoId) : undefined}
                  onValueChange={(val) => handleSelectRepo(Number(val))}
                >
                  <SelectTrigger className="h-8 w-[200px] text-xs bg-surface">
                    <SelectValue placeholder="Select repository" />
                  </SelectTrigger>
                  <SelectContent>
                    {repositories.map((r) => (
                      <SelectItem key={r.id} value={String(r.id)} className="text-xs">
                        {r.owner}/{r.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedRepo ? (
                <Badge variant="outline" className="hidden sm:inline-flex shrink-0">
                  {selectedRepo.owner}/{selectedRepo.name}
                </Badge>
              ) : null}
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="mx-auto w-full max-w-3xl space-y-6 px-5 py-8">
              {isLoadingMessages ? (
                <p className="text-sm text-muted-foreground">Loading conversation…</p>
              ) : messages.length === 0 ? (
                <div className="space-y-6">
                  <div className="rounded-xl border border-border bg-card p-6 text-center">
                    <MessageSquare className="mx-auto h-8 w-8 text-primary/70 mb-2" />
                    <h3 className="font-display text-base font-semibold">
                      Ask anything about {selectedRepo?.owner}/{selectedRepo?.name}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Context is automatically grounded in this repository's structure, README, and
                      AI analysis.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                      <HelpCircle className="h-3.5 w-3.5" /> Suggested questions
                    </p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {SUGGESTED_PROMPTS.map((prompt) => (
                        <button
                          key={prompt}
                          onClick={() => void send(prompt)}
                          disabled={isSending}
                          className="rounded-lg border border-border bg-surface/60 p-3 text-left text-xs text-muted-foreground transition hover:border-primary/50 hover:bg-surface-2 hover:text-foreground"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                messages.map((m) =>
                  m.role === "user" ? (
                    <div key={m.id} className="flex justify-end">
                      <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-primary px-4 py-3 text-sm leading-relaxed text-primary-foreground shadow-sm">
                        {m.content}
                      </div>
                    </div>
                  ) : (
                    <div key={m.id} className="flex gap-3">
                      <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-primary/15 ring-1 ring-primary/30">
                        <Sparkle className="h-3.5 w-3.5 text-primary" />
                      </span>
                      <div className="min-w-0 flex-1 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                        {m.content}
                      </div>
                    </div>
                  ),
                )
              )}
              {isSending ? (
                <div className="flex gap-3">
                  <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-primary/15 ring-1 ring-primary/30">
                    <Sparkle className="h-3.5 w-3.5 text-primary animate-pulse" />
                  </span>
                  <p className="text-sm text-muted-foreground">Thinking with Groq AI…</p>
                </div>
              ) : null}
              <div ref={bottomRef} />
            </div>
          </ScrollArea>

          <div className="border-t border-border bg-background/80 px-5 py-4 backdrop-blur">
            <div className="mx-auto w-full max-w-3xl">
              {error ? (
                <div className="mb-2 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-1.5 text-xs text-destructive">
                  {error}
                </div>
              ) : null}
              <form
                className="relative"
                onSubmit={(e) => {
                  e.preventDefault();
                  void send(draft);
                }}
              >
                <Textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      void send(draft);
                    }
                  }}
                  rows={2}
                  placeholder={`Ask anything about ${selectedRepo?.name || "this repository"}…`}
                  className="resize-none rounded-xl border-border bg-surface pr-14 pb-4 focus-visible:ring-primary"
                  disabled={isSending}
                />
                <Button
                  type="submit"
                  size="icon"
                  className="absolute bottom-3 right-3 h-8 w-8 rounded-lg"
                  aria-label="Send message"
                  disabled={isSending || !draft.trim()}
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
