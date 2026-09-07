import { api } from "@/services/api";

export type RegisterRequest = {
  username: string;
  email: string;
  password: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type TokenResponse = {
  access_token: string;
  token_type: string;
};

export type UserResponse = {
  id: number;
  username: string;
  email: string;
  created_at: string;
};

export async function registerUser(data: RegisterRequest): Promise<UserResponse> {
  const response = await api.post<UserResponse>("/auth/register", data);
  return response.data;
}

export async function loginUser(data: LoginRequest): Promise<TokenResponse> {
  const response = await api.post<TokenResponse>("/auth/login", data);
  return response.data;
}

export async function fetchProfile(): Promise<UserResponse> {
  const response = await api.get<UserResponse>("/auth/profile");
  return response.data;
}
