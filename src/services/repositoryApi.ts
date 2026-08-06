import { api } from "@/services/api";

export type RepositoryImportRequest = {
  github_url: string;
};

export type RepositoryImportResponse = {
  id: number;
  user_id: number;
  owner: string;
  name: string;
  github_url: string;
  description: string | null;
  primary_language: string | null;
  stars: number;
  forks: number;
  default_branch: string;
  health_score: number | null;
  imported_at: string;
};

export type HealthScoreCheck = {
  name: string;
  passed: boolean;
  weight: number;
  detail: string;
};

export type HealthScoreResponse = {
  id: number;
  score: number;
  breakdown: HealthScoreCheck[];
};

export async function importRepository(githubUrl: string): Promise<RepositoryImportResponse> {
  const token = localStorage.getItem("access_token");

  const response = await api.post<RepositoryImportResponse>(
    "/repositories/import",
    {
      github_url: githubUrl,
    },
    {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    },
  );

  return response.data;
}

export async function getRepositoryDetails(repositoryId: number): Promise<RepositoryImportResponse> {
  const token = localStorage.getItem("access_token");

  const response = await api.get<RepositoryImportResponse>(`/repositories/${repositoryId}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  return response.data;
}

export async function generateHealthScore(repositoryId: number): Promise<HealthScoreResponse> {
  const token = localStorage.getItem("access_token");

  const response = await api.post<HealthScoreResponse>(
    `/repositories/${repositoryId}/health-score`,
    {},
    {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    },
  );

  return response.data;
}
