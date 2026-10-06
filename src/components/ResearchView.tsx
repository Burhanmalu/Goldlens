'use client';

import React from 'react';
import { BookOpen, Scale, ShieldCheck, Activity } from 'lucide-react';

export function ResearchView() {
  return (
    <div className="flex-1 bg-background overflow-y-auto p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 font-mono text-xs select-none">
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="border-b border-border pb-4">
          <div className="flex items-center gap-2 text-gold font-bold text-xs uppercase mb-1">
            <BookOpen size={14} />
            <span>QUANTITATIVE RESEARCH WHITEPAPER</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-foreground font-sans">
            Cross-Contract Relative Value & Alpha Robustness Methodology
          </h1>
          <p className="text-text-secondary text-xs mt-1 font-sans">
            Mathematical foundation for normalizing MCX gold contracts, residual extraction, carry adjustment, and walk-forward verification.
          </p>
        </div>

        {/* Section 1: Normalization */}
        <div className="p-4 sm:p-5 bg-panel rounded-2xl border border-border space-y-3">
          <div className="flex items-center gap-2 text-gold font-bold text-sm">
            <Scale size={16} />
            <h2>1. FINE GOLD NORMALIZATION FORMULATION</h2>
          </div>
          <p className="text-text-secondary font-sans leading-relaxed">
            MCX quotes gold across contracts with different lot sizes, quotation units, and purity standards. To create economically comparable units, every contract is mapped to ₹ per gram of 999 fine gold:
          </p>

          <div className="p-3 sm:p-4 bg-secondary rounded-xl border border-border text-foreground font-mono text-xs sm:text-sm overflow-x-auto no-scrollbar">
            P_norm(t) = P_raw(t) / [ QuoteBasis × PurityFactor ]
          </div>

          <div className="text-[11px] text-muted space-y-1 font-sans">
            <div>• <strong className="text-foreground font-mono">GOLDM:</strong> QuoteBasis = 10g, Purity = 0.995 (995/1000)</div>
            <div>• <strong className="text-foreground font-mono">GOLDTEN:</strong> QuoteBasis = 10g, Purity = 0.999 (999/1000)</div>
            <div>• <strong className="text-foreground font-mono">GOLDGUINEA:</strong> QuoteBasis = 8g, Purity = 0.999 (999/1000)</div>
            <div>• <strong className="text-foreground font-mono">GOLDPETAL:</strong> QuoteBasis = 1g, Purity = 0.999 (999/1000)</div>
          </div>
        </div>

        {/* Section 2: Relative Spread & Carry Adjustment */}
        <div className="p-4 sm:p-5 bg-panel rounded-2xl border border-border space-y-3">
          <div className="flex items-center gap-2 text-gold font-bold text-sm">
            <Activity size={16} />
            <h2>2. LOG SPREAD & CARRY-ADJUSTED RESIDUAL</h2>
          </div>
          <p className="text-text-secondary font-sans leading-relaxed">
            The observed relative spread between any two contracts A and B is modeled in log space. To prevent confusing cost-of-carry differences with genuine relative-value dislocations, expected carry is subtracted:
          </p>

          <div className="p-3 sm:p-4 bg-secondary rounded-xl border border-border text-foreground font-mono text-xs sm:text-sm space-y-1.5 overflow-x-auto no-scrollbar">
            <div>Spread(A, B) = ln(P_norm_A) - ln(P_norm_B)</div>
            <div>Carry(A, B) = r_f × (DaysToExpiry_A - DaysToExpiry_B) / 365</div>
            <div className="text-gold font-bold">Residual = Spread(A, B) - Carry(A, B)</div>
          </div>
        </div>

        {/* Section 3: Alpha Audit Hurdle */}
        <div className="p-4 sm:p-5 bg-panel rounded-2xl border border-border space-y-3">
          <div className="flex items-center gap-2 text-gold font-bold text-sm">
            <ShieldCheck size={16} />
            <h2>3. THE ALPHA AUDIT SURVIVAL HURDLE</h2>
          </div>
          <p className="text-text-secondary font-sans leading-relaxed">
            A signal is only declared tradable (<strong className="text-buy">EDGE SURVIVES</strong>) if the residual dislocation exceeds the sum of institutional transaction friction, market impact slippage, and passes out-of-sample walk-forward validation:
          </p>

          <div className="p-3 sm:p-4 bg-secondary rounded-xl border border-border text-foreground font-mono text-xs sm:text-sm overflow-x-auto no-scrollbar">
            |Residual| &gt; k × [ TransactionCost + Slippage(PositionSize) ]
          </div>
        </div>
      </div>
    </div>
  );
}
