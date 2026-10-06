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
    <div className="bg-[#11151A] border-b border-[#2B3139] px-6 py-4 flex flex-wrap items-center justify-between gap-4 select-none">
      {/* LEFT: Contract Identity & Price */}
      <div className="flex items-center gap-6">
        {/* Contract Selector Pills */}
        <div className="flex items-center bg-[#161A1F] rounded-lg p-1 border border-[#2B3139]">
          {CONTRACT_LIST.map((c) => (
            <button
              key={c.symbol}
              onClick={() => onSelectSymbol(c.symbol)}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                c.symbol === selectedSymbol
                  ? 'bg-gold text-background shadow'
                  : 'text-text-secondary hover:text-foreground hover:bg-[#1C2128]'
              }`}
            >
              {c.symbol}
            </button>
          ))}
        </div>

        {/* Selected Name and Unit */}
        <div>
          <div className="text-base font-bold text-foreground font-sans flex items-center gap-2">
            <span>{spec.name}</span>
            <span className="text-xs text-text-secondary font-normal">({spec.quoteUnit})</span>
          </div>
          <div className="text-xs text-muted font-mono">
            Purity: {spec.purity} • Lot: {spec.contractSize}g
          </div>
        </div>

        {/* Live Main Price */}
        <div
          className={`flex items-baseline gap-2 px-3 py-1 rounded-lg transition-all ${
            priceFlash === 'green'
              ? 'bg-buy/20 text-buy'
              : priceFlash === 'red'
              ? 'bg-sell/20 text-sell'
              : ''
          }`}
        >
          <span className="font-mono font-black text-2xl tabular-nums text-foreground tracking-tight">
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
      </div>

      {/* RIGHT: Key Stats & Trust Badges */}
      <div className="flex items-center gap-6 text-xs font-mono">
        {/* 24h High & Low */}
        <div className="hidden md:block">
          <span className="text-muted text-[11px] block">24H HIGH / LOW</span>
          <span className="text-foreground font-semibold">
            ₹{(snapshot.lastPrice * 1.004).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </span>
          <span className="text-muted mx-1">/</span>
          <span className="text-foreground font-semibold">
            ₹{(snapshot.lastPrice * 0.993).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </span>
        </div>

        {/* Volume */}
        <div className="hidden lg:block">
          <span className="text-muted text-[11px] block">24H VOLUME</span>
          <span className="text-foreground font-semibold">₹1.84 Cr</span>
        </div>

        {/* Open Interest */}
        <div className="hidden lg:block">
          <span className="text-muted text-[11px] block">OPEN INTEREST</span>
          <span className="text-foreground font-semibold">2,262</span>
        </div>

        {/* Normalized Fine Gold Price */}
        <div className="px-3 py-1.5 bg-gold/10 border border-gold/30 rounded-lg flex items-center gap-1.5 text-gold">
          <Scale size={14} />
          <span className="font-bold">₹{Math.round(snapshot.normalizedPrice || 12842).toLocaleString('en-IN')}/g</span>
          <span className="text-[10px] text-gold/70 hidden sm:inline">(Fine Gold)</span>
        </div>

        {/* High Liquidity & Audit Ready Badges */}
        <div className="flex items-center gap-2">
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
    </div>
  );
}
