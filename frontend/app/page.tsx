'use client';

import AIAnalyzer from "./components/marketing/AIAnalyzer";
import FAQ from "./components/marketing/FAQ";
import Features from "./components/marketing/Features";
import HowItWorks from "./components/marketing/HowItWorks";
import MarketPreview from "./components/marketing/MarketPreview";
import Navbar from "./components/marketing/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 selection:bg-indigo-500/30">
      <Navbar />

      <header className="relative pt-32 pb-24 lg:pt-48 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 blur-[120px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Real-time Virtual Trading
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 tracking-tight leading-[1.1]">
            Practice trading with <br />
            <span className="bg-gradient-to-r from-indigo-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              real market data.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed">
            TradeLab gives you $100,000 in virtual capital to test your theories. No risk, no deposits. Just
            institutional-grade paper trading and strategy backtesting.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24">
            <a
              href="/signup"
              className="w-full sm:w-auto px-10 py-5 bg-white text-slate-950 font-bold rounded-lg hover:bg-slate-100 transition-all text-lg shadow-2xl shadow-white/5"
            >
              Start Paper Trading
            </a>
            <a
              href="/strategy-lab"
              className="w-full sm:w-auto px-10 py-5 bg-slate-900 text-white font-bold rounded-lg border border-slate-800 hover:bg-slate-800 transition-all text-lg"
            >
              Explore Strategy Lab
            </a>
          </div>

          <div className="text-slate-500 mb-12 uppercase text-xs font-bold tracking-[0.2em]">Trusted by Builders from</div>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-40 grayscale filter invert brightness-200">
            <div className="text-2xl font-black italic">TECHFLOW</div>
            <div className="text-2xl font-black italic">QUANTSYS</div>
            <div className="text-2xl font-black italic">BLOCKLAB</div>
            <div className="text-2xl font-black italic">UPTICK</div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 mt-24">
          <div className="relative group">
            <div className="absolute inset-0 bg-indigo-600/10 blur-[100px] -z-10 group-hover:bg-indigo-600/20 transition-all" />
            <MarketPreview />
          </div>
        </div>
      </header>

      <section className="border-y border-slate-800/50 bg-slate-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 border-r border-slate-800/50 last:border-0">
              <div className="text-indigo-400 mb-2">
                <svg className="w-6 h-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-white mb-1">Delayed real market data</h4>
              <p className="text-slate-500 text-sm">Educational 15m delay</p>
            </div>
            <div className="text-center p-6 border-r border-slate-800/50 last:border-0">
              <div className="text-indigo-400 mb-2">
                <svg className="w-6 h-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-white mb-1">Backtests in minutes</h4>
              <p className="text-slate-500 text-sm">High-speed replay engine</p>
            </div>
            <div className="text-center p-6 border-r border-slate-800/50 last:border-0">
              <div className="text-indigo-400 mb-2">
                <svg className="w-6 h-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-white mb-1">Real-time updates</h4>
              <p className="text-slate-500 text-sm">WebSocket live push</p>
            </div>
            <div className="text-center p-6">
              <div className="text-indigo-400 mb-2">
                <svg className="w-6 h-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-white mb-1">Replay any range</h4>
              <p className="text-slate-500 text-sm">20+ years of history</p>
            </div>
          </div>
        </div>
      </section>

      <Features />

      <section className="py-24 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Integrated AI Lab</h2>
            <p className="text-slate-400">Leverage AI-style sentiment to analyze tickers before you trade.</p>
          </div>
          <AIAnalyzer />
        </div>
      </section>

      <HowItWorks />
      <FAQ />

      <section className="py-24 px-4 bg-indigo-600 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-8">Ready to test your edge?</h2>
          <p className="text-xl text-indigo-100 mb-12">Join thousands of traders building their future in the markets today.</p>
          <a
            href="/signup"
            className="px-12 py-6 bg-white text-indigo-600 font-bold rounded-xl text-xl hover:shadow-2xl transition-all inline-block"
          >
            Open Virtual Account
          </a>
        </div>
      </section>

      <footer className="py-20 border-t border-slate-900 px-4 sm:px-6 lg:px-8 bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <span className="text-xl font-bold tracking-tight text-white">TradeLab</span>
              </div>
              <p className="text-slate-500 max-w-sm">
                The world's most advanced paper trading environment. Built for those who take the market seriously.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Platform</h4>
              <ul className="space-y-4 text-slate-500 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Strategy Lab
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Backtesting
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Live Markets
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Support</h4>
              <ul className="space-y-4 text-slate-500 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API Docs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Community
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-slate-900 gap-6">
            <div className="flex gap-8 text-slate-500 text-xs font-medium uppercase tracking-wider">
              <a href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Risk Disclosure
              </a>
            </div>
            <p className="text-slate-600 text-xs">
              © 2024 TradeLab. For educational purposes only. Market data provided by delayed feed.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
