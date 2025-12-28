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
}

export interface AuthResponse {
  message: string;
  user: User;
}
