export type Sentiment = "Bullish" | "Bearish" | "Neutral";
export type RiskLevel = "Low" | "Medium" | "High";

export interface StockHistoryPoint {
  time: string;
  value: number;
}

export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  history: StockHistoryPoint[];
}

export interface MarketInsight {
  sentiment: Sentiment;
  analysis: string;
  keyDrivers: string[];
  riskLevel: RiskLevel;
}

export interface User {
  id: number;
  email: string;
  created_at: string;
  full_name?: string | null;
}

export interface AuthResponse {
  message: string;
  user: User;
}

export enum HealthStatus {
  OK = "OK",
  DOWN = "DOWN",
  LOADING = "LOADING",
}

export interface MarketOverviewStats {
  symbolsTracked: number;
  biggestGainer: string;
  biggestLoser: string;
  mostActive: string;
}

export interface WatchlistResponse {
  symbols: string[];
}

export interface SearchResult {
  symbol: string;
  name: string;
}

export interface MarketSearchResponse {
  results: SearchResult[];
}

export interface QuoteEntry {
  symbol: string;
  last: number | null;
  bid: number | null;
  ask: number | null;
  changePct: number | null;
  updatedAt?: string | null;
}

export interface QuotesResponse {
  asOf: string;
  quotes: Record<string, QuoteEntry>;
}

export interface ChartPoint {
  t: string;
  c: number;
}

export interface ChartResponse {
  symbol: string;
  asOf: string;
  points: ChartPoint[];
}

export interface WatchlistItemView {
  symbol: string;
  name?: string;
}
