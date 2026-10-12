'use client';

import React, { useState } from 'react';
import {
  SETTLEMENT_CONTRACTS,
  BENCHMARK_FINE_GOLD_PER_G,
  MCX_SETTLEMENT_DATE,
} from '@/lib/singleSourceOfTruth';
import { PageId } from '@/lib/types';
import {
  Calculator,
  ShieldCheck,
  RefreshCw,
  MinusCircle,
  HelpCircle,
  ArrowRight
} from 'lucide-react';

interface PlaybooksViewProps {
  onNavigate: (page: PageId) => void;
}

export function PlaybooksView({ onNavigate }: PlaybooksViewProps) {
  // Calculator state: user enters grams of exposure needed
  const [targetGrams, setTargetGrams] = useState<number>(200);

  // Compute contract sizing for target grams
  const contracts = SETTLEMENT_CONTRACTS;

  return (
    <div className="max-w-5xl mx-auto space-y-6 font-sans text-[#EAECEF] pb-12 select-none">
      
      {/* ── HEADER ── */}
      <div className="p-5 bg-[#11151A] rounded-2xl border border-[#2B3139]">
        <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
          Decision Playbooks
        </h1>
        <p className="text-xs text-[#848E9C] mt-1">
          Repeatable, objective strategies with stated assumptions for jewellers, hedgers, and spread analysts.
        </p>
      </div>

      {/* ── PLAYBOOK 1: CHEAPEST WAY TO GET GOLD EXPOSURE (CALCULATOR) ── */}
      <div className="p-6 rounded-2xl bg-[#11151A] border border-gold/30 space-y-5">
        <div className="flex items-center justify-between border-b border-[#2B3139] pb-3">
          <div className="flex items-center gap-2">
            <Calculator size={18} className="text-gold" />
            <h2 className="text-base font-bold text-foreground">
              Playbook 1: Cheapest Gold Exposure Chooser
            </h2>
          </div>
          <span className="text-[11px] font-mono text-muted">Hedging & Physical Equivalent</span>
        </div>

        <p className="text-xs text-[#848E9C] leading-relaxed">
          For physical jewellers or investors seeking N grams of gold exposure. Avoid lot rounding mismatch and pick the lowest effective cost contract.
        </p>

        {/* Input grams */}
        <div className="flex flex-wrap items-center gap-4 p-3 bg-[#0C0F14] rounded-xl border border-[#1E2530]">
          <label className="text-xs font-mono text-muted">
            Target Exposure (Grams):
          </label>
          <input
            type="number"
            min={1}
            max={10000}
            step={1}
            value={targetGrams}
            onChange={(e) => setTargetGrams(Math.max(1, Number(e.target.value) || 1))}
            className="w-32 bg-[#161A20] border border-[#2B3139] rounded-lg px-3 py-1.5 text-sm font-mono font-bold text-gold focus:outline-none focus:border-gold"
          />
          <span className="text-xs text-muted font-mono">
            Approx Value: ₹{((targetGrams * BENCHMARK_FINE_GOLD_PER_G) / 1e5).toFixed(2)} Lakh
          </span>
        </div>

        {/* Breakdown table for target grams */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
          {contracts.map((c) => {
            const lotsNeeded = Math.floor(targetGrams / c.lotGrams);
            const coveredGrams = lotsNeeded * c.lotGrams;
            const unmatchedGrams = targetGrams - coveredGrams;
            const notionalLakh = (coveredGrams * c.pricePerGramFine) / 1e5;
            const isBest = c.symbol === 'GOLDTEN';

            return (
              <div
                key={c.symbol}
                className={`p-3.5 rounded-xl border transition-all ${
                  isBest
                    ? 'bg-[#151A22] border-gold/40 shadow-sm'
                    : 'bg-[#0C0F14] border-[#1E2530]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-foreground text-sm font-sans">{c.symbol}</span>
                  {isBest && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-gold/15 text-gold border border-gold/30 font-bold">
                      LOWEST ₹/G
                    </span>
                  )}
                </div>

                <div className="space-y-1.5 text-[11px] text-[#848E9C]">
                  <div className="flex justify-between">
                    <span>Lots Required:</span>
                    <strong className="text-foreground">{lotsNeeded} lots</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Covered:</span>
                    <span className="text-foreground">{coveredGrams} g</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Unmatched:</span>
                    <span className={unmatchedGrams > 0 ? 'text-amber-400 font-bold' : 'text-buy'}>
                      {unmatchedGrams} g
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-[#1E2530] pt-1">
                    <span>Effective ₹/g:</span>
                    <strong className="text-foreground">₹{c.pricePerGramFine.toFixed(1)}</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── PLAYBOOK 2: CROSS-CONTRACT SPREAD DISLOCATION (MARKET NEUTRAL) ── */}
      <div className="p-6 rounded-2xl bg-[#11151A] border border-[#2B3139] space-y-4">
        <div className="flex items-center justify-between border-b border-[#2B3139] pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-buy" />
            <h2 className="text-base font-bold text-foreground">
              Playbook 2: Cross-Contract Market-Neutral Gap
            </h2>
          </div>
          <span className="text-[11px] font-mono text-muted">Gate-Conditioned Execution</span>
        </div>

        <div className="p-3 bg-[#0C0F14] rounded-xl border border-[#1E2530] text-xs font-mono space-y-1">
          <div className="text-gold font-bold">Signal Gate Rule:</div>
          <p className="text-muted leading-relaxed">
            Enter ONLY when: |Residual| &gt; k × CostBand(pair) AND Liquidity tier acceptable AND |Z| &gt; 2.0 AND inside lifecycle window.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans text-[#848E9C]">
          <div className="p-3 bg-[#0C0F14] rounded-xl border border-[#1E2530] space-y-1">
            <strong className="text-foreground block">Integer Lot Gram-Matching Example</strong>
            <p className="text-[11px] font-mono">
              Target: 200 grams<br />
              Leg 1: BUY 20 GOLDTEN (20 × 10g = 200g)<br />
              Leg 2: SELL 2 GOLDM (2 × 100g = 200g)<br />
              Net Gold Exposure: 0 grams (market neutral)
            </p>
          </div>

          <div className="p-3 bg-[#0C0F14] rounded-xl border border-[#1E2530] space-y-1">
            <strong className="text-foreground block">Strict Exit Criteria</strong>
            <p className="text-[11px]">
              1. Convergence to fair carry spread.<br />
              2. Stop-loss: 0.30% divergence.<br />
              3. Hard exit: 3 days prior to tender start.
            </p>
          </div>
        </div>
      </div>

      {/* ── PLAYBOOK 3: ROLL PLANNER & STAY OUT ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-[#11151A] border border-[#2B3139] space-y-2">
          <div className="flex items-center gap-2 text-foreground font-bold text-sm">
            <RefreshCw size={16} className="text-gold" />
            <span>Playbook 3: Contract Roll Planner</span>
          </div>
          <p className="text-xs text-[#848E9C] leading-relaxed">
            Roll from expiring near-month to next-month contract when liquidity moves across the 50% OI threshold, strictly before the 5-day staggered tender period starts.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#11151A] border border-[#2B3139] space-y-2">
          <div className="flex items-center gap-2 text-foreground font-bold text-sm">
            <MinusCircle size={16} className="text-muted" />
            <span>Playbook 4: Stay Out (No-Trade Days)</span>
          </div>
          <p className="text-xs text-[#848E9C] leading-relaxed">
            When residual gap does not clear transaction costs, staying out is the highest positive-expectation action. Value equals losses avoided from churn and exchange friction.
          </p>
        </div>
      </div>

    </div>
  );
}
