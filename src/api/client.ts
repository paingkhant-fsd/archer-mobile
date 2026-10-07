import type { ApiErrorBody, AuthResponse, Currency, Project, User } from "./types";

export const API_URL = (process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:4000/api/v1").replace(/\/$/, "");

export class ApiError extends Error {
  constructor(public status: number, public code: string, message: string) { super(message); this.name = "ApiError"; }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, { ...init, headers: { Accept: "application/json", ...(init?.body ? { "Content-Type": "application/json" } : {}), ...init?.headers } });
  } catch {
    throw new ApiError(0, "NETWORK_ERROR", "Could not reach the Archer API.");
  }
  if (!response.ok) {
    let body: ApiErrorBody = {};
    try { body = (await response.json()) as ApiErrorBody; } catch { /* response was not JSON */ }
    throw new ApiError(response.status, body.error?.code ?? "REQUEST_FAILED", body.error?.message ?? "The request failed.");
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export const api = {
  login: (email: string, password: string) => request<AuthResponse>("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  refresh: (refreshToken: string) => request<{ accessToken: string; refreshToken: string }>("/auth/refresh", { method: "POST", body: JSON.stringify({ refreshToken }) }),
  logout: (refreshToken: string) => request<void>("/auth/logout", { method: "POST", body: JSON.stringify({ refreshToken }) }),
  me: (accessToken: string) => request<{ user: User }>("/me", { headers: { Authorization: `Bearer ${accessToken}` } }),
  project: (id: string) => request<{ project: Project }>(`/projects/${encodeURIComponent(id)}`),
  projects: (input: { search?: string; categoryId?: string; currency?: Currency; page?: number; pageSize?: number }) => {
    const query = new URLSearchParams();
    if (input.search) query.set("search", input.search);
    if (input.categoryId) query.set("categoryId", input.categoryId);
    if (input.currency) query.set("currency", input.currency);
    query.set("page", String(input.page ?? 1)); query.set("pageSize", String(input.pageSize ?? 10));
    return request<{ items: Project[]; page: number; pageSize: number; totalItems: number; totalPages: number }>(`/projects?${query}`);
  },
  categories: () => request<{ categories: { id: string; name: string }[] }>("/categories"),
};
