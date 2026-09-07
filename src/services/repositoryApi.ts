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

export type InterviewQuestion = {
  question: string;
  difficulty: string;
  tag: string;
};

export type AnalysisResponse = {
  id: number;
  repository_id: number;
  summary: string | null;
  architecture: string | null;
  tech_stack: string | null;
  use_cases: string | null;
  limitations: string | null;
  readme_markdown: string | null;
  interview_questions: InterviewQuestion[] | null;
  created_at: string;
};

export type ChatMessageResponse = {
  id: number;
  repository_id: number;
  role: "user" | "assistant";
  content: string;
  created_at: string;
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

export async function getRepositoryDetails(
  repositoryId: number,
): Promise<RepositoryImportResponse> {
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

export async function generateAnalysis(repositoryId: number): Promise<AnalysisResponse> {
  const response = await api.post<AnalysisResponse>(`/repositories/${repositoryId}/analyze`, {});
  return response.data;
}

export async function getAnalysis(repositoryId: number): Promise<AnalysisResponse | null> {
  const response = await api.get<AnalysisResponse | null>(`/repositories/${repositoryId}/analysis`);
  return response.data;
}

export async function generateReadme(repositoryId: number): Promise<AnalysisResponse> {
  const response = await api.post<AnalysisResponse>(`/repositories/${repositoryId}/readme`, {});
  return response.data;
}

export async function generateInterviewQuestions(repositoryId: number): Promise<AnalysisResponse> {
  const response = await api.post<AnalysisResponse>(
    `/repositories/${repositoryId}/interview-questions`,
    {},
  );
  return response.data;
}

export async function getChatMessages(repositoryId: number): Promise<ChatMessageResponse[]> {
  const response = await api.get<ChatMessageResponse[]>(`/repositories/${repositoryId}/chat`);
  return response.data;
}

export async function sendChatMessage(
  repositoryId: number,
  content: string,
): Promise<ChatMessageResponse> {
  const response = await api.post<ChatMessageResponse>(`/repositories/${repositoryId}/chat`, {
    content,
  });
  return response.data;
}
