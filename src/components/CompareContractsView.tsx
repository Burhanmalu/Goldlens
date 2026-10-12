'use client';

import React from 'react';
import {
  SETTLEMENT_CONTRACTS,
  BENCHMARK_FINE_GOLD_PER_G,
  MCX_SETTLEMENT_DATE,
  SOURCE_FILE_HASH,
} from '@/lib/singleSourceOfTruth';
import { PageId } from '@/lib/types';
import { ArrowRight, Info, AlertTriangle, Layers, Calendar, CheckCircle2 } from 'lucide-react';

interface CompareContractsViewProps {
  onNavigate: (page: PageId) => void;
}

export function CompareContractsView({ onNavigate }: CompareContractsViewProps) {
  const contracts = SETTLEMENT_CONTRACTS;

  return (
    <div className="max-w-5xl mx-auto space-y-6 font-sans text-[#EAECEF] pb-12 select-none">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 bg-[#11151A] rounded-2xl border border-[#2B3139]">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
            Cross-Contract Fine Gold Normalization
          </h1>
          <p className="text-xs text-[#848E9C] mt-0.5">
            Four contracts, different lot sizes and purities, normalized to 1 gram of 24K pure gold.
          </p>
        </div>

        <div className="text-xs font-mono text-muted text-left sm:text-right">
          <span>Settlement: <strong className="text-foreground">{MCX_SETTLEMENT_DATE}</strong></span>
          <span className="block text-[11px] text-[#848E9C]">Benchmark: ₹{BENCHMARK_FINE_GOLD_PER_G.toFixed(2)}/g (GOLDM)</span>
        </div>
      </div>

      {/* ── TABLE: CONTRACT COMPARISON ── */}
      <div className="bg-[#11151A] rounded-2xl border border-[#2B3139] overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="bg-[#0C0F14] border-b border-[#2B3139] text-[#848E9C] text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4 font-bold">Contract</th>
                <th className="py-3 px-4 font-bold">Expiry Date</th>
                <th className="py-3 px-4 font-bold text-right">MCX Close</th>
                <th className="py-3 px-4 font-bold text-right">Rs / Gram (Fine)</th>
                <th className="py-3 px-4 font-bold text-right">Vs Benchmark</th>
                <th className="py-3 px-4 font-bold text-center">Liquidity Tier</th>
                <th className="py-3 px-4 font-bold text-right">Turnover</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2530]">
              {contracts.map((c) => {
                const isBenchmark = c.diffVsBenchmarkPct === 0;
                return (
                  <tr key={c.symbol} className="hover:bg-[#161A20] transition-colors">
                    <td className="py-3.5 px-4 font-sans">
                      <div className="font-bold text-foreground text-sm flex items-center gap-1.5">
                        <span>{c.symbol}</span>
                        {c.listingNote && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 font-mono">
                            2025 LISTING
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-muted">
                        Lot: {c.lotGrams}g • Quote / {c.quoteBasisGrams}g • {c.purity * 1000} Fine
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-foreground">
                      <div>{c.expiryDate}</div>
                      <div className="text-[10px] text-muted">{c.daysToExpiry} days to expiry</div>
                    </td>

                    <td className="py-3.5 px-4 text-right font-bold text-foreground">
                      ₹{c.settlementPrice.toLocaleString('en-IN')}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <span className="text-sm font-bold text-foreground">
                        ₹{c.pricePerGramFine.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {isBenchmark ? (
                        <span className="text-muted font-bold">BENCHMARK</span>
                      ) : c.diffVsBenchmarkPct < 0 ? (
                        <span className="text-buy font-bold">
                          {c.diffVsBenchmarkPct.toFixed(2)}% (₹{c.diffVsBenchmarkInr.toFixed(1)}/g cheap)
                        </span>
                      ) : (
                        <span className="text-sell font-bold">
                          +{c.diffVsBenchmarkPct.toFixed(2)}% (+₹{c.diffVsBenchmarkInr.toFixed(1)}/g rich)
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        c.liquidityTier === 'Good'
                          ? 'bg-buy/15 text-buy border border-buy/30'
                          : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      }`}>
                        {c.liquidityTier}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right text-muted">
                      ₹{c.turnoverCr.toFixed(1)} Cr
                      <span className="block text-[10px] text-[#848E9C]">
                        {c.volumeLots.toLocaleString('en-IN')} lots
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── EXPLAINER: WHY CONTRACT PRICES DIFFER ── */}
      <div className="p-5 rounded-2xl bg-[#11151A] border border-[#2B3139] space-y-3 text-xs leading-relaxed text-[#848E9C]">
        <h3 className="font-bold text-foreground text-sm flex items-center gap-1.5">
          <Info size={16} className="text-gold" />
          <span>Why Prices Differ Across MCX Gold Contracts</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          <div className="p-3 bg-[#0C0F14] rounded-xl border border-[#1E2530]">
            <strong className="text-foreground block mb-1">1. Delivery Purity Standard</strong>
            <span>
              GOLDM requires 995 fineness (0.995 gold purity), whereas GOLDTEN, GOLDGUINEA, and GOLDPETAL require 999 fineness (0.999 fine gold). Purity normalization accounts for this 4/1000 difference.
            </span>
          </div>

          <div className="p-3 bg-[#0C0F14] rounded-xl border border-[#1E2530]">
            <strong className="text-foreground block mb-1">2. Calendar Expiry Gap</strong>
            <span>
              GOLDM expires on the 5th of the month, whereas the other three contracts expire on the last business day of the month. A 6-day calendar carrying cost (~0.11% at 6.5% APR) is mechanically built in.
            </span>
          </div>

          <div className="p-3 bg-[#0C0F14] rounded-xl border border-[#1E2530]">
            <strong className="text-foreground block mb-1">3. Lot Friction & Liquidity Drag</strong>
            <span>
              1g GOLDPETAL incurs a much higher percentage brokerage impact per order compared to a 100g GOLDM lot. Apparent gaps often collapse under smaller contract friction.
            </span>
          </div>
        </div>
      </div>

      {/* ── LIFECYCLE STRIP ── */}
      <div className="p-5 rounded-2xl bg-[#11151A] border border-[#2B3139] space-y-3 text-xs font-mono">
        <div className="flex items-center justify-between">
          <span className="font-bold text-foreground flex items-center gap-1.5">
            <Calendar size={15} className="text-gold" />
            <span>Contract Lifecycle & Roll Window Strip</span>
          </span>
          <span className="text-muted text-[11px]">Buffer: 3 Days Prior to Tender</span>
        </div>

        <div className="space-y-2 pt-1 text-[11px]">
          <div className="flex items-center justify-between p-2 rounded-lg bg-[#0C0F14] border border-[#1E2530]">
            <span className="font-bold text-foreground">GOLDM (05 Nov 2026)</span>
            <span className="text-buy">Liquid Peak Window Active (Roll window: 28 Oct – 31 Oct)</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-[#0C0F14] border border-[#1E2530]">
            <span className="font-bold text-foreground">GOLDTEN / GUINEA / PETAL (30 Oct 2026)</span>
            <span className="text-amber-400">Approaching Pre-Expiry Buffer (Tender begins 5 trading days prior)</span>
          </div>
        </div>
      </div>

      {/* ── NAVIGATION CALL TO ACTION ── */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => onNavigate('playbooks')}
          className="px-4 py-2.5 rounded-xl bg-gold hover:bg-gold-hover text-[#07090C] text-xs font-bold transition-all shadow flex items-center gap-1.5 cursor-pointer"
        >
          <span>Open Contract Playbooks</span>
          <ArrowRight size={14} />
        </button>

        <button
          onClick={() => onNavigate('proof')}
          className="text-xs text-muted hover:text-foreground font-mono transition-colors cursor-pointer"
        >
          View Walk-Forward Proof →
        </button>
      </div>

    </div>
  );
}
