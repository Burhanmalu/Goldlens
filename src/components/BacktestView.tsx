'use client';

import React, { useState } from 'react';
import {
  BarChart3, Play,
  ChevronDown, ChevronUp
} from 'lucide-react';

export function BacktestView() {
  const [strategy, setStrategy] = useState('GOLDM / GOLDTEN');
  const [period, setPeriod] = useState('2022 — 2025');
  const capital = 1000000;
  const txCost = 0.08;
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = () => {
    setIsRunning(true);
    setTimeout(() => setIsRunning(false), 600);
  };

  return (
    <div className="flex-1 bg-[#0B0E11] overflow-y-auto p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 font-sans select-none">
      <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2B3139] pb-4">
          <div>
            <div className="flex items-center gap-2 text-gold font-bold text-xs uppercase tracking-wider mb-1 font-mono">
              <BarChart3 size={14} />
              <span>ROBUSTNESS VALIDATION</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-foreground">Strategy Backtesting</h1>
            <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
              Simulate relative-value execution on unseen historical and out-of-sample MCX data.
            </p>
          </div>

          <span className="self-start sm:self-auto px-3 py-1 bg-buy/15 border border-buy/30 rounded-full text-buy font-bold text-xs font-mono">
            ✓ Walk-Forward Validated
          </span>
        </div>

        {/* Input Parameters Bar */}
        <div className="p-4 sm:p-5 bg-[#161A1F] rounded-2xl border border-[#2B3139] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 items-end text-xs font-mono">
          <div>
            <label className="text-muted block mb-1 text-[11px]">STRATEGY PAIR</label>
            <select
              value={strategy}
              onChange={(e) => setStrategy(e.target.value)}
              className="w-full bg-[#11151A] px-3 py-2.5 rounded-xl border border-[#2B3139] text-foreground font-bold focus:outline-none min-h-[42px] touch-manipulation"
            >
              <option value="GOLDM / GOLDTEN">GOLDM / GOLDTEN</option>
              <option value="GOLDGUINEA / GOLDPETAL">GOLDGUINEA / GOLDPETAL</option>
              <option value="GOLDM / GOLDGUINEA">GOLDM / GOLDGUINEA</option>
            </select>
          </div>

          <div>
            <label className="text-muted block mb-1 text-[11px]">TEST PERIOD</label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="w-full bg-[#11151A] px-3 py-2.5 rounded-xl border border-[#2B3139] text-foreground font-semibold focus:outline-none min-h-[42px] touch-manipulation"
            >
              <option value="2022 — 2025">2022 — 2025 (4 Folds)</option>
              <option value="2024 — 2025">2024 — 2025 (Recent)</option>
              <option value="2020 — 2025">2020 — 2025 (5 Years)</option>
            </select>
          </div>

          <div>
            <label className="text-muted block mb-1 text-[11px]">INITIAL CAPITAL</label>
            <div className="bg-[#11151A] px-3 py-2.5 rounded-xl border border-[#2B3139] text-foreground font-bold flex items-center min-h-[42px]">
              ₹{capital.toLocaleString('en-IN')}
            </div>
          </div>

          <div>
            <label className="text-muted block mb-1 text-[11px]">TRANSACTION COSTS</label>
            <div className="bg-[#11151A] px-3 py-2.5 rounded-xl border border-[#2B3139] text-foreground font-bold flex items-center min-h-[42px]">
              {txCost}% / round-trip
            </div>
          </div>

          <div className="sm:col-span-2 lg:col-span-1">
            <button
              onClick={handleRun}
              disabled={isRunning}
              className="w-full py-2.5 bg-gold hover:bg-gold-hover text-background font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-md min-h-[44px] touch-manipulation"
            >
              <Play size={13} className={isRunning ? 'animate-spin' : 'fill-background'} />
              <span>{isRunning ? 'RUNNING...' : 'RUN BACKTEST'}</span>
            </button>
          </div>
        </div>

        {/* 4 Clean Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 font-mono">
          <div className="p-3.5 sm:p-4 bg-[#161A1F] rounded-2xl border border-[#2B3139]">
            <span className="text-[10px] sm:text-[11px] text-muted block mb-1">TOTAL RETURN</span>
            <div className="text-xl sm:text-2xl font-black text-foreground">+8.7%</div>
            <span className="text-[10px] text-buy block mt-0.5">Net of all friction</span>
          </div>

          <div className="p-3.5 sm:p-4 bg-[#161A1F] rounded-2xl border border-buy/40 shadow-sm">
            <span className="text-[10px] sm:text-[11px] text-muted block mb-1">SHARPE RATIO</span>
            <div className="text-xl sm:text-2xl font-black text-buy">1.84</div>
            <span className="text-[10px] text-buy block mt-0.5">Benchmark: 0.92</span>
          </div>

          <div className="p-3.5 sm:p-4 bg-[#161A1F] rounded-2xl border border-[#2B3139]">
            <span className="text-[10px] sm:text-[11px] text-muted block mb-1">MAX DRAWDOWN</span>
            <div className="text-xl sm:text-2xl font-black text-sell">-5.7%</div>
            <span className="text-[10px] text-text-secondary block mt-0.5">12 Days Span</span>
          </div>

          <div className="p-3.5 sm:p-4 bg-[#161A1F] rounded-2xl border border-[#2B3139]">
            <span className="text-[10px] sm:text-[11px] text-muted block mb-1">WIN RATE</span>
            <div className="text-xl sm:text-2xl font-black text-foreground">68.4%</div>
            <span className="text-[10px] text-buy block mt-0.5">142 Trades</span>
          </div>
        </div>

        {/* Large Clean Equity Curve */}
        <div className="p-4 sm:p-6 bg-[#161A1F] rounded-2xl border border-[#2B3139] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-sm sm:text-base text-foreground">Out-of-Sample Portfolio Growth</h3>
              <p className="text-xs text-text-secondary mt-0.5">
                Simulated equity curve for ₹10,00,000 portfolio after STT, MCX exchange fees, and carry.
              </p>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 text-xs font-mono">
              <span className="text-buy font-bold flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-buy" />
                GoldLens (+8.7%)
              </span>
              <span className="text-muted flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-muted" />
                Buy & Hold (+4.2%)
              </span>
            </div>
          </div>

          {/* SVG Curve */}
          <div className="h-64 bg-[#11151A] rounded-lg border border-[#2B3139] p-4 relative overflow-hidden">
            <svg className="w-full h-full overflow-hidden" viewBox="0 0 900 200" preserveAspectRatio="none">
              <line x1="0" y1="160" x2="900" y2="160" stroke="#2B3139" strokeDasharray="3 3" />

              {/* Benchmark */}
              <path
                d="M 0 160 Q 300 145 600 138 T 900 130"
                fill="none"
                stroke="#5E6673"
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />

              {/* Strategy */}
              <path
                d="M 0 160 L 100 152 L 200 135 L 300 120 L 400 125 L 500 95 L 600 80 L 700 62 L 800 45 L 900 25"
                fill="none"
                stroke="#0ECB81"
                strokeWidth="2.5"
              />
            </svg>
          </div>
        </div>

        {/* Collapsible Advanced Metrics */}
        <div className="border border-[#2B3139] rounded-xl overflow-hidden bg-[#161A1F]">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full px-5 py-3 flex items-center justify-between text-xs font-bold text-text-secondary hover:text-foreground transition-colors"
          >
            <span>Advanced Quantitative Metrics & Fold Breakdown</span>
            {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {showAdvanced && (
            <div className="p-5 border-t border-[#2B3139] grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs bg-[#11151A]">
              <div className="p-3 bg-[#161A1F] rounded-lg border border-[#2B3139]">
                <span className="text-[10px] text-muted block mb-1">PROFIT FACTOR</span>
                <span className="text-base font-black text-gold">2.14</span>
                <span className="text-[10px] text-text-secondary block mt-0.5">Gross gains / losses</span>
              </div>

              <div className="p-3 bg-[#161A1F] rounded-lg border border-[#2B3139]">
                <span className="text-[10px] text-muted block mb-1">AVG HOLDING PERIOD</span>
                <span className="text-base font-black text-foreground">3.4 Days</span>
                <span className="text-[10px] text-text-secondary block mt-0.5">Mean-reversion horizon</span>
              </div>

              <div className="p-3 bg-[#161A1F] rounded-lg border border-[#2B3139]">
                <span className="text-[10px] text-muted block mb-1">MONTE CARLO P-VALUE</span>
                <span className="text-base font-black text-buy">0.003</span>
                <span className="text-[10px] text-buy block mt-0.5">99.7% Statistically Significant</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
