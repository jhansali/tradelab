"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "Is this real trading?",
    a: "No. TradeLab is a paper trading platform. All capital is virtual and trades do not affect real markets.",
  },
  {
    q: "Is the data delayed?",
    a: "Yes. To keep the service free for everyone, market data is typically delayed by 15 minutes, which is standard for most educational platforms.",
  },
  {
    q: "Can I backtest strategies?",
    a: "Absolutely. Our Strategy Lab allows you to replay historical data and see how your manual or automated strategies would have performed.",
  },
  {
    q: "Do you guarantee profits?",
    a: "Definitely not. Trading involves significant risk. Our platform is for educational and strategy development purposes only.",
  },
  {
    q: "What tech stack is this built on?",
    a: "The core platform uses React, Tailwind CSS, and is powered by professional market data APIs and AI sentiment analysis.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div id="faq" className="py-24 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-white text-center mb-12">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {FAQS.map((f, i) => (
          <div key={f.q} className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/50">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-800/50 transition-colors"
            >
              <span className="text-lg font-medium text-white">{f.q}</span>
              <svg
                className={`w-5 h-5 text-slate-500 transition-transform ${openIndex === i ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openIndex === i && <div className="p-6 pt-0 text-slate-400 leading-relaxed border-t border-slate-800/50">{f.a}</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
