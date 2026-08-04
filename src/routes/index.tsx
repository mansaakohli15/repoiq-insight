import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Brain,
  FileCode2,
  GaugeCircle,
  MessagesSquare,
  ShieldCheck,
  Sparkle,
  Check,
} from "lucide-react";

import heroImage from "@/assets/hero-dashboard.jpg";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RepoIQ — AI-Powered GitHub Repository Analysis" },
      {
        name: "description",
        content:
          "Understand any codebase in minutes. RepoIQ scores repository health, writes AI summaries, and turns code into onboarding and interview material.",
      },
      { property: "og:title", content: "RepoIQ — AI-Powered GitHub Repository Analysis" },
      {
        property: "og:description",
        content:
          "Understand any codebase in minutes with AI summaries, health scores, and improvement plans.",
      },
    ],
  }),
  component: Landing,
});

const features = [
  {
    icon: Brain,
    title: "AI repository summaries",
    body: "A plain-English brief of what the codebase does, how it is structured, and where the complexity lives.",
  },
  {
    icon: GaugeCircle,
    title: "Health scoring",
    body: "One score across code quality, tests, docs, security and maintenance — with the exact files dragging it down.",
  },
  {
    icon: FileCode2,
    title: "Language breakdown",
    body: "See composition, hotspots and churn per language so you know what skills a repo really demands.",
  },
  {
    icon: MessagesSquare,
    title: "Chat with the codebase",
    body: "Ask why a module exists, how a request flows, or what breaks if you delete something.",
  },
  {
    icon: ShieldCheck,
    title: "Improvement plans",
    body: "Ranked, actionable suggestions with impact estimates instead of a wall of lint warnings.",
  },
  {
    icon: Sparkle,
    title: "Interview generator",
    body: "Repo-specific technical questions for hiring loops and onboarding checkpoints.",
  },
];

const steps = [
  { n: "01", t: "Connect a repository", d: "Point RepoIQ at any public or private repo." },
  { n: "02", t: "Run the analysis", d: "Structure, history and dependencies are parsed in under a minute." },
  { n: "03", t: "Act on the report", d: "Share summaries, fix the top issues, brief your team." },
];

const plans = [
  {
    name: "Starter",
    price: "$0",
    note: "for individuals",
    features: ["3 public repositories", "Health scores", "AI summaries", "Community support"],
  },
  {
    name: "Team",
    price: "$29",
    note: "per user / month",
    highlighted: true,
    features: [
      "Unlimited repositories",
      "Private repo analysis",
      "Codebase chat",
      "Interview generator",
      "Shared workspaces",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    note: "for platform teams",
    features: ["SSO & SCIM", "Self-hosted runners", "Audit logs", "Dedicated support"],
  },
];

function Landing() {
  return (
    <div className="min-h-screen">
      <MarketingNav />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute inset-0 hero-glow" />
        <div className="relative mx-auto max-w-6xl px-5 pb-20 pt-20 text-center sm:pt-28">
          <Badge variant="outline" className="gap-1.5 border-primary/30 bg-primary/10 text-primary">
            <Sparkle className="h-3 w-3" /> Now analyzing monorepos up to 2M LOC
          </Badge>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold leading-[1.08] sm:text-6xl">
            Understand any repository <span className="text-gradient">before</span> you write a line
            of code
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
            RepoIQ reads the codebase for you — architecture, health, risk and gaps — then turns it
            into summaries, onboarding notes and an improvement plan your team can act on.
          </p>
          <div className="mt-8 flex justify-center">
            <Button asChild size="lg" className="gap-2">
              <Link to="/register">
                Analyze a repository <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="relative mx-auto mt-16 max-w-5xl">
            <div className="overflow-hidden rounded-2xl border border-border shadow-elevated">
              <img
                src={heroImage}
                alt="RepoIQ analysis dashboard showing repository health charts"
                width={1600}
                height={1008}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-5 py-24">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-primary">Capabilities</p>
          <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
            Everything you need to judge a codebase
          </h2>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/40"
            >
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary/12 ring-1 ring-primary/25">
                <f.icon className="h-5 w-5 text-primary" />
              </span>
              <h3 className="mt-5 font-display text-base font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="workflow" className="border-y border-border bg-surface/40">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-24 lg:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n}>
              <span className="font-mono text-sm text-primary">{s.n}</span>
              <h3 className="mt-3 font-display text-xl font-semibold">{s.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-6xl px-5 py-24">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-primary">Pricing</p>
          <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Simple, per-seat pricing</h2>
        </div>
        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.name}
              className={
                p.highlighted
                  ? "rounded-xl border border-primary/40 bg-card p-7 shadow-glow"
                  : "rounded-xl border border-border bg-card p-7"
              }
            >
              <h3 className="font-display text-lg font-semibold">{p.name}</h3>
              <div className="mt-4 flex items-end gap-2">
                <span className="font-display text-3xl font-semibold">{p.price}</span>
                <span className="pb-1 text-xs text-muted-foreground">{p.note}</span>
              </div>
              <ul className="mt-6 space-y-2.5">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                asChild
                variant={p.highlighted ? "default" : "outline"}
                className="mt-7 w-full"
              >
                <Link to="/register">Choose {p.name}</Link>
              </Button>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-24">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card px-6 py-16 text-center">
          <div className="absolute inset-0 hero-glow opacity-80" />
          <div className="relative">
            <h2 className="mx-auto max-w-xl text-3xl font-semibold sm:text-4xl">
              Stop guessing what a codebase is hiding
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm text-muted-foreground">
              Run your first analysis in under a minute. No credit card required.
            </p>
            <Button asChild size="lg" className="mt-8 gap-2">
              <Link to="/register">
                Get started free <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
