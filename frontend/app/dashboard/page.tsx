"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  addWatchlistSymbol,
  clearWatchlist,
  fetchChart,
  fetchMe,
  fetchQuotes,
  fetchWatchlist,
  removeWatchlistSymbol,
  logout,
  searchSymbols,
} from "../lib/api";
import type {
  ChartResponse,
  MarketOverviewStats,
  QuoteEntry,
  SearchResult,
  User,
  WatchlistItemView,
} from "../types";
import { HealthStatus } from "../types";

const MOCK_STATS: MarketOverviewStats = {
  symbolsTracked: 1420,
  biggestGainer: "AMD (+12.4%)",
  biggestLoser: "BYND (-8.2%)",
  mostActive: "TSLA",
};

const Navbar = ({ onSearch, onSignOut }: { onSearch: (query: string) => void; onSignOut: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-start">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            TradeLab
          </Link>
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-slate-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>

        <div className="relative w-full md:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-slate-700 rounded-lg bg-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            placeholder="Search watchlist"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>

        <div className={`${isOpen ? "flex" : "hidden"} md:flex flex-col md:flex-row items-center gap-4 w-full md:w-auto`}>
          <Link href="/portfolio" className="text-slate-300 hover:text-white transition-colors">
            Portfolio
          </Link>
          <Link href="/orders" className="text-slate-300 hover:text-white transition-colors">
            Orders
          </Link>
          <button
            onClick={onSignOut}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
          >
            Sign out
          </button>
        </div>
      </div>
    </nav>
  );
};

const MarketStatusStrip = ({ health }: { health: HealthStatus }) => {
  const [now, setNow] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  const badgeClasses =
    health === HealthStatus.OK
      ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
      : health === HealthStatus.DOWN
      ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
      : "bg-slate-500/10 text-slate-500 border-slate-500/20";

  return (
    <div className="bg-slate-900 border-b border-slate-800 py-2">
      <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between text-xs gap-3">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full border border-amber-500/20 font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            Delayed Market Data
          </span>
          <span className="text-slate-500">
            Last updated: <span className="text-slate-300">{now}</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">API Status:</span>
            <span className={`px-2 py-0.5 rounded-full border font-bold ${badgeClasses}`}>{health}</span>
          </div>
          <span className="text-slate-500 italic hidden sm:inline">Quotes may be delayed. This is paper trading.</span>
        </div>
      </div>
    </div>
  );
};

const WatchlistCard = ({
  watchlist,
  quotes,
  onView,
  onAdd,
  onRemove,
  onClear,
  searchTerm,
  addTerm,
  addResults,
  onAddTermChange,
}: {
  watchlist: WatchlistItemView[];
  quotes: Record<string, QuoteEntry>;
  onView: (s: string) => void;
  onAdd: (symbol: string, name?: string) => void;
  onRemove: (symbol: string) => void;
  onClear: () => void;
  searchTerm: string;
  addTerm: string;
  addResults: SearchResult[];
  onAddTermChange: (value: string) => void;
}) => {
  const filtered = watchlist.filter(
    (item) =>
      item.symbol.toLowerCase().includes(searchTerm.toLowerCase()) || (item.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-sm">
      <div className="p-5 border-b border-slate-800 flex justify-between items-center gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">Watchlist</h2>
          <p className="text-sm text-slate-400">Stored per user and refreshed from Alpaca (cached).</p>
        </div>
        <div className="flex gap-2">
          <button onClick={onClear} className="px-3 py-1.5 border border-slate-700 rounded-lg text-sm text-slate-200 hover:border-rose-400">
            Clear
          </button>
          <button
            onClick={() => onAdd(addTerm || (addResults[0]?.symbol ?? ""), addResults[0]?.name)}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors"
          >
            {"Add"}
          </button>
        </div>
      </div>

      <div className="p-4 bg-slate-800/50 border-b border-slate-800 space-y-3">
        <input
          value={addTerm}
          onChange={(e) => onAddTermChange(e.target.value)}
          className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-emerald-500 focus:outline-none"
          placeholder="Search symbol (e.g. TSLA)"
        />
        {addResults.length > 0 && (
          <div className="max-h-48 overflow-y-auto rounded-md border border-slate-700 bg-slate-900 divide-y divide-slate-800">
            {addResults.map((res) => (
              <button
                key={res.symbol}
                className="w-full text-left px-3 py-2 text-sm text-slate-200 hover:bg-slate-800 flex justify-between"
                onClick={() => onAdd(res.symbol, res.name)}
              >
                <span className="font-semibold">{res.symbol}</span>
                <span className="text-slate-400 truncate ml-2">{res.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-slate-500 border-b border-slate-800">
              <th className="px-5 py-3 font-medium">Symbol</th>
              <th className="px-5 py-3 font-medium">Last</th>
              <th className="px-5 py-3 font-medium">Change %</th>
              <th className="px-5 py-3 font-medium">Updated</th>
              <th className="px-5 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-slate-500">
                  Your watchlist is empty. Search and add a symbol to begin.
                </td>
              </tr>
            ) : (
              filtered.map((item) => {
                const q = quotes[item.symbol];
                const last = q?.last ?? "—";
                const change = q?.changePct;
                return (
                  <tr key={item.symbol} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="px-5 py-4">
                      <div className="font-bold text-white">{item.symbol}</div>
                      <div className="text-xs text-slate-500">{item.name || ""}</div>
                    </td>
                    <td className="px-5 py-4 font-mono text-slate-200">{typeof last === "number" ? `$${last.toFixed(2)}` : "—"}</td>
                    <td className={`px-5 py-4 font-medium ${change == null ? "text-slate-400" : change >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                      {change == null ? "—" : `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`}
                    </td>
                    <td className="px-5 py-4 text-slate-500 text-xs">{q?.updatedAt ? new Date(q.updatedAt).toLocaleTimeString() : "—"}</td>
                    <td className="px-5 py-4 space-x-3">
                      <button onClick={() => onView(item.symbol)} className="text-emerald-400 hover:text-emerald-300 font-medium">
                        View
                      </button>
                      <button onClick={() => onRemove(item.symbol)} className="text-rose-400 hover:text-rose-300 font-medium">
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const MarketOverview = ({ stats }: { stats: MarketOverviewStats }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
      <p className="text-xs text-slate-500 uppercase font-semibold">Symbols Tracked</p>
      <p className="text-2xl font-bold mt-1 text-white">{stats.symbolsTracked.toLocaleString()}</p>
    </div>
    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
      <p className="text-xs text-slate-500 uppercase font-semibold">Biggest Gainer</p>
      <p className="text-lg font-bold mt-1 text-emerald-400 truncate">{stats.biggestGainer}</p>
    </div>
    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
      <p className="text-xs text-slate-500 uppercase font-semibold">Biggest Loser</p>
      <p className="text-lg font-bold mt-1 text-rose-400 truncate">{stats.biggestLoser}</p>
    </div>
    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
      <p className="text-xs text-slate-500 uppercase font-semibold">Most Active</p>
      <p className="text-2xl font-bold mt-1 text-white">{stats.mostActive}</p>
    </div>
  </div>
);

const SelectedSymbolCard = ({ symbol, quote, chart }: { symbol: string | null; quote?: QuoteEntry; chart: ChartResponse | null }) => {
  if (!symbol) {
    return (
      <div className="bg-slate-900 p-8 rounded-xl border border-slate-800 text-center flex flex-col items-center justify-center min-h-[300px]">
        <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4 text-slate-600">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
          </svg>
        </div>
        <p className="text-slate-400">Select a symbol from your watchlist to view details</p>
      </div>
    );
  }

  const last = quote?.last;
  const change = quote?.changePct;

  const points = chart?.points || [];
  const closes = points.map((p) => p.c);
  const min = closes.length ? Math.min(...closes) : 0;
  const max = closes.length ? Math.max(...closes) : 0;
  const range = max - min || 1;

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-lg sticky top-24">
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Paper Mode</span>
            <h2 className="text-3xl font-bold text-white mt-1">{symbol}</h2>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold text-white font-mono">{typeof last === "number" ? `$${last.toFixed(2)}` : "—"}</p>
            <p className={`font-medium mt-1 ${change == null ? "text-slate-400" : change >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
              {change == null ? "—" : `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`}
            </p>
          </div>
        </div>

        <div className="h-32 bg-slate-950 rounded-lg border border-slate-800 p-2 flex items-end gap-1 relative overflow-hidden group">
          <div className="absolute top-2 left-2 text-[10px] text-slate-600 font-bold uppercase">24H Bars</div>
          {points.map((p, i) => {
            const height = ((p.c - min) / range) * 100;
            return (
              <div
                key={p.t + i}
                className="flex-1 rounded-t-sm transition-all duration-300 bg-emerald-500/30 group-hover:bg-emerald-500/50"
                style={{ height: `${height}%` }}
                title={`${p.t} : ${p.c}`}
              />
            );
          })}
          {points.length === 0 && (
            <div className="text-slate-500 text-sm absolute inset-0 flex items-center justify-center">No chart data</div>
          )}
        </div>

        <div className="flex gap-3">
          <Link
            href={`/trade?symbol=${symbol}`}
            className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-center py-2.5 rounded-lg font-bold transition-all shadow-lg shadow-emerald-900/20"
          >
            Trade
          </Link>
          <Link
            href={`/symbol/${symbol}`}
            className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-center py-2.5 rounded-lg font-bold transition-all border border-slate-700"
          >
            Details
          </Link>
        </div>
        <button className="w-full text-slate-400 text-xs py-1 border border-transparent hover:border-slate-800 rounded-md transition-colors">
          Last Updated: {quote?.updatedAt ? new Date(quote.updatedAt).toLocaleTimeString() : "—"}
        </button>
      </div>
    </div>
  );
};

const QuickActionsCard = () => {
  const actions = [
    { label: "Paper Buy", icon: "M12 4v16m8-8H4", color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Paper Sell", icon: "M20 12H4", color: "text-rose-500", bg: "bg-rose-500/10" },
    {
      label: "Run Backtest",
      icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.628.285a2 2 0 01-1.963 0l-.628-.285a6 6 0 00-3.86-.517l-2.387.477a2 2 0 00-1.022.547V18a2 2 0 00.572 1.414l2.573 2.573a2 2 0 001.414.572h6.17a2 2 0 001.414-.572l2.573-2.573A2 2 0 0020 18v-2.572z",
      color: "text-cyan-500",
      bg: "bg-cyan-500/10",
      link: "/strategy-lab",
    },
  ];

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 mt-6">
      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 gap-2">
        {actions.map((action) => (
          <Link
            key={action.label}
            href={action.link || "#"}
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-800 transition-all border border-slate-800/50 hover:border-slate-700 group"
          >
            <div
              className={`w-10 h-10 rounded-lg ${action.bg} flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110`}
            >
              <svg className={`w-5 h-5 ${action.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={action.icon}></path>
              </svg>
            </div>
            <span className="font-semibold text-slate-200">{action.label}</span>
            <svg className="w-4 h-4 ml-auto text-slate-600 group-hover:text-slate-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </Link>
        ))}
      </div>
    </div>
  );
};

const Dashboard = ({ user }: { user: User }) => {
  const [watchlist, setWatchlist] = useState<WatchlistItemView[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [apiHealth, setApiHealth] = useState<HealthStatus>(HealthStatus.LOADING);
  const [searchTerm, setSearchTerm] = useState("");
  const [addTerm, setAddTerm] = useState("");
  const [addResults, setAddResults] = useState<SearchResult[]>([]);
  const [quotes, setQuotes] = useState<Record<string, QuoteEntry>>({});
  const [chart, setChart] = useState<ChartResponse | null>(null);
  const handleSignOut = useCallback(() => {
    logout()
      .catch(() => null)
      .finally(() => {
        window.location.href = "/signin";
      });
  }, []);

  const fetchHealth = useCallback(async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
      const res = await fetch(`${baseUrl}/health`);
      setApiHealth(res.ok ? HealthStatus.OK : HealthStatus.DOWN);
    } catch {
      setApiHealth(HealthStatus.DOWN);
    }
  }, []);

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 30_000);
    return () => clearInterval(interval);
  }, [fetchHealth]);

  const loadWatchlist = useCallback(async () => {
    const data = await fetchWatchlist();
    const items = data.symbols.map((s) => ({ symbol: s }));
    setWatchlist(items);
    if (!selectedSymbol && items.length > 0) {
      setSelectedSymbol(items[0].symbol);
    }
  }, [selectedSymbol]);

  useEffect(() => {
    loadWatchlist().catch(() => setWatchlist([]));
  }, [loadWatchlist]);

  useEffect(() => {
    if (!addTerm.trim()) {
      setAddResults([]);
      return;
    }
    const timeout = setTimeout(() => {
      searchSymbols(addTerm.trim()).then((res) => setAddResults(res.results)).catch(() => setAddResults([]));
    }, 250);
    return () => clearTimeout(timeout);
  }, [addTerm]);

  useEffect(() => {
    if (watchlist.length === 0) {
      setQuotes({});
      return;
    }
    let cancelled = false;
    const symbols = watchlist.map((w) => w.symbol);

    const run = async () => {
      try {
        const res = await fetchQuotes(symbols);
        if (!cancelled) {
          setQuotes(res.quotes || {});
        }
      } catch {
        if (!cancelled) setQuotes({});
      }
    };

    run();
    const interval = setInterval(run, 20_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [watchlist]);

  useEffect(() => {
    if (!selectedSymbol) {
      setChart(null);
      return;
    }
    let cancelled = false;
    fetchChart(selectedSymbol)
      .then((res) => {
        if (!cancelled) setChart(res);
      })
      .catch(() => {
        if (!cancelled) setChart(null);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedSymbol]);

  const handleAdd = async (symbol: string, name?: string) => {
    const trimmed = symbol.trim().toUpperCase();
    if (!trimmed) return;
    try {
      const res = await addWatchlistSymbol(trimmed);
      const items = res.symbols.map((s) => ({ symbol: s, name: s === trimmed ? name : undefined }));
      setWatchlist(items);
      setAddTerm("");
      setAddResults([]);
      if (!selectedSymbol) setSelectedSymbol(trimmed);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemove = async (symbol: string) => {
    try {
      const res = await removeWatchlistSymbol(symbol);
      const items = res.symbols.map((s) => ({ symbol: s }));
      setWatchlist(items);
      if (selectedSymbol === symbol) {
        setSelectedSymbol(items[0]?.symbol || null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleClear = async () => {
    try {
      await clearWatchlist();
      setWatchlist([]);
      setSelectedSymbol(null);
      setQuotes({});
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <Navbar onSearch={setSearchTerm} onSignOut={handleSignOut} />
      <MarketStatusStrip health={apiHealth} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-emerald-400">Dashboard</p>
            <h1 className="text-3xl font-bold text-white">Welcome back, {user.full_name ?? user.email}</h1>
            <p className="text-slate-400">Paper trading workspace with delayed market data.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <WatchlistCard
              watchlist={watchlist}
              quotes={quotes}
              onView={setSelectedSymbol}
              onAdd={handleAdd}
              onRemove={handleRemove}
              onClear={handleClear}
              searchTerm={searchTerm}
              addTerm={addTerm}
              addResults={addResults}
              onAddTermChange={setAddTerm}
            />

            <section>
              <h2 className="text-xl font-bold text-white mb-4">Market Overview</h2>
              <MarketOverview stats={MOCK_STATS} />
            </section>

            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-emerald-500/10 rounded-lg">
                  <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Paper Trading Mode</h3>
                  <p className="text-slate-400 mt-1 leading-relaxed">
                    Watchlist is persisted to Postgres; quotes and charts are pulled from Alpaca via the backend with Redis caching. All trades here use
                    virtual currency.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <SelectedSymbolCard symbol={selectedSymbol} quote={selectedSymbol ? quotes[selectedSymbol] : undefined} chart={chart} />
            <QuickActionsCard />

            <div className="p-6 bg-slate-900/50 rounded-xl border border-slate-800">
              <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">Recent Activity</h4>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${i % 2 === 0 ? "bg-emerald-500" : "bg-rose-500"}`}></div>
                      <span className="text-slate-300 font-medium">Placeholder activity {i}</span>
                    </div>
                    <span className="text-slate-500 text-xs">{i}h ago</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-900 bg-slate-950 mt-12 py-8 text-center text-slate-600 text-sm">
        <p>© 2024 TradeLab Fintech Solutions. Delayed data provided by PaperTrade API.</p>
        <div className="flex justify-center gap-6 mt-4">
          <a href="#" className="hover:text-slate-400 transition-colors">
            Privacy
          </a>
          <a href="#" className="hover:text-slate-400 transition-colors">
            Terms
          </a>
          <a href="#" className="hover:text-slate-400 transition-colors">
            Help Center
          </a>
        </div>
      </footer>
    </div>
  );
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMe()
      .then((u) => setUser(u))
      .catch(() => router.push("/signin"))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) return null;
  if (!user) return null;

  return <Dashboard user={user} />;
}
