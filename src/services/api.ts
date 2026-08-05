import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.response.use(
  (response) => response,
  (error: unknown) =>
    Promise.reject(error instanceof Error ? error : new Error("API request failed")),
);
