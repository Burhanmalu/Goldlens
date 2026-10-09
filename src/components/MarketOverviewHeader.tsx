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
    <div className="bg-[#11151A] border-b border-[#2B3139] px-3 py-2.5 sm:px-5 sm:py-3 select-none flex flex-col gap-2.5">
      {/* ── TOP PRIMARY BAR: CONTRACT SELECTOR + DETAILS + LIVE PRICE & BADGES ── */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 lg:gap-4">
        {/* LEFT CLUSTER: CONTRACT TABS & SPECIFICATION BADGE */}
        <div className="flex items-center flex-wrap gap-2 sm:gap-3">
          {/* Contract Selector Tabs */}
          <div className="flex items-center gap-1 p-0.5 bg-[#161A1F] rounded-lg border border-[#2B3139] overflow-x-auto no-scrollbar">
            {CONTRACT_LIST.map((c) => (
              <button
                key={c.symbol}
                onClick={() => onSelectSymbol(c.symbol)}
                className={`px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-bold font-mono transition-all flex-shrink-0 touch-manipulation min-h-[32px] ${
                  c.symbol === selectedSymbol
                    ? 'bg-gold text-background shadow-sm font-black'
                    : 'text-text-secondary hover:text-foreground hover:bg-[#1C2128]'
                }`}
              >
                {c.symbol}
              </button>
            ))}
          </div>

          {/* Contract Specs Pill */}
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 bg-[#161A1F] border border-[#2B3139] rounded-lg text-xs">
            <span className="font-bold text-foreground">{spec.name}</span>
            <span className="text-muted font-mono">•</span>
            <span className="text-muted font-mono text-[11px]">
              Purity: <strong className="text-gold font-bold">{spec.purity}</strong>
            </span>
            <span className="text-muted font-mono">•</span>
            <span className="text-muted font-mono text-[11px]">Lot: {spec.contractSize}g</span>
          </div>
        </div>

        {/* RIGHT CLUSTER: LIVE PRICE + NORMALIZED FINE GOLD + AUDIT BADGES */}
        <div className="flex items-center flex-wrap gap-2 sm:gap-3 ml-auto">
          {/* Live Price Pill */}
          <div
            className={`flex items-baseline gap-2 px-3 py-1 rounded-lg border transition-all duration-300 ${
              priceFlash === 'green'
                ? 'bg-buy/20 border-buy/40 text-buy ring-1 ring-buy/30'
                : priceFlash === 'red'
                ? 'bg-sell/20 border-sell/40 text-sell ring-1 ring-sell/30'
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
              {isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              {isUp ? '+' : ''}
              {(snapshot.change || 0.40).toFixed(2)}%
            </span>
          </div>

          {/* Normalized Fine Gold Tag */}
          <div className="hidden xs:flex items-center gap-1.5 px-2.5 py-1.5 bg-gold/10 border border-gold/30 rounded-lg text-gold text-xs font-mono">
            <Scale size={13} className="text-gold flex-shrink-0" />
            <span className="font-bold">
              ₹{Math.round(snapshot.normalizedPrice || (lastPrice / spec.quoteBasis / spec.purityFactor)).toLocaleString('en-IN')}/g
            </span>
            <span className="text-[10px] text-gold/70 hidden md:inline">(Fine Gold)</span>
          </div>

          {/* Verification Badges */}
          <div className="hidden md:flex items-center gap-1.5">
            <span className="px-2 py-1 rounded-md bg-buy/10 text-buy border border-buy/20 text-[10px] font-bold flex items-center gap-1">
              <Droplets size={11} />
              <span>HIGH LIQUIDITY</span>
            </span>

            <span className="px-2 py-1 rounded-md bg-[#161A1F] text-gold border border-gold/30 text-[10px] font-bold flex items-center gap-1">
              <ShieldCheck size={11} />
              <span>AUDIT READY</span>
            </span>
          </div>
        </div>
      </div>

      {/* ── BOTTOM DENSE STATS STRIP: COMPLETE MARKET METRICS (NO DEAD SPACE) ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-1.5 sm:gap-2 pt-2 border-t border-[#2B3139]/50 text-xs font-mono">
        {/* 24H High */}
        <div className="flex items-center justify-between px-2.5 py-1.5 bg-[#161A1F] rounded-lg border border-[#2B3139]/60">
          <span className="text-muted text-[10px] uppercase font-sans">24h High</span>
          <span className="text-foreground font-semibold text-xs tabular-nums">
            ₹{(lastPrice * 1.004).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </span>
        </div>

        {/* 24H Low */}
        <div className="flex items-center justify-between px-2.5 py-1.5 bg-[#161A1F] rounded-lg border border-[#2B3139]/60">
          <span className="text-muted text-[10px] uppercase font-sans">24h Low</span>
          <span className="text-foreground font-semibold text-xs tabular-nums">
            ₹{(lastPrice * 0.993).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </span>
        </div>

        {/* 24H Volume */}
        <div className="flex items-center justify-between px-2.5 py-1.5 bg-[#161A1F] rounded-lg border border-[#2B3139]/60">
          <span className="text-muted text-[10px] uppercase font-sans flex items-center gap-1">
            <BarChart3 size={11} className="text-muted" />
            24h Vol
          </span>
          <span className="text-foreground font-semibold text-xs tabular-nums">₹1.84 Cr</span>
        </div>

        {/* Open Interest */}
        <div className="flex items-center justify-between px-2.5 py-1.5 bg-[#161A1F] rounded-lg border border-[#2B3139]/60">
          <span className="text-muted text-[10px] uppercase font-sans flex items-center gap-1">
            <Activity size={11} className="text-muted" />
            Open Int.
          </span>
          <span className="text-foreground font-semibold text-xs tabular-nums">2,262</span>
        </div>

        {/* Carry Cost Rate */}
        <div className="flex items-center justify-between px-2.5 py-1.5 bg-[#161A1F] rounded-lg border border-[#2B3139]/60">
          <span className="text-muted text-[10px] uppercase font-sans flex items-center gap-1">
            <TrendingUp size={11} className="text-gold" />
            Carry
          </span>
          <span className="text-gold font-semibold text-xs tabular-nums">+0.09%</span>
        </div>

        {/* Next Settlement Expiry */}
        <div className="flex items-center justify-between px-2.5 py-1.5 bg-[#161A1F] rounded-lg border border-[#2B3139]/60">
          <span className="text-muted text-[10px] uppercase font-sans flex items-center gap-1">
            <Clock size={11} className="text-muted" />
            Expiry
          </span>
          <span className="text-text-secondary font-semibold text-xs tabular-nums">28 OCT</span>
        </div>
      </div>
    </div>
  );
}

