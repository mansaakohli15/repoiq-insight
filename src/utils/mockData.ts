import type { Repo } from "@/types/repository";

export const repositories: Repo[] = [
  {
    id: "atlas-api",
    name: "atlas-api",
    owner: "northwind-labs",
    description:
      "High-throughput GraphQL gateway with schema stitching, caching and rate limiting.",
    language: "TypeScript",
    stars: 4820,
    forks: 312,
    issues: 24,
    health: 92,
    visibility: "Public",
    updated: "2 hours ago",
    topics: ["graphql", "gateway", "node"],
    languages: [
      { name: "TypeScript", percent: 74 },
      { name: "JavaScript", percent: 14 },
      { name: "Dockerfile", percent: 7 },
      { name: "Shell", percent: 5 },
    ],
  },
  {
    id: "orbit-ui",
    name: "orbit-ui",
    owner: "northwind-labs",
    description: "Accessible React component library with 120+ primitives and design tokens.",
    language: "TypeScript",
    stars: 12940,
    forks: 1104,
    issues: 68,
    health: 84,
    visibility: "Public",
    updated: "yesterday",
    topics: ["react", "design-system", "a11y"],
    languages: [
      { name: "TypeScript", percent: 68 },
      { name: "CSS", percent: 22 },
      { name: "MDX", percent: 10 },
    ],
  },
  {
    id: "quanta-ml",
    name: "quanta-ml",
    owner: "quanta-research",
    description: "Distributed training toolkit for transformer models on commodity GPUs.",
    language: "Python",
    stars: 8730,
    forks: 902,
    issues: 141,
    health: 61,
    visibility: "Public",
    updated: "3 days ago",
    topics: ["ml", "pytorch", "distributed"],
    languages: [
      { name: "Python", percent: 88 },
      { name: "Cuda", percent: 8 },
      { name: "Shell", percent: 4 },
    ],
  },
  {
    id: "ledgerly",
    name: "ledgerly",
    owner: "acme-fin",
    description: "Double-entry accounting engine with immutable audit trails.",
    language: "Go",
    stars: 2140,
    forks: 188,
    issues: 12,
    health: 77,
    visibility: "Private",
    updated: "5 days ago",
    topics: ["fintech", "go", "postgres"],
    languages: [
      { name: "Go", percent: 81 },
      { name: "SQL", percent: 13 },
      { name: "Makefile", percent: 6 },
    ],
  },
  {
    id: "pulse-mobile",
    name: "pulse-mobile",
    owner: "acme-fin",
    description: "Cross-platform mobile client with offline-first sync layer.",
    language: "Kotlin",
    stars: 968,
    forks: 74,
    issues: 39,
    health: 48,
    visibility: "Private",
    updated: "1 week ago",
    topics: ["mobile", "kotlin", "offline"],
    languages: [
      { name: "Kotlin", percent: 62 },
      { name: "Swift", percent: 28 },
      { name: "Ruby", percent: 10 },
    ],
  },
  {
    id: "sentinel-infra",
    name: "sentinel-infra",
    owner: "northwind-labs",
    description: "Terraform modules and policy-as-code guardrails for multi-cloud estates.",
    language: "HCL",
    stars: 3311,
    forks: 421,
    issues: 8,
    health: 88,
    visibility: "Public",
    updated: "2 weeks ago",
    topics: ["terraform", "devops", "security"],
    languages: [
      { name: "HCL", percent: 79 },
      { name: "Python", percent: 15 },
      { name: "Shell", percent: 6 },
    ],
  },
];

export const recentAnalyses = [
  { repo: "atlas-api", status: "Completed", score: 92, time: "12 min ago", duration: "48s" },
  { repo: "orbit-ui", status: "Completed", score: 84, time: "1 hour ago", duration: "1m 12s" },
  { repo: "quanta-ml", status: "Needs review", score: 61, time: "3 hours ago", duration: "2m 04s" },
  { repo: "ledgerly", status: "Completed", score: 77, time: "yesterday", duration: "55s" },
  { repo: "pulse-mobile", status: "Failed", score: 0, time: "2 days ago", duration: "—" },
];

export const analyticsSeries = [
  { month: "Feb", analyses: 18, score: 63 },
  { month: "Mar", analyses: 26, score: 66 },
  { month: "Apr", analyses: 31, score: 71 },
  { month: "May", analyses: 44, score: 74 },
  { month: "Jun", analyses: 39, score: 79 },
  { month: "Jul", analyses: 57, score: 83 },
  { month: "Aug", analyses: 63, score: 86 },
];

export const languageSplit = [
  { name: "TypeScript", value: 42 },
  { name: "Python", value: 24 },
  { name: "Go", value: 16 },
  { name: "Kotlin", value: 10 },
  { name: "Other", value: 8 },
];

export const healthBreakdown = [
  { label: "Code quality", value: 88 },
  { label: "Test coverage", value: 74 },
  { label: "Documentation", value: 63 },
  { label: "Security", value: 91 },
  { label: "Maintenance", value: 80 },
];

export const interviewQuestions = [
  {
    q: "How does the schema stitching layer resolve conflicting types across subgraphs?",
    tag: "Architecture",
    difficulty: "Hard",
  },
  {
    q: "Walk through the request lifecycle from gateway ingress to downstream resolver.",
    tag: "System design",
    difficulty: "Medium",
  },
  {
    q: "Why was an LRU cache chosen over a TTL-only strategy for persisted queries?",
    tag: "Performance",
    difficulty: "Medium",
  },
  {
    q: "How would you introduce per-tenant rate limiting without adding p99 latency?",
    tag: "Scalability",
    difficulty: "Hard",
  },
  {
    q: "Describe the error-handling contract between the gateway and its clients.",
    tag: "API design",
    difficulty: "Easy",
  },
];

export const suggestions = [
  {
    title: "Raise test coverage on the resolver layer",
    impact: "High",
    detail:
      "Resolvers under src/graph/resolvers currently sit at 41% coverage. Adding contract tests would de-risk the most frequently changed module.",
  },
  {
    title: "Document the caching strategy",
    impact: "Medium",
    detail:
      "Three cache tiers exist but none are described in the README. A short architecture note would cut onboarding time significantly.",
  },
  {
    title: "Pin transitive dependencies",
    impact: "Medium",
    detail:
      "14 transitive dependencies float on caret ranges. Locking them prevents surprise regressions in CI.",
  },
  {
    title: "Split the 1.2k-line gateway module",
    impact: "Low",
    detail:
      "src/gateway/index.ts mixes routing, auth and telemetry. Extracting telemetry would improve readability.",
  },
];

export const readmePreview = `# atlas-api

High-throughput GraphQL gateway for the Northwind platform.

## Features
- Schema stitching across 12 subgraphs
- Persisted queries with layered caching
- Per-tenant rate limiting and quota accounting
- OpenTelemetry traces out of the box

## Quick start
\`\`\`bash
pnpm install
pnpm dev
\`\`\`

## Configuration
Configuration is read from \`atlas.config.ts\`. See the configuration guide
for the full option reference, including cache tiers and subgraph timeouts.
`;

export const chatThreads = [
  { id: "1", title: "Explain the caching layers", time: "Today" },
  { id: "2", title: "Onboarding plan for atlas-api", time: "Today" },
  { id: "3", title: "Security review: sentinel-infra", time: "Yesterday" },
  { id: "4", title: "Why is coverage dropping?", time: "Yesterday" },
  { id: "5", title: "Interview prep — orbit-ui", time: "Last week" },
];

export const chatSeed = [
  {
    role: "user" as const,
    content: "Give me a quick overview of atlas-api and where the risk is.",
  },
  {
    role: "assistant" as const,
    content:
      "atlas-api is a TypeScript GraphQL gateway (~48k LOC) stitching 12 subgraphs. Overall health is 92/100.\n\nThe main risk is concentrated in the resolver layer: it holds 38% of recent commits but only 41% test coverage. Secondary risk is documentation drift — the caching strategy has three tiers and none are documented.\n\nWant me to draft the missing architecture note?",
  },
];
