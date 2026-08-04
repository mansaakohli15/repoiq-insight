import { createFileRoute } from "@tanstack/react-router";
import { ArrowUp, Copy, Plus, RefreshCw, Sparkle, ThumbsUp } from "lucide-react";
import { useState } from "react";

import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { chatSeed, chatThreads } from "@/lib/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chat — RepoIQ" },
      {
        name: "description",
        content: "Chat with RepoIQ about architecture, risk and onboarding for your repositories.",
      },
      { property: "og:title", content: "AI Chat — RepoIQ" },
      { property: "og:description", content: "Ask questions about any analyzed repository." },
    ],
  }),
  component: ChatPage,
});

const prompts = [
  "Summarize the architecture of atlas-api",
  "What should a new hire read first?",
  "Where is the biggest test coverage gap?",
  "Draft interview questions for this repo",
];

function ChatPage() {
  const [messages, setMessages] = useState(chatSeed);
  const [draft, setDraft] = useState("");
  const [activeThread, setActiveThread] = useState("1");

  const send = (text: string) => {
    const value = text.trim();
    if (!value) return;
    setMessages((m) => [
      ...m,
      { role: "user" as const, content: value },
      {
        role: "assistant" as const,
        content:
          "This is a placeholder response. In the full product, RepoIQ would answer using the indexed contents of the selected repository, citing the specific files and commits behind the answer.",
      },
    ]);
    setDraft("");
  };

  return (
    <AppShell title="AI Chat" flush>
      <div className="flex h-[calc(100vh-4rem)] min-w-0">
        <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-surface/40 xl:flex">
          <div className="p-4">
            <Button className="w-full gap-2">
              <Plus className="h-4 w-4" /> New chat
            </Button>
          </div>
          <ScrollArea className="flex-1 px-3 pb-4">
            {chatThreads.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveThread(t.id)}
                className={cn(
                  "mb-1 w-full rounded-lg px-3 py-2.5 text-left transition-colors",
                  activeThread === t.id
                    ? "bg-surface-2 text-foreground"
                    : "text-muted-foreground hover:bg-surface-2/60",
                )}
              >
                <p className="truncate text-sm">{t.title}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">{t.time}</p>
              </button>
            ))}
          </ScrollArea>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center gap-3 border-b border-border px-5 py-3">
            <Sparkle className="h-4 w-4 shrink-0 text-primary" />
            <p className="truncate text-sm font-medium">Explain the caching layers</p>
            <Badge variant="outline" className="ml-auto shrink-0">
              atlas-api
            </Badge>
          </div>

          <ScrollArea className="flex-1">
            <div className="mx-auto w-full max-w-3xl space-y-8 px-5 py-8">
              {messages.map((m, i) =>
                m.role === "user" ? (
                  <div key={i} className="flex justify-end">
                    <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-primary px-4 py-3 text-sm leading-relaxed text-primary-foreground">
                      {m.content}
                    </div>
                  </div>
                ) : (
                  <div key={i} className="flex gap-3">
                    <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-primary/15 ring-1 ring-primary/30">
                      <Sparkle className="h-3.5 w-3.5 text-primary" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                        {m.content}
                      </div>
                      <div className="mt-3 flex gap-1">
                        <Button variant="ghost" size="sm" className="h-7 gap-1.5 px-2 text-xs">
                          <Copy className="h-3 w-3" /> Copy
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 gap-1.5 px-2 text-xs">
                          <RefreshCw className="h-3 w-3" /> Retry
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 gap-1.5 px-2 text-xs">
                          <ThumbsUp className="h-3 w-3" /> Helpful
                        </Button>
                      </div>
                    </div>
                  </div>
                ),
              )}
            </div>
          </ScrollArea>

          <div className="border-t border-border bg-background/80 px-5 py-4 backdrop-blur">
            <div className="mx-auto w-full max-w-3xl">
              <div className="mb-3 flex flex-wrap gap-2">
                {prompts.map((p) => (
                  <button
                    key={p}
                    onClick={() => send(p)}
                    className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                  >
                    {p}
                  </button>
                ))}
              </div>
              <form
                className="relative"
                onSubmit={(e) => {
                  e.preventDefault();
                  send(draft);
                }}
              >
                <Textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send(draft);
                    }
                  }}
                  rows={2}
                  placeholder="Ask anything about this repository…"
                  className="resize-none rounded-xl border-border bg-surface pr-14 pb-4"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="absolute bottom-3 right-3 h-8 w-8 rounded-lg"
                  aria-label="Send message"
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
              </form>
              <p className="mt-2 text-center text-[11px] text-muted-foreground">
                Responses are placeholder content in this UI prototype.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
