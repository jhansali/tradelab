"use client";

import StockChart from "./StockChart";
import type { StockData } from "../../types";

const MOCK_DATA: StockData[] = [
  {
    symbol: "NVDA",
    name: "NVIDIA Corp",
    price: 124.52,
    change: 4.21,
    changePercent: 3.5,
    history: [
      { time: "09:30", value: 118 },
      { time: "10:30", value: 120 },
      { time: "11:30", value: 119 },
      { time: "12:30", value: 122 },
      { time: "13:30", value: 125 },
      { time: "14:30", value: 124 },
      { time: "15:30", value: 124.52 },
    ],
  },
  {
    symbol: "AAPL",
    name: "Apple Inc",
    price: 228.12,
    change: -1.45,
    changePercent: -0.63,
    history: [
      { time: "09:30", value: 230 },
      { time: "10:30", value: 229 },
      { time: "11:30", value: 228 },
      { time: "12:30", value: 229.5 },
      { time: "13:30", value: 227 },
      { time: "14:30", value: 228 },
      { time: "15:30", value: 228.12 },
    ],
  },
];

const MarketPreview = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
      {MOCK_DATA.map((stock) => (
        <div key={stock.symbol} className="glass-morphism p-6 rounded-2xl shadow-2xl border border-slate-800/60">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-2xl font-bold">{stock.symbol}</h3>
              <p className="text-slate-400 text-sm">{stock.name}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">${stock.price.toFixed(2)}</p>
              <p
                className={`text-sm font-semibold ${
                  stock.change >= 0 ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {stock.change >= 0 ? "+" : ""}
                {stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
              </p>
            </div>
          </div>
          <div className="h-48">
            <StockChart data={stock.history} color={stock.change >= 0 ? "#10b981" : "#f43f5e"} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default MarketPreview;
