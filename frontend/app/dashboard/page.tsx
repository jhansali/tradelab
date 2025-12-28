"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { clearUser, loadUser } from "../components/auth/storage";
import type { MarketOverviewStats, StockSymbol, User } from "../types";
import { HealthStatus } from "../types";

const INITIAL_WATCHLIST: StockSymbol[] = [
  { symbol: "AAPL", name: "Apple Inc.", price: 178.44, change: 1.25, changePercent: 0.71, lastUpdated: "14:25:01" },
  { symbol: "TSLA", name: "Tesla, Inc.", price: 214.5, change: -4.32, changePercent: -1.97, lastUpdated: "14:24:58" },
  { symbol: "NVDA", name: "NVIDIA Corp.", price: 822.79, change: 15.4, changePercent: 1.91, lastUpdated: "14:25:05" },
  { symbol: "MSFT", name: "Microsoft Corp.", price: 415.1, change: 2.1, changePercent: 0.51, lastUpdated: "14:25:02" },
];

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
            placeholder="Search ticker e.g. AAPL"
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
          <div className="relative group">
            <button className="flex items-center gap-2 p-1 rounded-full border border-slate-700 hover:bg-slate-800 transition-colors">
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                <svg className="w-5 h-5 text-slate-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                </svg>
              </div>
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2">
              <Link href="/profile" className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 block">
                Profile
              </Link>
              <button onClick={onSignOut} className="w-full text-left px-4 py-2 text-sm text-rose-400 hover:bg-slate-700">
                Logout
              </button>
            </div>
          </div>
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
  onView,
  onAdd,
}: {
  watchlist: StockSymbol[];
  onView: (s: StockSymbol) => void;
  onAdd: (symbol: string) => void;
}) => {
  const [newSymbol, setNewSymbol] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSymbol.trim()) {
      onAdd(newSymbol.toUpperCase());
      setNewSymbol("");
      setShowAdd(false);
    }
  };

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-sm">
      <div className="p-5 border-b border-slate-800 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-white">Watchlist</h2>
          <p className="text-sm text-slate-400">Your tracked symbols (delayed quotes)</p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors"
        >
          {showAdd ? "Cancel" : "+ Add Symbol"}
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleAddSubmit} className="p-4 bg-slate-800/50 border-b border-slate-800 flex gap-2">
          <input
            autoFocus
            className="flex-1 bg-slate-950 border border-slate-700 rounded-md px-3 py-1 text-sm focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            placeholder="Symbol (e.g. BTC)"
            value={newSymbol}
            onChange={(e) => setNewSymbol(e.target.value)}
          />
          <button type="submit" className="px-4 py-1 bg-emerald-600 rounded-md text-sm font-medium">
            Add
          </button>
        </form>
      )}

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
            {watchlist.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-slate-500">
                  Your watchlist is empty. Add a symbol to begin.
                </td>
              </tr>
            ) : (
              watchlist.map((item) => (
                <tr key={item.symbol} className="hover:bg-slate-800/30 transition-colors group">
                  <td className="px-5 py-4">
                    <div className="font-bold text-white">{item.symbol}</div>
                    <div className="text-xs text-slate-500">{item.name}</div>
                  </td>
                  <td className="px-5 py-4 font-mono text-slate-200">${item.price.toFixed(2)}</td>
                  <td className={`px-5 py-4 font-medium ${item.change >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                    {item.change >= 0 ? "+" : ""}
                    {item.changePercent.toFixed(2)}%
                  </td>
                  <td className="px-5 py-4 text-slate-500 text-xs">{item.lastUpdated}</td>
                  <td className="px-5 py-4">
                    <button onClick={() => onView(item)} className="text-emerald-400 hover:text-emerald-300 font-medium group-hover:underline">
                      View
                    </button>
                  </td>
                </tr>
              ))
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

const SelectedSymbolCard = ({ symbol }: { symbol: StockSymbol | null }) => {
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

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-lg sticky top-24">
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Market Open</span>
            <h2 className="text-3xl font-bold text-white mt-1">{symbol.symbol}</h2>
            <p className="text-slate-400">{symbol.name}</p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold text-white font-mono">${symbol.price.toFixed(2)}</p>
            <p className={`font-medium mt-1 ${symbol.change >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
              {symbol.change >= 0 ? "+" : ""}
              {symbol.change.toFixed(2)} ({symbol.changePercent.toFixed(2)}%)
            </p>
          </div>
        </div>

        <div className="h-24 bg-slate-950 rounded-lg border border-slate-800 p-2 flex items-end gap-1 mb-6 relative overflow-hidden group">
          <div className="absolute top-2 left-2 text-[10px] text-slate-600 font-bold uppercase">24h History</div>
          {Array.from({ length: 20 }).map((_, i) => {
            const height = 20 + Math.random() * 60;
            return (
              <div
                key={i}
                className={`flex-1 rounded-t-sm transition-all duration-300 ${
                  symbol.change >= 0 ? "bg-emerald-500/20 group-hover:bg-emerald-500/40" : "bg-rose-500/20 group-hover:bg-rose-500/40"
                }`}
                style={{ height: `${height}%` }}
              />
            );
          })}
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex gap-3">
            <Link
              href={`/trade?symbol=${symbol.symbol}`}
              className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-center py-2.5 rounded-lg font-bold transition-all shadow-lg shadow-emerald-900/20"
            >
              Trade
            </Link>
            <Link
              href={`/symbol/${symbol.symbol}`}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-center py-2.5 rounded-lg font-bold transition-all border border-slate-700"
            >
              Details
            </Link>
          </div>
          <button className="w-full text-slate-400 text-xs py-1 border border-transparent hover:border-slate-800 rounded-md transition-colors">
            Last Updated: Today {symbol.lastUpdated}
          </button>
        </div>
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
  const [watchlist, setWatchlist] = useState<StockSymbol[]>(INITIAL_WATCHLIST);
  const [selectedSymbol, setSelectedSymbol] = useState<StockSymbol | null>(INITIAL_WATCHLIST[1]);
  const [apiHealth, setApiHealth] = useState<HealthStatus>(HealthStatus.LOADING);
  const [searchQuery, setSearchQuery] = useState("");

  const addToWatchlist = (symbol: string) => {
    const newItem: StockSymbol = {
      symbol,
      name: `${symbol} Corporation`,
      price: Math.random() * 500 + 10,
      change: (Math.random() - 0.5) * 10,
      changePercent: (Math.random() - 0.5) * 5,
      lastUpdated: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    };
    setWatchlist((prev) => [newItem, ...prev]);
  };

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

  const filteredWatchlist = useMemo(
    () =>
      watchlist.filter(
        (s) => s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || s.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [searchQuery, watchlist]
  );

  const handleSignOut = () => {
    clearUser();
    window.location.href = "/signin";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <Navbar onSearch={setSearchQuery} onSignOut={handleSignOut} />
      <MarketStatusStrip health={apiHealth} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-emerald-400">Dashboard</p>
            <h1 className="text-3xl font-bold text-white">Welcome back, {user.full_name ?? user.email}</h1>
            <p className="text-slate-400">Paper trading workspace with delayed market data.</p>
          </div>
          <button
            onClick={handleSignOut}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
          >
            Sign out
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <WatchlistCard watchlist={filteredWatchlist} onView={setSelectedSymbol} onAdd={addToWatchlist} />

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
                    Welcome to the TradeLab simulator. All trades executed here use virtual currency. Market data is provided with a 15-minute delay
                    from major exchanges. Use this environment to test your strategies risk-free.
                  </p>
                  <button className="mt-4 text-emerald-400 font-semibold hover:text-emerald-300 transition-colors inline-flex items-center gap-1 text-sm">
                    Read the Strategy Guide
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <SelectedSymbolCard symbol={selectedSymbol} />
            <QuickActionsCard />

            <div className="mt-8 p-6 bg-slate-900/50 rounded-xl border border-slate-800">
              <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">Recent Activity</h4>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${i % 2 === 0 ? "bg-emerald-500" : "bg-rose-500"}`}></div>
                      <span className="text-slate-300 font-medium">Buy {i * 10} AAPL</span>
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

  useEffect(() => {
    const saved = loadUser();
    if (!saved) {
      router.push("/signin");
      return;
    }
    setUser(saved);
  }, [router]);

  if (!user) return null;

  return <Dashboard user={user} />;
}
