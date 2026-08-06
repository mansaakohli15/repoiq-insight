export type HealthScoreCheck = {
  name: string;
  passed: boolean;
  weight: number;
  detail: string;
};

export type Repo = {
  id: string;
  name: string;
  owner: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  issues: number;
  health: number;
  visibility: "Public" | "Private";
  updated: string;
  topics: string[];
  languages: { name: string; percent: number }[];
  defaultBranch?: string;
  importedAt?: string;
  healthChecks?: HealthScoreCheck[];
};
