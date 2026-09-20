import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';

export default function InteractiveApexDemo() {
  const [amount, setAmount] = useState('100');
  const [pair, setPair] = useState('USD_NGN');

  const rates = {
    USD_NGN: { rate: 1540.50, label: 'USD → NGN', symbol: '₦', trend: '+1.2%' },
    EUR_USD: { rate: 1.085, label: 'EUR → USD', symbol: '$', trend: '+0.4%' },
    GBP_USD: { rate: 1.295, label: 'GBP → USD', symbol: '$', trend: '-0.2%' },
  };

  const current = rates[pair];
  const calculated = (parseFloat(amount || '0') * current.rate).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="rounded-xl bg-[#0d0e12] border border-[#1f222c] p-4 sm:p-5 text-left font-mono">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#1b1e26] text-xs">
        <span className="text-[#9ca3af]">Apex Market Intelligence</span>
        <span className="flex items-center gap-1 text-emerald-400">
          <TrendingUp size={12} />
          {current.trend}
        </span>
      </div>

      {/* Pair Switcher */}
      <div className="flex gap-2 mb-4">
        {Object.keys(rates).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPair(p)}
            className={`px-2.5 py-1 rounded text-xs transition-all ${
              pair === p
                ? 'bg-blue-600 text-white font-semibold'
                : 'bg-[#161820] text-[#9ca3af] hover:text-white'
            }`}
          >
            {p.replace('_', '/')}
          </button>
        ))}
      </div>

      {/* Live Calculator */}
      <div className="space-y-3">
        <div className="p-3 rounded-lg bg-[#14161d] border border-[#1e222c]">
          <div className="text-[11px] text-[#5b6270] mb-1">Input Base Value:</div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-transparent text-sm sm:text-base text-white font-semibold focus:outline-none w-full"
              placeholder="100"
            />
            <span className="text-xs text-[#9ca3af]">{pair.split('_')[0]}</span>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-[#14161d] border border-[#1e222c]">
          <div className="text-[11px] text-[#5b6270] mb-1">Converted Output:</div>
          <div className="flex items-center justify-between">
            <span className="text-sm sm:text-base font-bold text-emerald-400">
              {current.symbol} {calculated}
            </span>
            <span className="text-xs text-[#9ca3af]">{pair.split('_')[1]}</span>
          </div>
        </div>

        {/* Lightweight SVG Trend Line */}
        <div className="pt-2">
          <div className="text-[10px] text-[#5b6270] mb-1">30-Day Volatility Vector (Pure SVG):</div>
          <svg className="w-full h-8 overflow-visible" viewBox="0 0 200 30">
            <path
              d="M0,22 Q30,10 60,18 T120,8 T160,15 T200,5"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
            />
            <circle cx="200" cy="5" r="3" fill="#3b82f6" />
          </svg>
        </div>
      </div>
    </div>
  );
}
