import type { AuthResponse, User } from "../types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

async function apiRequest<T>(path: string, options: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    credentials: "include",
  });

  if (!res.ok) {
    const detail = await res.json().catch(() => null);
    const message = detail?.detail || res.statusText || "Request failed";
    throw new Error(message);
  }

  return (await res.json()) as T;
}

export async function signup(email: string, password: string, full_name?: string | null): Promise<AuthResponse> {
  return apiRequest<AuthResponse>("/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password, full_name }),
  });
}

export async function signin(email: string, password: string): Promise<AuthResponse> {
  return apiRequest<AuthResponse>("/auth/signin", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function fetchMe(): Promise<AuthResponse["user"]> {
  return apiRequest<User>("/auth/me", { method: "GET" });
}

export async function logout(): Promise<void> {
  await apiRequest<void>("/auth/logout", { method: "POST" });
}
