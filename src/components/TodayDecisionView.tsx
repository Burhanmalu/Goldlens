'use client';

import React, { useState } from 'react';
import {
  TODAY_DECISION,
  MCX_SETTLEMENT_DATE,
  SOURCE_FILE_HASH,
  CODE_VERSION,
} from '@/lib/singleSourceOfTruth';
import { PageId } from '@/lib/types';
import {
  ShieldAlert,
  ArrowRight,
  TrendingDown,
  Layers,
  HelpCircle,
  Clock,
  Code2,
  FileCheck
} from 'lucide-react';

interface TodayDecisionViewProps {
  onNavigate: (page: PageId) => void;
}

export function TodayDecisionView({ onNavigate }: TodayDecisionViewProps) {
  const [showMathDrawer, setShowMathDrawer] = useState(false);
  const decision = TODAY_DECISION;

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans text-[#EAECEF] pb-12 select-none">
      
      {/* ── METADATA & DATA PROVENANCE HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-[#11151A] rounded-xl border border-[#2B3139] text-xs font-mono text-[#848E9C]">
        <div className="flex items-center gap-2">
          <Clock size={14} className="text-gold" />
          <span>Settlement Data as of: <strong className="text-foreground">{decision.as_of_date}</strong></span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span className="flex items-center gap-1" title="Source Bhavcopy Hash">
            <FileCheck size={12} className="text-buy" />
            <span>{decision.source_file_hash.slice(0, 16)}...</span>
          </span>
          <span className="flex items-center gap-1">
            <Code2 size={12} className="text-muted" />
            <span>{decision.code_version}</span>
          </span>
        </div>
      </div>

      {/* ── HERO DECISION CARD (NO TRADE / HONEST PROMPT) ── */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#161A20] via-[#11151A] to-[#0D1014] border border-[#2B3139] shadow-xl relative overflow-hidden">
        {/* Subtle status indicator glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1C222C] border border-[#303846] text-xs font-mono font-bold text-muted">
            <span className="w-2 h-2 rounded-full bg-muted" />
            <span>TODAY'S VERDICT</span>
          </div>

          <span className="px-3 py-1 rounded-full bg-[#2B3139]/50 text-muted border border-[#3A424D] text-xs font-mono font-bold">
            {decision.verdict.replace('_', ' ')}
          </span>
        </div>

        {/* Big Headline */}
        <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight mb-3">
          {decision.headline}
        </h1>

        <p className="text-sm sm:text-base text-[#848E9C] leading-relaxed max-w-2xl mb-6">
          {decision.subheadline}
        </p>

        {/* 3 Core Facts (at most 5 numbers) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-4 border-t border-[#232932] mb-6">
          <div className="p-3.5 bg-[#0C0F14] rounded-xl border border-[#1E2530]">
            <span className="text-[11px] font-mono text-muted block mb-1">Benchmark Gold (Fine)</span>
            <span className="text-lg font-bold font-mono text-foreground">
              ₹{decision.benchmark_price_per_g.toLocaleString('en-IN', { maximumFractionDigits: 2 })}<span className="text-xs text-muted font-normal"> / g</span>
            </span>
            <span className="text-[10px] text-muted block mt-1">Normalized GOLDM settlement</span>
          </div>

          <div className="p-3.5 bg-[#0C0F14] rounded-xl border border-[#1E2530]">
            <span className="text-[11px] font-mono text-muted block mb-1">Today's Residual Gap</span>
            <span className="text-lg font-bold font-mono text-gold">
              +{decision.todays_biggest_gap_pct}%
            </span>
            <span className="text-[10px] text-muted block mt-1">{decision.pair} after carry</span>
          </div>

          <div className="p-3.5 bg-[#0C0F14] rounded-xl border border-[#1E2530]">
            <span className="text-[11px] font-mono text-muted block mb-1">Transaction Cost Band</span>
            <span className="text-lg font-bold font-mono text-sell">
              {decision.cost_band_pct}%
            </span>
            <span className="text-[10px] text-muted block mt-1">CTT, exchange & slippage</span>
          </div>
        </div>

        {/* Action Row: Show Math Drawer & Compare Contracts */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowMathDrawer(!showMathDrawer)}
            className="px-4 py-2.5 rounded-xl bg-[#1C222C] hover:bg-[#252E3B] text-foreground text-xs font-bold transition-all border border-[#303846] flex items-center gap-1.5 cursor-pointer"
          >
            <HelpCircle size={14} className="text-gold" />
            <span>{showMathDrawer ? 'Hide the Math' : 'Show the Math'}</span>
          </button>

          <button
            onClick={() => onNavigate('compare')}
            className="px-4 py-2.5 rounded-xl bg-gold/10 hover:bg-gold/20 text-gold text-xs font-bold transition-all border border-gold/30 flex items-center gap-1.5 cursor-pointer"
          >
            <Layers size={14} />
            <span>Compare Contracts per Gram</span>
            <ArrowRight size={14} />
          </button>

          <button
            onClick={() => onNavigate('proof')}
            className="px-4 py-2.5 rounded-xl text-muted hover:text-foreground text-xs font-medium transition-colors cursor-pointer"
          >
            View Backtest Proof & Limitations →
          </button>
        </div>
      </div>

      {/* ── EXPANDABLE "SHOW THE MATH" DRAWER ── */}
      {showMathDrawer && (
        <div className="p-5 rounded-2xl bg-[#11151A] border border-gold/30 space-y-4 text-xs font-mono animate-fade-in">
          <div className="flex items-center justify-between border-b border-[#2B3139] pb-3">
            <span className="font-bold text-foreground">Mathematical Normalization & Friction Breakdown</span>
            <span className="text-[11px] text-muted">Pair: {decision.pair}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 text-[#848E9C]">
              <div className="text-foreground font-semibold">1. Normalized Price Formula</div>
              <div className="p-2.5 rounded-lg bg-[#0C0F14] border border-[#232932] text-gold">
                P_fine_per_gram = Settlement / (QuotationUnit_g × Purity)
              </div>
              <p className="text-[11px]">
                GOLDM: ₹1,49,921 / (10g × 0.995) = ₹15,067.44/g<br />
                GOLDTEN: ₹1,50,279 / (10g × 0.999) = ₹15,042.94/g
              </p>
            </div>

            <div className="space-y-2 text-[#848E9C]">
              <div className="text-foreground font-semibold">2. Calendar Expiry Carry Deduction</div>
              <div className="p-2.5 rounded-lg bg-[#0C0F14] border border-[#232932] text-foreground">
                Carry = 6.5% APR × (27d - 21d) / 365 = +0.11%
              </div>
              <p className="text-[11px]">
                Residual = Raw Spread (+0.16%) - Expected Carry (+0.11%) = <strong>+0.05%</strong>
              </p>
            </div>
          </div>

          <div className="p-3 bg-[#0C0F14] rounded-xl border border-[#232932] space-y-1.5">
            <div className="text-foreground font-semibold">3. Why No Edge Survives Today</div>
            <div className="flex items-center justify-between text-muted text-[11px]">
              <span>Round-trip CTT (0.01% on sell side) + Exchange fee + GST + Stamp</span>
              <span className="text-sell font-bold">~0.04%</span>
            </div>
            <div className="flex items-center justify-between text-muted text-[11px]">
              <span>Conservative slippage haircut across both legs</span>
              <span className="text-sell font-bold">~0.05%</span>
            </div>
            <div className="flex items-center justify-between text-foreground text-xs pt-1 border-t border-[#1C222B] font-bold">
              <span>Total hurdle cost to capture</span>
              <span className="text-sell">0.09%</span>
            </div>
            <p className="text-[10px] text-muted pt-1">
              Residual gap of +0.05% does not exceed the 0.09% hurdle. A trade today would mathematically lose money to friction.
            </p>
          </div>
        </div>
      )}

      {/* ── PRODUCT POSITIONING & DISCLAIMER ── */}
      <div className="p-4 rounded-xl bg-[#0D1014] border border-[#1E2530] text-[11px] text-[#848E9C] flex items-start gap-3">
        <ShieldAlert size={16} className="text-gold flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-foreground">Honest Framing:</strong> GoldLens is a settlement-data analytics and decision-support product. It is NOT a live feed, NOT an execution platform, and does NOT promise profit. "No edge survives costs" is an explicitly valid outcome, ensuring traders avoid taking negative-expectation trades.
        </p>
      </div>

    </div>
  );
}
