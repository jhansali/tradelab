import type {
  AuthResponse,
  ChartResponse,
  MarketSearchResponse,
  QuotesResponse,
  User,
  WatchlistResponse,
} from "../types";

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

export async function fetchWatchlist(): Promise<WatchlistResponse> {
  return apiRequest<WatchlistResponse>("/api/watchlist", { method: "GET" });
}

export async function addWatchlistSymbol(symbol: string): Promise<WatchlistResponse> {
  return apiRequest<WatchlistResponse>("/api/watchlist", {
    method: "POST",
    body: JSON.stringify({ symbol }),
  });
}

export async function removeWatchlistSymbol(symbol: string): Promise<WatchlistResponse> {
  return apiRequest<WatchlistResponse>(`/api/watchlist/${encodeURIComponent(symbol)}`, { method: "DELETE" });
}

export async function clearWatchlist(): Promise<WatchlistResponse> {
  return apiRequest<WatchlistResponse>("/api/watchlist", { method: "DELETE" });
}

export async function searchSymbols(query: string): Promise<MarketSearchResponse> {
  const url = `/api/market/search?q=${encodeURIComponent(query)}`;
  return apiRequest<MarketSearchResponse>(url, { method: "GET" });
}

export async function fetchQuotes(symbols: string[]): Promise<QuotesResponse> {
  const param = symbols.join(",");
  return apiRequest<QuotesResponse>(`/api/market/quotes?symbols=${encodeURIComponent(param)}`, { method: "GET" });
}

export async function fetchChart(symbol: string): Promise<ChartResponse> {
  return apiRequest<ChartResponse>(`/api/market/chart?symbol=${encodeURIComponent(symbol)}`, { method: "GET" });
}
