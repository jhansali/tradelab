"use client";

const STEPS = [
  {
    step: "01",
    title: "Connect Your Watchlist",
    desc: "Select the assets you want to monitor. We provide delayed quotes for US equities and major indices.",
  },
  {
    step: "02",
    title: "Place Trades or Run Strategies",
    desc: "Use the manual interface to place paper trades, or dive into the Strategy Lab to write and backtest automated logic.",
  },
  {
    step: "03",
    title: "Review Performance Reports",
    desc: "Analyze your PnL, equity curve, and win rate. Refine your edge until you're ready for the real thing.",
  },
];

const HowItWorks = () => {
  return (
    <div id="how-it-works" className="py-24 bg-slate-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">How it Works</h2>
          <p className="text-slate-400 max-w-xl mx-auto">Three simple steps to transition from novice to systematic trader.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-slate-800 -z-10" />
          {STEPS.map((s) => (
            <div key={s.step} className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-slate-950 border-4 border-slate-800 text-indigo-400 flex items-center justify-center text-2xl font-black mb-8 shadow-xl">
                {s.step}
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{s.title}</h3>
              <p className="text-slate-400">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
