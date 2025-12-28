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

export interface StockSymbol {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  lastUpdated: string;
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
