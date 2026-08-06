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

export async function listRepositories(): Promise<RepositoryImportResponse[]> {
  const response = await api.get<RepositoryImportResponse[]>("/repositories");
  return response.data;
}

export async function importRepository(githubUrl: string): Promise<RepositoryImportResponse> {
  const response = await api.post<RepositoryImportResponse>("/repositories/import", {
    github_url: githubUrl,
  });
  return response.data;
}

export async function getRepositoryDetails(repositoryId: number): Promise<RepositoryImportResponse> {
  const response = await api.get<RepositoryImportResponse>(`/repositories/${repositoryId}`);
  return response.data;
}

export async function generateHealthScore(repositoryId: number): Promise<HealthScoreResponse> {
  const response = await api.post<HealthScoreResponse>(
    `/repositories/${repositoryId}/health-score`,
    {},
  );
  return response.data;
}