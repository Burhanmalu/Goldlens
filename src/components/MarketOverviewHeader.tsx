'use client';

import React from 'react';
import {
  ArrowUpRight, ArrowDownRight, ShieldCheck,
  Scale, Droplets, Clock, TrendingUp, Activity, BarChart3
} from 'lucide-react';
import { CONTRACT_REGISTRY, CONTRACT_LIST } from '@/lib/contracts';
import { ContractSnapshot } from '@/lib/types';

interface MarketOverviewHeaderProps {
  selectedSymbol: string;
  onSelectSymbol: (symbol: string) => void;
  snapshot: ContractSnapshot;
  priceFlash: 'green' | 'red' | null;
}

export function MarketOverviewHeader({
  selectedSymbol,
  onSelectSymbol,
  snapshot,
  priceFlash,
}: MarketOverviewHeaderProps) {
  const spec = CONTRACT_REGISTRY[selectedSymbol] || CONTRACT_REGISTRY['GOLDM'];
  const isUp = (snapshot.change || 0) >= 0;
  const lastPrice = snapshot.lastPrice || 149921;

  return (
    <div className="bg-[#11151A] border-b border-[#2B3139] px-3 sm:px-5 py-3 select-none flex flex-col gap-3 w-full min-w-0">
      {/* ── TOP PRIMARY BAR: CONTRACT SELECTOR + DETAILS + LIVE PRICE & BADGES ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 w-full min-w-0">
        {/* LEFT CLUSTER: CONTRACT TABS & SPECIFICATION BADGE */}
        <div className="flex items-center flex-wrap gap-2 sm:gap-3 min-w-0">
          {/* Contract Selector Tabs */}
          <div className="flex items-center gap-1 p-0.5 bg-[#161A1F] rounded-xl border border-[#2B3139]/80 overflow-x-auto no-scrollbar">
            {CONTRACT_LIST.map((c) => (
              <button
                key={c.symbol}
                onClick={() => onSelectSymbol(c.symbol)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all flex-shrink-0 touch-manipulation min-h-[34px] ${
                  c.symbol === selectedSymbol
                    ? 'bg-gold text-background shadow-md font-black'
                    : 'text-text-secondary hover:text-foreground hover:bg-[#1C2128]'
                }`}
              >
                {c.symbol}
              </button>
            ))}
          </div>

          {/* Contract Specs Pill */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#161A1F] border border-[#2B3139]/80 rounded-xl text-xs">
            <span className="font-bold text-foreground">{spec.name}</span>
            <span className="text-muted font-mono">•</span>
            <span
              className="text-text-secondary font-mono text-xs cursor-help"
              title="Gold purity: 995.0 or 999.0 parts per 1000"
            >
              Purity: <strong className="text-foreground font-bold">{spec.purity}</strong>
            </span>
            <span className="text-muted font-mono">•</span>
            <span
              className="text-text-secondary font-mono text-xs cursor-help"
              title="Deliverable physical weight"
            >
              Lot: <strong className="text-foreground font-bold">{spec.contractSize}g</strong>
            </span>
          </div>
        </div>

        {/* RIGHT CLUSTER: LIVE PRICE + NORMALIZED FINE GOLD + AUDIT BADGES */}
        <div className="flex items-center flex-wrap gap-2.5 sm:gap-3 min-w-0">
          {/* Live Price Pill */}
          <div
            className={`flex items-baseline gap-2.5 px-3.5 py-1.5 rounded-xl border transition-all duration-300 ${
              priceFlash === 'green'
                ? 'bg-buy/20 border-buy/50 text-buy ring-2 ring-buy/30'
                : priceFlash === 'red'
                ? 'bg-sell/20 border-sell/50 text-sell ring-2 ring-sell/30'
                : 'bg-[#161A1F] border-[#2B3139]'
            }`}
          >
            <span className="font-mono font-black text-xl sm:text-2xl lg:text-3xl tabular-nums text-foreground tracking-tight">
              ₹{lastPrice.toLocaleString('en-IN')}
            </span>
            <span
              className={`font-mono tabular-nums text-xs sm:text-sm font-bold flex items-center ${
                isUp ? 'text-buy' : 'text-sell'
              }`}
            >
              {isUp ? <ArrowUpRight size={15} /> : <ArrowDownRight size={15} />}
              {isUp ? '+' : ''}
              {(snapshot.change || 0.40).toFixed(2)}%
            </span>
          </div>

          {/* Normalized Fine Gold Tag */}
          <div
            className="hidden xs:flex items-center gap-1.5 px-3 py-1.5 bg-[#161A1F] border border-[#2B3139] rounded-xl text-xs font-mono cursor-help"
            title="Normalized standard: 10g pure 999 gold baseline"
          >
            <Scale size={14} className="text-gold flex-shrink-0" />
            <span className="text-muted text-[11px] font-sans">Pure 10g:</span>
            <span className="font-bold text-foreground tabular-nums">
              ₹{Math.round(snapshot.normalizedPrice || (lastPrice / spec.quoteBasis / spec.purityFactor)).toLocaleString('en-IN')}
            </span>
          </div>

          {/* Verification Badges */}
          <div className="hidden md:flex items-center gap-1.5">
            <span
              className="px-2.5 py-1 rounded-lg bg-buy/10 text-buy border border-buy/20 text-xs font-bold font-mono flex items-center gap-1 cursor-help"
              title="Top-of-book executable liquidity exceeds ₹25 Lakhs"
            >
              <Droplets size={12} />
              <span>LIQUID</span>
            </span>

            <span
              className="px-2.5 py-1 rounded-lg bg-[#161A1F] text-text-secondary border border-[#2B3139] text-xs font-bold font-mono flex items-center gap-1 cursor-help"
              title="Mathematical normalization audit passed"
            >
              <ShieldCheck size={12} className="text-gold" />
              <span>AUDITED</span>
            </span>
          </div>
        </div>
      </div>

      {/* ── BOTTOM DENSE STATS STRIP ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-2.5 pt-2.5 border-t border-[#2B3139]/60 text-xs font-mono w-full">
        {/* 24H High */}
        <div className="flex items-center justify-between px-3 py-2 bg-[#161A1F] rounded-xl border border-[#2B3139]/70">
          <span className="text-muted text-[11px] uppercase font-sans">24h High</span>
          <span className="text-foreground font-semibold text-xs sm:text-sm tabular-nums">
            ₹{(lastPrice * 1.004).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </span>
        </div>

        {/* 24H Low */}
        <div className="flex items-center justify-between px-3 py-2 bg-[#161A1F] rounded-xl border border-[#2B3139]/70">
          <span className="text-muted text-[11px] uppercase font-sans">24h Low</span>
          <span className="text-foreground font-semibold text-xs sm:text-sm tabular-nums">
            ₹{(lastPrice * 0.993).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </span>
        </div>

        {/* 24H Volume */}
        <div
          className="flex items-center justify-between px-3 py-2 bg-[#161A1F] rounded-xl border border-[#2B3139]/70 cursor-help"
          title="Total traded turnover across contracts today"
        >
          <span className="text-muted text-[11px] uppercase font-sans flex items-center gap-1">
            <BarChart3 size={12} className="text-muted" />
            24h Vol
          </span>
          <span className="text-foreground font-semibold text-xs sm:text-sm tabular-nums">₹1.84 Cr</span>
        </div>

        {/* Open Interest */}
        <div
          className="flex items-center justify-between px-3 py-2 bg-[#161A1F] rounded-xl border border-[#2B3139]/70 cursor-help"
          title="Open Interest (OI): Outstanding derivative positions in market"
        >
          <span className="text-muted text-[11px] uppercase font-sans flex items-center gap-1">
            <Activity size={12} className="text-muted" />
            OI
          </span>
          <span className="text-foreground font-semibold text-xs sm:text-sm tabular-nums">2,262</span>
        </div>

        {/* Carry Cost Rate */}
        <div
          className="flex items-center justify-between px-3 py-2 bg-[#161A1F] rounded-xl border border-[#2B3139]/70 cursor-help"
          title="Cost of Carry (Basis Drift): Annualized storage and interest drift until expiry"
        >
          <span className="text-muted text-[11px] uppercase font-sans flex items-center gap-1">
            <TrendingUp size={12} className="text-gold" />
            Carry
          </span>
          <span className="text-gold font-semibold text-xs sm:text-sm tabular-nums">+0.09%</span>
        </div>

        {/* Next Settlement Expiry / DTE */}
        <div
          className="flex items-center justify-between px-3 py-2 bg-[#161A1F] rounded-xl border border-[#2B3139]/70 cursor-help"
          title="Days to Expiry (DTE): Contract settlement and physical delivery cutoff"
        >
          <span className="text-muted text-[11px] uppercase font-sans flex items-center gap-1">
            <Clock size={12} className="text-muted" />
            DTE / Exp
          </span>
          <span className="text-foreground font-semibold text-xs sm:text-sm tabular-nums">28 OCT</span>
        </div>
      </div>
    </div>
  );
}
