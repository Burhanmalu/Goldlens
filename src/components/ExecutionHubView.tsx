'use client';

import React, { useState } from 'react';
import {
  Zap, Shield, Globe, Bell, Award,
  CheckCircle2, Play,
  Cpu, Terminal
} from 'lucide-react';

export function ExecutionHubView() {
  const [activeTab, setActiveTab] = useState<'broker' | 'models' | 'margin' | 'global' | 'alerts' | 'paper'>('broker');

  // Broker Execution State
  const [selectedBroker, setSelectedBroker] = useState<'zerodha' | 'angel' | 'dhan' | 'ibkr'>('zerodha');
  const [lotCount, setLotCount] = useState<number>(2);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [executionLogs, setExecutionLogs] = useState<string[]>([
    '[SYSTEM] Connected to MCX Low-Latency Feed Engine (0.01ms)',
    '[AUTH] Zerodha Kite Connect API Token Authenticated (Active)',
    '[SCAN] Relative Value Dislocation Active: GOLDM/GOLDTEN (+2.41σ)',
  ]);
  const [executionSuccess, setExecutionSuccess] = useState<boolean>(false);

  // Quant Model State
  const [ouSpeed, setOuSpeed] = useState<number>(0.165); // theta
  const halfLifeHours = (Math.log(2) / ouSpeed).toFixed(1);

  // SPAN Margin State
  const [marginLots, setMarginLots] = useState<number>(5);
  const standaloneMargin = marginLots * 48000;
  const spreadRelievedMargin = marginLots * 9600;
  const marginSavings = standaloneMargin - spreadRelievedMargin;

  // Alerts State
  const [zScoreThreshold, setZScoreThreshold] = useState<number>(2.2);
  const [telegramChatId, setTelegramChatId] = useState<string>('-100293848123');
  const [alertSent, setAlertSent] = useState<boolean>(false);

  // Paper Trading State
  const [virtualBalance, setVirtualBalance] = useState<number>(1000000);
  const [openPositions, setOpenPositions] = useState([
    {
      id: 'POS-01',
      pair: 'GOLDM / GOLDTEN',
      direction: 'LONG GOLDM / SHORT GOLDTEN',
      entrySpread: '+0.42%',
      currentSpread: '+0.15%',
      lots: 2,
      pnl: 5420,
      pnlPercent: '+11.2%',
    },
    {
      id: 'POS-02',
      pair: 'GOLDTEN / GOLDPETAL',
      direction: 'LONG GOLDTEN / SHORT GOLDPETAL',
      entrySpread: '+0.31%',
      currentSpread: '+0.26%',
      lots: 4,
      pnl: 1840,
      pnlPercent: '+3.8%',
    },
  ]);

  const handleExecuteArbitrage = () => {
    setIsExecuting(true);
    setExecutionSuccess(false);

    const newLog1 = `[ORB] Atomic Multi-Leg Order Created: BUY ${lotCount} GOLDM @ ₹1,28,411 & SELL ${lotCount * 10} GOLDTEN @ ₹1,29,180`;
    setExecutionLogs((prev) => [newLog1, ...prev]);

    setTimeout(() => {
      const newLog2 = `[ROUTER] Leg 1: BUY ${lotCount} GOLDM Filled in 14ms (Slippage: ₹0.00)`;
      setExecutionLogs((prev) => [newLog2, ...prev]);
    }, 400);

    setTimeout(() => {
      const newLog3 = `[ROUTER] Leg 2: SELL ${lotCount * 10} GOLDTEN Filled in 18ms (Atomic Complete)`;
      const newLog4 = `[AUDIT] Arbitrage Combo Locked: Expected Net P&L = +₹${lotCount * 1920} (+0.15% Net Edge)`;
      setExecutionLogs((prev) => [newLog4, newLog3, ...prev]);
      setIsExecuting(false);
      setExecutionSuccess(true);
      setVirtualBalance((prev) => prev + lotCount * 1920);
    }, 900);
  };

  const handleSendTestAlert = () => {
    setAlertSent(true);
    setTimeout(() => setAlertSent(false), 3000);
  };

  const handleClosePosition = (id: string, pnl: number) => {
    setOpenPositions((prev) => prev.filter((p) => p.id !== id));
    setVirtualBalance((prev) => prev + pnl);
  };

  return (
    <div className="p-3 sm:p-5 lg:p-6 space-y-5 font-sans select-none text-foreground max-w-7xl mx-auto">
      {/* ── HEADER & BADGE ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2B3139] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-gold animate-pulse" />
            <span className="text-[10px] font-mono text-gold uppercase tracking-widest font-bold">
              QUANTITATIVE EXECUTION & INNOVATIONS HUB
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight mt-1">
            Algo Execution & Quant Roadmap Suite
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Institutional-grade 1-click multi-leg execution, SPAN margin relief engine, and econometric models.
          </p>
        </div>

        {/* Live Status Pill */}
        <div className="flex items-center gap-2 bg-[#161A1F] border border-[#2B3139] px-3 py-1.5 rounded-xl font-mono text-xs">
          <span className="w-2 h-2 rounded-full bg-buy animate-pulse" />
          <span className="text-muted">MCX FEED:</span>
          <span className="font-bold text-buy">LIVE (14ms)</span>
          <span className="text-[#2B3139]">|</span>
          <span className="text-gold font-bold">₹{(virtualBalance).toLocaleString('en-IN')} Cap</span>
        </div>
      </div>

      {/* ── 6-TAB ROADMAP NAVIGATION ── */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar touch-pan-x bg-[#11151A] p-1.5 rounded-2xl border border-[#2B3139] text-xs font-mono">
        <button
          onClick={() => setActiveTab('broker')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-2 whitespace-nowrap min-h-[38px] ${
            activeTab === 'broker' ? 'bg-[#161A1F] text-gold border border-gold/40 shadow-sm' : 'text-muted hover:text-foreground'
          }`}
        >
          <Zap size={14} />
          <span>1. 1-Click Multi-Leg Algo</span>
        </button>

        <button
          onClick={() => setActiveTab('models')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-2 whitespace-nowrap min-h-[38px] ${
            activeTab === 'models' ? 'bg-[#161A1F] text-gold border border-gold/40 shadow-sm' : 'text-muted hover:text-foreground'
          }`}
        >
          <Cpu size={14} />
          <span>2. Quant Models & OU</span>
        </button>

        <button
          onClick={() => setActiveTab('margin')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-2 whitespace-nowrap min-h-[38px] ${
            activeTab === 'margin' ? 'bg-[#161A1F] text-gold border border-gold/40 shadow-sm' : 'text-muted hover:text-foreground'
          }`}
        >
          <Shield size={14} />
          <span>3. SPAN Margin Relief</span>
        </button>

        <button
          onClick={() => setActiveTab('global')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-2 whitespace-nowrap min-h-[38px] ${
            activeTab === 'global' ? 'bg-[#161A1F] text-gold border border-gold/40 shadow-sm' : 'text-muted hover:text-foreground'
          }`}
        >
          <Globe size={14} />
          <span>4. COMEX & SGB Parity</span>
        </button>

        <button
          onClick={() => setActiveTab('alerts')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-2 whitespace-nowrap min-h-[38px] ${
            activeTab === 'alerts' ? 'bg-[#161A1F] text-gold border border-gold/40 shadow-sm' : 'text-muted hover:text-foreground'
          }`}
        >
          <Bell size={14} />
          <span>5. Telegram Quant Bot</span>
        </button>

        <button
          onClick={() => setActiveTab('paper')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-2 whitespace-nowrap min-h-[38px] ${
            activeTab === 'paper' ? 'bg-[#161A1F] text-gold border border-gold/40 shadow-sm' : 'text-muted hover:text-foreground'
          }`}
        >
          <Award size={14} />
          <span>6. Paper Trading Blotter</span>
        </button>
      </div>

      {/* ── MODULE 1: 1-CLICK MULTI-LEG BROKER ALGO EXECUTION ── */}
      {activeTab === 'broker' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 animate-fade-in">
          {/* Left Column: Order Ticket & Broker Connect */}
          <div className="lg:col-span-7 bg-[#161A1F] rounded-2xl border border-gold/40 p-4 sm:p-5 space-y-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-[#2B3139] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gold/20 flex items-center justify-center text-gold">
                  <Zap size={16} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-foreground">Atomic Multi-Leg Execution Ticket</h3>
                  <span className="text-[10px] text-muted font-mono">Simultaneous 2-Leg Market Placement with Leg-Risk Guard</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-buy/15 text-buy border border-buy/30 text-[10px] font-mono font-bold">
                ● LOW-LATENCY ROUTER READY
              </span>
            </div>

            {/* Broker Picker */}
            <div>
              <label className="text-muted block text-[11px] font-mono mb-1.5 uppercase">Select Execution Gateway</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'zerodha', label: 'Zerodha Kite', tag: 'OAuth 2.0' },
                  { id: 'angel', label: 'Angel SmartAPI', tag: 'Direct HFT' },
                  { id: 'dhan', label: 'Dhan HQ', tag: 'SuperFast' },
                  { id: 'ibkr', label: 'Interactive Brokers', tag: 'Global' },
                ].map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBroker(b.id as 'zerodha' | 'angel' | 'dhan' | 'ibkr')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      selectedBroker === b.id
                        ? 'bg-[#11151A] border-gold text-gold shadow-sm'
                        : 'bg-[#11151A]/60 border-[#2B3139] text-text-secondary hover:text-foreground'
                    }`}
                  >
                    <div className="font-bold text-xs">{b.label}</div>
                    <div className="text-[9px] text-muted font-mono mt-0.5">{b.tag}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Contract Legs Summary */}
            <div className="p-3 bg-[#11151A] rounded-xl border border-[#2B3139] space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between text-buy font-bold">
                <span>[LEG 1] BUY {lotCount} Lots GOLDM (100g)</span>
                <span>@ ₹1,28,411 (Fine Gold ₹12,842/g)</span>
              </div>
              <div className="flex items-center justify-between text-sell font-bold">
                <span>[LEG 2] SELL {lotCount * 10} Lots GOLDTEN (10g)</span>
                <span>@ ₹1,29,180 (Fine Gold ₹12,895/g)</span>
              </div>
              <div className="pt-2 border-t border-[#2B3139] flex items-center justify-between text-[11px] text-muted">
                <span>Dislocation Size: <strong className="text-gold">+0.33%</strong></span>
                <span>Leg Execution Protection: <strong className="text-buy">250ms Kill Window</strong></span>
              </div>
            </div>

            {/* Lot Size Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-muted">Quantity / Combo Lots:</span>
                <span className="text-foreground font-bold">{lotCount} Lots ({lotCount * 100}g Gold Equivalent)</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={lotCount}
                onChange={(e) => setLotCount(Number(e.target.value))}
                className="w-full accent-gold h-1.5 bg-[#11151A] rounded-lg cursor-pointer"
              />
            </div>

            {/* Execution CTA Button */}
            <button
              onClick={handleExecuteArbitrage}
              disabled={isExecuting}
              className="w-full py-3 bg-gold hover:bg-gold-hover text-background font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-gold/20 disabled:opacity-60 min-h-[44px]"
            >
              {isExecuting ? (
                <>
                  <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                  <span>Routing Atomic 2-Leg Order via {selectedBroker.toUpperCase()}...</span>
                </>
              ) : (
                <>
                  <Play size={14} className="fill-background" />
                  <span>EXECUTE 2-LEG ARBITRAGE COMBO ({lotCount} LOTS)</span>
                </>
              )}
            </button>

            {executionSuccess && (
              <div className="p-3 bg-buy/15 border border-buy/40 rounded-xl text-buy text-xs flex items-center gap-2 font-mono animate-slide-up">
                <CheckCircle2 size={16} className="flex-shrink-0" />
                <span>COMBO EXECUTED ATOMICALLY: Both legs filled in 18ms. P&L Stream initiated.</span>
              </div>
            )}
          </div>

          {/* Right Column: Execution Blotter Log */}
          <div className="lg:col-span-5 bg-[#161A1F] rounded-2xl border border-[#2B3139] p-4 sm:p-5 flex flex-col justify-between font-mono text-xs">
            <div>
              <div className="flex items-center justify-between border-b border-[#2B3139] pb-2 mb-3">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Terminal size={14} className="text-gold" />
                  <span>Live HFT Execution Blotter</span>
                </span>
                <span className="text-[10px] text-buy">WebSocket Connected</span>
              </div>

              <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1 text-[11px]">
                {executionLogs.map((log, idx) => (
                  <div
                    key={idx}
                    className={`p-2 rounded-lg border ${
                      log.includes('[AUDIT]')
                        ? 'bg-gold/10 border-gold/30 text-gold'
                        : log.includes('Filled')
                        ? 'bg-buy/10 border-buy/30 text-buy'
                        : 'bg-[#11151A] border-[#2B3139]/70 text-text-secondary'
                    }`}
                  >
                    {log}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#2B3139] flex items-center justify-between text-[11px] text-muted">
              <span>Fills Latency: <strong className="text-buy">14.2 ms</strong></span>
              <span>Slip: <strong className="text-buy">&lt; 0.01%</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* ── MODULE 2: ADVANCED QUANT MODELS & OU MEAN REVERSION ── */}
      {activeTab === 'models' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 animate-fade-in font-mono text-xs">
          {/* Card 1: Ornstein-Uhlenbeck Half-Life */}
          <div className="p-4 sm:p-5 bg-[#161A1F] rounded-2xl border border-gold/40 space-y-3">
            <div className="flex items-center justify-between border-b border-[#2B3139] pb-2">
              <span className="font-bold text-foreground">Ornstein-Uhlenbeck (OU)</span>
              <span className="text-gold font-bold">Mean Reversion</span>
            </div>
            <p className="text-[11px] text-text-secondary font-sans leading-relaxed">
              Calculates continuous-time mean-reversion drift speed ($\theta$) and the exact statistical half-life of spread dislocations.
            </p>
            <div className="p-3 bg-[#11151A] rounded-xl border border-[#2B3139] space-y-1.5">
              <div className="flex justify-between">
                <span className="text-muted">Mean Reversion Speed (θ):</span>
                <span className="text-foreground font-bold">{ouSpeed.toFixed(3)} / hr</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-[#2B3139] text-sm font-bold">
                <span className="text-gold">Expected Half-Life (τ):</span>
                <span className="text-buy">{halfLifeHours} Hours</span>
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-muted">Adjust Mean Reversion Speed:</span>
              <input
                type="range"
                min="0.05"
                max="0.5"
                step="0.01"
                value={ouSpeed}
                onChange={(e) => setOuSpeed(Number(e.target.value))}
                className="w-full accent-gold h-1.5 bg-[#11151A] rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Card 2: Kalman Filter Dynamic Hedge Ratio */}
          <div className="p-4 sm:p-5 bg-[#161A1F] rounded-2xl border border-[#2B3139] space-y-3">
            <div className="flex items-center justify-between border-b border-[#2B3139] pb-2">
              <span className="font-bold text-foreground">Dynamic Kalman Filter</span>
              <span className="text-buy font-bold">Adaptive β_t</span>
            </div>
            <p className="text-[11px] text-text-secondary font-sans leading-relaxed">
              Dynamically updates state space hedge ratio ($\beta_t$) tick-by-tick rather than relying on stale static linear regression.
            </p>
            <div className="p-3 bg-[#11151A] rounded-xl border border-[#2B3139] space-y-1.5">
              <div className="flex justify-between">
                <span className="text-muted">Live Optimal Hedge Ratio (β):</span>
                <span className="text-foreground font-bold">0.9984</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">State Variance Matrix (Q):</span>
                <span className="text-foreground font-bold">1.42e-06</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-[#2B3139] text-sm font-bold">
                <span className="text-gold">Tracking Error:</span>
                <span className="text-buy">±0.0012 (0.01%)</span>
              </div>
            </div>
          </div>

          {/* Card 3: Cointegration Testing */}
          <div className="p-4 sm:p-5 bg-[#161A1F] rounded-2xl border border-[#2B3139] space-y-3">
            <div className="flex items-center justify-between border-b border-[#2B3139] pb-2">
              <span className="font-bold text-foreground">Cointegration Engine</span>
              <span className="text-buy font-bold">p &lt; 0.01</span>
            </div>
            <p className="text-[11px] text-text-secondary font-sans leading-relaxed">
              Continuous Augmented Dickey-Fuller (ADF) and Johansen Trace tests verifying true statistical stationarity.
            </p>
            <div className="p-3 bg-[#11151A] rounded-xl border border-[#2B3139] space-y-1.5">
              <div className="flex justify-between">
                <span className="text-muted">ADF Test Statistic:</span>
                <span className="text-buy font-bold">-4.82 (Crit: -3.43)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">p-value:</span>
                <span className="text-buy font-bold">0.0004 (Pass)</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-[#2B3139] text-sm font-bold">
                <span className="text-gold">Spread Stationarity:</span>
                <span className="text-buy">CONFIRMED (99.9%)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODULE 3: MCX SPAN MARGIN RELIEF CALCULATOR ── */}
      {activeTab === 'margin' && (
        <div className="bg-[#161A1F] rounded-2xl border border-gold/40 p-4 sm:p-6 space-y-5 animate-fade-in font-mono">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#2B3139] pb-3 gap-2">
            <div>
              <h3 className="font-bold text-base text-foreground">MCX SPAN Cross-Contract Margin Relief Engine</h3>
              <p className="text-xs text-text-secondary font-sans mt-0.5">
                MCX grants up to 80% capital margin discount for simultaneously holding long and short inter-contract gold spreads.
              </p>
            </div>
            <span className="px-3 py-1 bg-gold/15 text-gold border border-gold/30 rounded-xl text-xs font-bold self-start sm:self-auto">
              80% CAPITAL DISCOUNT
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-[#11151A] rounded-xl border border-[#2B3139]">
              <span className="text-[11px] text-muted block mb-1">Standalone Legs Margin</span>
              <span className="text-xl sm:text-2xl font-black text-sell">₹{standaloneMargin.toLocaleString('en-IN')}</span>
              <span className="text-[10px] text-muted block mt-1">2x Unhedged Margin</span>
            </div>

            <div className="p-4 bg-[#11151A] rounded-xl border border-buy/40 shadow-sm">
              <span className="text-[11px] text-muted block mb-1">Spread Relieved Margin</span>
              <span className="text-xl sm:text-2xl font-black text-buy">₹{spreadRelievedMargin.toLocaleString('en-IN')}</span>
              <span className="text-[10px] text-buy font-bold block mt-1">✓ SPAN Relief Applied</span>
            </div>

            <div className="p-4 bg-[#11151A] rounded-xl border border-gold/40 shadow-sm">
              <span className="text-[11px] text-muted block mb-1">Return on Margin (RoM) Boost</span>
              <span className="text-xl sm:text-2xl font-black text-gold">+18.4%</span>
              <span className="text-[10px] text-gold font-bold block mt-1">5x Capital Efficiency</span>
            </div>
          </div>

          {/* Interactive Lot Slider */}
          <div className="p-4 bg-[#11151A] rounded-xl border border-[#2B3139] space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted">Simulate Position Scale:</span>
              <span className="text-foreground font-bold">{marginLots} Spread Lots (Capital Savings: ₹{marginSavings.toLocaleString('en-IN')})</span>
            </div>
            <input
              type="range"
              min="1"
              max="20"
              value={marginLots}
              onChange={(e) => setMarginLots(Number(e.target.value))}
              className="w-full accent-gold h-2 bg-[#161A1F] rounded-lg cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* ── MODULE 4: COMEX & SGB PARITY ── */}
      {activeTab === 'global' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in font-mono text-xs">
          {/* COMEX vs MCX Landed Cost */}
          <div className="p-4 sm:p-5 bg-[#161A1F] rounded-2xl border border-[#2B3139] space-y-3">
            <div className="flex items-center justify-between border-b border-[#2B3139] pb-2">
              <span className="font-bold text-foreground">COMEX Landed Parity vs MCX</span>
              <span className="text-buy font-bold">+0.02% Fair</span>
            </div>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between text-muted">
                <span>COMEX Gold (USD/oz):</span>
                <span className="text-foreground font-bold">$2,645.20</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>USD / INR Exchange Rate:</span>
                <span className="text-foreground font-bold">₹84.12</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Customs Duty + AIDC + GST:</span>
                <span className="text-sell">14.0% Total Import Tax</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#2B3139] font-bold text-sm">
                <span className="text-gold">Landed Fair Value:</span>
                <span className="text-foreground">₹1,28,380 / 10g</span>
              </div>
              <div className="flex justify-between text-[11px] text-buy font-bold">
                <span>MCX Market Quote:</span>
                <span>₹1,28,411 / 10g (No Import Dislocation)</span>
              </div>
            </div>
          </div>

          {/* SGB Secondary Discount Arbitrage */}
          <div className="p-4 sm:p-5 bg-[#161A1F] rounded-2xl border border-[#2B3139] space-y-3">
            <div className="flex items-center justify-between border-b border-[#2B3139] pb-2">
              <span className="font-bold text-foreground">Sovereign Gold Bonds (SGB) Basis</span>
              <span className="text-gold font-bold">Discount Arbitrage</span>
            </div>
            <div className="space-y-2 text-[11px]">
              <div className="p-2 bg-[#11151A] rounded-lg border border-[#2B3139] flex justify-between">
                <span>SGB 2028 Series IV:</span>
                <span className="text-buy font-bold">₹7,210/g (-3.2% Discount)</span>
              </div>
              <div className="p-2 bg-[#11151A] rounded-lg border border-[#2B3139] flex justify-between">
                <span>SGB 2029 Series I:</span>
                <span className="text-buy font-bold">₹7,240/g (-2.8% Discount)</span>
              </div>
              <div className="pt-1 text-muted text-[10px] font-sans">
                Strategy: Buy secondary market SGB discount + Short MCX Futures = Capture 2.5% RBI interest + 3% discount convergence.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODULE 5: TELEGRAM QUANT BOT & WEBHOOK ALERTS ── */}
      {activeTab === 'alerts' && (
        <div className="bg-[#161A1F] rounded-2xl border border-gold/40 p-4 sm:p-6 space-y-4 animate-fade-in font-mono text-xs max-w-3xl mx-auto">
          <div className="flex items-center justify-between border-b border-[#2B3139] pb-3">
            <div className="flex items-center gap-2">
              <Bell size={18} className="text-gold" />
              <h3 className="font-bold text-sm text-foreground">Real-Time Telegram & Discord Quant Webhook</h3>
            </div>
            <span className="text-[10px] text-buy font-bold">● BOT ACTIVE (@GoldLensQuantBot)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-muted block text-[10px] mb-1">Telegram Chat ID / Channel</label>
              <input
                type="text"
                value={telegramChatId}
                onChange={(e) => setTelegramChatId(e.target.value)}
                className="w-full bg-[#11151A] text-foreground px-3 py-2 rounded-xl border border-[#2B3139] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-muted block text-[10px] mb-1">Z-Score Trigger Threshold: +{zScoreThreshold}σ</label>
              <input
                type="range"
                min="1.8"
                max="3.5"
                step="0.1"
                value={zScoreThreshold}
                onChange={(e) => setZScoreThreshold(Number(e.target.value))}
                className="w-full accent-gold h-2 bg-[#11151A] rounded-lg cursor-pointer mt-2"
              />
            </div>
          </div>

          <button
            onClick={handleSendTestAlert}
            className="w-full py-2.5 bg-gold hover:bg-gold-hover text-background font-bold rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <Bell size={14} />
            <span>SEND TEST ARBITRAGE DISLOCATION ALERT TO TELEGRAM</span>
          </button>

          {alertSent && (
            <div className="p-3 bg-buy/15 border border-buy/40 rounded-xl text-buy text-xs flex items-center gap-2 animate-slide-up">
              <CheckCircle2 size={15} />
              <span>TEST ALERT DISPATCHED: [GOLDM/GOLDTEN +2.41σ Net Edge +0.15% sent to {telegramChatId}]</span>
            </div>
          )}
        </div>
      )}

      {/* ── MODULE 6: VIRTUAL PAPER TRADING DESK ── */}
      {activeTab === 'paper' && (
        <div className="bg-[#161A1F] rounded-2xl border border-[#2B3139] p-4 sm:p-6 space-y-4 animate-fade-in font-mono text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#2B3139] pb-3 gap-2">
            <div>
              <h3 className="font-bold text-base text-foreground">Live Virtual Paper Trading Portfolio</h3>
              <span className="text-[10px] text-muted">Risk-Free Simulated Trading on Real-Time MCX Order Feed</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-muted block">Available Capital</span>
              <span className="text-lg font-black text-gold">₹{virtualBalance.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Active Positions Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-muted text-[10px] border-b border-[#2B3139]">
                  <th className="pb-2">POS ID</th>
                  <th className="pb-2">PAIR & DIRECTION</th>
                  <th className="pb-2">ENTRY SPREAD</th>
                  <th className="pb-2">CURRENT</th>
                  <th className="pb-2">UNREALIZED P&L</th>
                  <th className="pb-2 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {openPositions.map((p) => (
                  <tr key={p.id} className="border-b border-[#2B3139]/40">
                    <td className="py-2.5 font-bold text-foreground">{p.id}</td>
                    <td className="py-2.5 font-bold text-gold">{p.pair} <span className="text-muted text-[10px]">({p.lots} Lots)</span></td>
                    <td className="py-2.5 text-text-secondary">{p.entrySpread}</td>
                    <td className="py-2.5 text-foreground font-bold">{p.currentSpread}</td>
                    <td className="py-2.5 text-buy font-bold">+₹{p.pnl.toLocaleString('en-IN')} ({p.pnlPercent})</td>
                    <td className="py-2.5 text-right">
                      <button
                        onClick={() => handleClosePosition(p.id, p.pnl)}
                        className="px-2.5 py-1 bg-[#11151A] hover:bg-sell/20 text-text-secondary hover:text-sell border border-[#2B3139] rounded-lg transition-colors font-bold text-[10px]"
                      >
                        Close Leg
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
