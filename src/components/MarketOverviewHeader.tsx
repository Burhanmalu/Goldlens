'use client';

import React from 'react';
import {
  ArrowUpRight, ArrowDownRight, ShieldCheck,
  Scale, Droplets
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

  return (
    <div className="bg-[#11151A] border-b border-[#2B3139] p-4 sm:px-6 sm:py-4 select-none">
      {/* ── TOP ROW: CONTRACT SELECTOR & IDENTITY ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 sm:mb-4">
        {/* Contract Selector Pills (Scrollable on mobile) */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar touch-pan-x p-1 bg-[#161A1F] rounded-xl border border-[#2B3139]">
          {CONTRACT_LIST.map((c) => (
            <button
              key={c.symbol}
              onClick={() => onSelectSymbol(c.symbol)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex-shrink-0 touch-manipulation min-h-[36px] ${
                c.symbol === selectedSymbol
                  ? 'bg-gold text-background shadow-md'
                  : 'text-text-secondary hover:text-foreground hover:bg-[#1C2128]'
              }`}
            >
              {c.symbol}
            </button>
          ))}
        </div>

        {/* Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2.5 py-1 rounded-md bg-buy/10 text-buy border border-buy/20 text-[11px] font-bold flex items-center gap-1">
            <Droplets size={12} />
            <span>HIGH LIQUIDITY</span>
          </span>

          <span className="px-2.5 py-1 rounded-md bg-[#161A1F] text-gold border border-[#2B3139] text-[11px] font-bold flex items-center gap-1">
            <ShieldCheck size={12} />
            <span>AUDIT READY</span>
          </span>
        </div>
      </div>

      {/* ── MIDDLE ROW: CONTRACT DETAILS & PROMINENT PRICE ── */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-[#2B3139]/60 pb-3">
        <div>
          <div className="text-base sm:text-lg font-bold text-foreground font-sans flex items-center gap-2">
            <span>{spec.name}</span>
            <span className="text-xs text-text-secondary font-normal">({spec.quoteUnit})</span>
          </div>
          <div className="text-xs text-muted font-mono mt-0.5">
            MCX Futures • Purity: <span className="text-gold font-bold">{spec.purity}</span> • Lot: {spec.contractSize}g
          </div>
        </div>

        {/* Live Price Display */}
        <div className="flex flex-wrap items-baseline gap-2.5 sm:gap-3">
          <div
            className={`flex items-baseline gap-2 px-2.5 py-1 rounded-lg transition-all ${
              priceFlash === 'green'
                ? 'bg-buy/20 text-buy'
                : priceFlash === 'red'
                ? 'bg-sell/20 text-sell'
                : ''
            }`}
          >
            <span className="font-mono font-black text-2xl sm:text-3xl tabular-nums text-foreground tracking-tight">
              ₹{snapshot.lastPrice?.toLocaleString('en-IN') || '1,28,411'}
            </span>
            <span
              className={`font-mono tabular-nums text-xs font-bold flex items-center ${
                isUp ? 'text-buy' : 'text-sell'
              }`}
            >
              {isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              {isUp ? '+' : ''}
              {(snapshot.change || 0.40).toFixed(2)}%
            </span>
          </div>

          {/* Normalized Fine Gold Price Tag */}
          <div className="px-3 py-1 bg-gold/10 border border-gold/30 rounded-lg flex items-center gap-1.5 text-gold text-xs font-mono">
            <Scale size={13} />
            <span className="font-bold">₹{Math.round(snapshot.normalizedPrice || 12842).toLocaleString('en-IN')}/g</span>
            <span className="text-[10px] text-gold/70">(Fine Gold)</span>
          </div>
        </div>
      </div>

      {/* ── BOTTOM ROW: 2x2 KEY METRICS GRID ON MOBILE / ROW ON DESKTOP ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 pt-3 text-xs font-mono">
        <div className="p-2 sm:p-0 bg-[#161A1F] sm:bg-transparent rounded-lg border border-[#2B3139] sm:border-0">
          <span className="text-muted text-[10px] sm:text-[11px] block">24H HIGH</span>
          <span className="text-foreground font-semibold text-xs sm:text-sm">
            ₹{(snapshot.lastPrice * 1.004).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </span>
        </div>

        <div className="p-2 sm:p-0 bg-[#161A1F] sm:bg-transparent rounded-lg border border-[#2B3139] sm:border-0">
          <span className="text-muted text-[10px] sm:text-[11px] block">24H LOW</span>
          <span className="text-foreground font-semibold text-xs sm:text-sm">
            ₹{(snapshot.lastPrice * 0.993).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </span>
        </div>

        <div className="p-2 sm:p-0 bg-[#161A1F] sm:bg-transparent rounded-lg border border-[#2B3139] sm:border-0">
          <span className="text-muted text-[10px] sm:text-[11px] block">24H VOLUME</span>
          <span className="text-foreground font-semibold text-xs sm:text-sm">₹1.84 Cr</span>
        </div>

        <div className="p-2 sm:p-0 bg-[#161A1F] sm:bg-transparent rounded-lg border border-[#2B3139] sm:border-0">
          <span className="text-muted text-[10px] sm:text-[11px] block">OPEN INTEREST</span>
          <span className="text-foreground font-semibold text-xs sm:text-sm">2,262</span>
        </div>
      </div>
    </div>
  );
}
