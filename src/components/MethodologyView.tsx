'use client';

import React from 'react';
import { PageId } from '@/lib/types';
import { BookOpen, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, Terminal } from 'lucide-react';

interface MethodologyViewProps {
  onNavigate: (page: PageId) => void;
}

export function MethodologyView({ onNavigate }: MethodologyViewProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans text-[#EAECEF] pb-12 select-none">
      
      {/* ── HEADER ── */}
      <div className="p-5 bg-[#11151A] rounded-2xl border border-[#2B3139]">
        <div className="flex items-center gap-2 mb-1">
          <BookOpen size={20} className="text-gold" />
          <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
            Methodology, Reproducibility & Limitations
          </h1>
        </div>
        <p className="text-xs text-[#848E9C]">
          Complete technical formulas, validation protocols, regulatory guardrails, and threats to validity.
        </p>
      </div>

      {/* ── 1. PIPELINE & ONE SOURCE OF TRUTH ── */}
      <div className="p-5 rounded-2xl bg-[#11151A] border border-[#2B3139] space-y-3 text-xs leading-relaxed text-[#848E9C]">
        <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
          <span>1. The Single Direction Pipeline</span>
        </h2>
        <p>
          Every metric displayed in GoldLens is computed along a single immutable pipeline. No component simulates or hardcodes its own values:
        </p>
        <div className="p-3 bg-[#0C0F14] rounded-xl border border-[#1E2530] font-mono text-[11px] text-gold">
          MCX Bhavcopy (EOD Settlement) → Clean Tables → Contract Registry → Normalized Fine Gold (₹/g) → Expiry-Matched Spreads → Cost & Friction Deduction → Walk-Forward Out-of-Sample Verdicts
        </div>
      </div>

      {/* ── 2. CORE MATHEMATICAL FORMULAS ── */}
      <div className="p-5 rounded-2xl bg-[#11151A] border border-[#2B3139] space-y-3 text-xs font-mono text-[#848E9C]">
        <h2 className="text-sm font-bold text-foreground font-sans">
          2. Official Formulations
        </h2>

        <div className="space-y-2">
          <div className="p-3 bg-[#0C0F14] rounded-xl border border-[#1E2530]">
            <strong className="text-foreground block mb-1">Normalization to Pure 24K Gold:</strong>
            <code>P_fine_per_gram = Close / (QuoteBasis_g × PurityFactor)</code>
            <p className="text-[10px] text-muted mt-1">
              Example GOLDM: ₹1,49,921 / (10 × 0.995) = ₹15,067.44/g
            </p>
          </div>

          <div className="p-3 bg-[#0C0F14] rounded-xl border border-[#1E2530]">
            <strong className="text-foreground block mb-1">Expiry Carry Deduction:</strong>
            <code>Carry(A, B) = c × (Expiry_A - Expiry_B in days) / 365</code>
            <p className="text-[10px] text-muted mt-1">
              Where c is the annualized benchmark carry rate (6.5% baseline).
            </p>
          </div>

          <div className="p-3 bg-[#0C0F14] rounded-xl border border-[#1E2530]">
            <strong className="text-foreground block mb-1">Residual Dislocation:</strong>
            <code>Residual = ln(P_A) - ln(P_B) - Carry(A, B)</code>
          </div>

          <div className="p-3 bg-[#0C0F14] rounded-xl border border-[#1E2530]">
            <strong className="text-foreground block mb-1">Turnover Definition:</strong>
            <code>Turnover (₹) = Volume_lots × Lot_grams × Settlement_Price_per_gram</code>
          </div>
        </div>
      </div>

      {/* ── 3. TRANSACTION COST MODEL (CTT & FRICTION) ── */}
      <div className="p-5 rounded-2xl bg-[#11151A] border border-[#2B3139] space-y-3 text-xs leading-relaxed text-[#848E9C]">
        <h2 className="text-sm font-bold text-foreground">
          3. Indian Commodity Derivatives Friction Model
        </h2>
        <ul className="list-disc pl-5 space-y-1.5 text-[11px]">
          <li><strong>CTT (Commodities Transaction Tax):</strong> Charged at 0.01% on the sell side of commodity futures (not STT).</li>
          <li><strong>Exchange Transaction Fee:</strong> MCX standard turnover fee (~0.0021%).</li>
          <li><strong>SEBI Turnover Charges & Stamp Duty:</strong> Regulatory turnover levies (~0.0001% + 0.002%).</li>
          <li><strong>GST on Services:</strong> 18% applied to brokerage and exchange charges.</li>
          <li><strong>Per-Order Brokerage Drag:</strong> Flat ₹20/order creates disproportionate friction on small 1g GOLDPETAL lots vs 100g GOLDM.</li>
          <li><strong>Slippage Haircut:</strong> Modeled from daily range (High-Low)/Close scaled by liquidity tiers.</li>
        </ul>
      </div>

      {/* ── 4. THREATS TO VALIDITY & LIMITATIONS ── */}
      <div className="p-5 rounded-2xl bg-[#11151A] border border-amber-500/30 space-y-3 text-xs text-[#848E9C]">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
          <AlertTriangle size={16} />
          <span>Explicit Threats to Validity & Limitations</span>
        </div>
        <ol className="list-decimal pl-5 space-y-1.5 text-[11px] leading-relaxed">
          <li><strong>Settlement is not a fill:</strong> End-of-day MCX settlement prices reflect weighted closing trades, not an executable top-of-book bid/ask fill.</li>
          <li><strong>No Order Book / Depth in Bhavcopy:</strong> Volume and open interest do not indicate depth. True market impact during active hours may exceed modeled slippage.</li>
          <li><strong>GOLDTEN Short Historical Sample:</strong> GOLDTEN was listed in 2025. Walk-forward backtests on GOLDTEN pairs have wide confidence bounds.</li>
          <li><strong>Carry Model Assumption:</strong> The baseline 6.5% carry model approximates repo rate and vault holding, but dynamic physical carry may deviate.</li>
        </ol>
      </div>

      {/* ── 5. REGULATORY GUARDRAILS (SEBI ALGO FRAMEWORK COMPLIANCE) ── */}
      <div className="p-5 rounded-2xl bg-[#11151A] border border-[#2B3139] space-y-2 text-xs text-[#848E9C]">
        <div className="flex items-center gap-2 text-foreground font-bold text-sm">
          <ShieldCheck size={16} className="text-buy" />
          <span>SEBI Regulatory Guardrails (SEBI Framework 2026)</span>
        </div>
        <p className="leading-relaxed text-[11px]">
          GoldLens operates strictly as an educational and analytical research product. It executes zero trades, connects no direct broker auto-order APIs, and offers no personalized financial advice or speculative guarantees. All logic is white-box and inspectable.
        </p>
      </div>

      {/* ── BOTTOM NAV ── */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => onNavigate('today')}
          className="px-4 py-2.5 rounded-xl bg-gold hover:bg-gold-hover text-[#07090C] text-xs font-bold transition-all shadow flex items-center gap-1.5 cursor-pointer"
        >
          <span>Return to Today&apos;s Dashboard</span>
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
