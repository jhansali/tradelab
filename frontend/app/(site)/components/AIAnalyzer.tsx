"use client";

import { useMemo, useState } from "react";
import type { MarketInsight, RiskLevel, Sentiment } from "../../types";

const SENTIMENTS: Sentiment[] = ["Bullish", "Bearish", "Neutral"];
const RISKS: RiskLevel[] = ["Low", "Medium", "High"];

const randomFrom = <T,>(items: T[]): T => items[Math.floor(Math.random() * items.length)];

const buildMockInsight = (symbol: string): MarketInsight => {
  const sentiment = randomFrom(SENTIMENTS);
  const riskLevel = randomFrom(RISKS);
  return {
    sentiment,
    riskLevel,
    analysis: `${symbol} shows ${sentiment.toLowerCase()} momentum with ${riskLevel.toLowerCase()} risk. Use this as an educational preview before committing capital.`,
    keyDrivers: [
      "Earnings expectations",
      "Macro sentiment",
      "Volume shifts",
      "Technicals at key levels",
    ].slice(0, 3),
  };
};

const AIAnalyzer = () => {
  const [symbol, setSymbol] = useState("");
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState<MarketInsight | null>(null);
  const [error, setError] = useState<string | null>(null);

  const headline = useMemo(() => insight?.sentiment ?? "Neutral", [insight]);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await new Promise((res) => setTimeout(res, 400));
      setInsight(buildMockInsight(symbol.trim().toUpperCase()));
    } catch (err) {
      console.error(err);
      setError("Unable to retrieve AI analysis right now. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-morphism p-8 rounded-3xl border border-sky-500/20 shadow-2xl shadow-sky-500/5">
      <div className="flex flex-col md:flex-row gap-6 items-start justify-between mb-8">
        <div className="max-w-md">
          <h2 className="text-3xl font-bold mb-3 flex items-center gap-2">
            <span className="p-2 bg-sky-500/20 rounded-lg">✨</span>
            AI Market Sentinel
          </h2>
          <p className="text-slate-400">Get instant educational analysis for any ticker.</p>
        </div>
        <form onSubmit={handleAnalyze} className="w-full md:w-auto flex gap-2">
          <input
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            placeholder="Enter Ticker (e.g. TSLA)"
            className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-sky-500 w-full md:w-48"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-sky-500/20 whitespace-nowrap"
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </form>
      </div>

      {error && <div className="mb-4 rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-rose-100">{error}</div>}

      {insight ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="md:col-span-2 space-y-4">
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
              <h4 className="text-sky-400 font-semibold mb-2 uppercase text-xs tracking-wider">Analysis Overview</h4>
              <p className="text-slate-300 leading-relaxed">{insight.analysis}</p>
            </div>
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
              <h4 className="text-sky-400 font-semibold mb-3 uppercase text-xs tracking-wider">Key Catalysts</h4>
              <div className="flex flex-wrap gap-2">
                {insight.keyDrivers.map((driver) => (
                  <span
                    key={driver}
                    className="bg-slate-900 px-3 py-1 rounded-full text-sm border border-slate-700 text-slate-300"
                  >
                    • {driver}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div
              className={`p-6 rounded-2xl border flex flex-col items-center justify-center text-center ${
                insight.sentiment === "Bullish"
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                  : insight.sentiment === "Bearish"
                  ? "bg-rose-500/10 border-rose-500/30 text-rose-400"
                  : "bg-slate-500/10 border-slate-500/30 text-slate-400"
              }`}
            >
              <span className="text-xs uppercase font-bold tracking-widest mb-1 opacity-70">Sentiment</span>
              <span className="text-3xl font-black">{headline}</span>
            </div>
            <div
              className={`p-6 rounded-2xl border flex flex-col items-center justify-center text-center ${
                insight.riskLevel === "Low"
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                  : insight.riskLevel === "High"
                  ? "bg-rose-500/10 border-rose-500/30 text-rose-400"
                  : "bg-amber-500/10 border-amber-500/30 text-amber-400"
              }`}
            >
              <span className="text-xs uppercase font-bold tracking-widest mb-1 opacity-70">Risk Rating</span>
              <span className="text-3xl font-black">{insight.riskLevel}</span>
            </div>
          </div>
        </div>
      ) : !loading ? (
        <div className="flex flex-col items-center justify-center py-12 text-slate-500 border-2 border-dashed border-slate-800 rounded-2xl">
          <p className="text-lg">Search for a ticker to see AI analysis</p>
        </div>
      ) : null}
    </div>
  );
};

export default AIAnalyzer;
