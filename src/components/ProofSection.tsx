'use client';

import React from 'react';
import { CinematicAssetBackdrop } from '@/components/CinematicAssetBackdrop';

interface ProofSectionProps {
  onOpenMethod: () => void;
}

export function ProofSection({ onOpenMethod }: ProofSectionProps) {
  const cards = [
    {
      title: 'Walk-forward on unseen data',
      desc: 'Tested on chronological out-of-sample slices so no future information bleeds into threshold selection.',
    },
    {
      title: 'Random-entry placebo',
      desc: 'Compared against thousands of synthetic entry sequences to ensure the residual is not pure noise (p=0.14).',
    },
    {
      title: 'Costs on thin contracts',
      desc: 'Conservative slippage penalties on illiquid contracts (GOLDGUINEA, GOLDPETAL) to protect execution reality.',
    },
    {
      title: 'Gold-price effect removed',
      desc: 'Beta decomposition proves that residual returns have essentially zero correlation (β=0.02) to underlying gold trend.',
    },
  ];

  return (
    <section id="proof" className="relative py-28 border-b border-white/[0.06] overflow-hidden">
      {/* monolith_card.webp backdrop */}
      <CinematicAssetBackdrop asset="monolith_card" opacity={0.42} parallaxPx={80} />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
      <div className="max-w-3xl mb-12">
        <div className="text-xs uppercase tracking-[0.12em] font-mono text-gold mb-3">
          05 — PROOF
        </div>
        <h2 className="text-3xl sm:text-5xl font-display font-black uppercase tracking-tight text-text-primary leading-[1.05]">
          We try to kill our own signal.
        </h2>
        <p className="text-base sm:text-lg text-text-secondary mt-4 leading-relaxed">
          If a trading rule only works before taxes, commissions, or without market impact, it is not an edge. We publish every failure.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {cards.map((c) => (
          <div key={c.title} className="p-6 rounded-card bg-surface border border-border">
            <h3 className="font-display text-lg font-bold text-text-primary mb-2">
              {c.title}
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              {c.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Legend chips */}
      <div className="p-6 rounded-card bg-surface/50 border border-border flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-mono text-text-muted block mb-3 uppercase tracking-wider">
            Verdict classifications:
          </span>
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <span className="px-3 py-1 rounded-pill bg-positive/10 text-positive border border-positive/30 font-bold">
              EDGE SURVIVES
            </span>
            <span className="px-3 py-1 rounded-pill bg-caution/10 text-caution border border-caution/30 font-bold">
              GROSS ONLY
            </span>
            <span className="px-3 py-1 rounded-pill bg-negative/10 text-negative border border-negative/30 font-bold">
              NO EDGE
            </span>
            <span className="px-3 py-1 rounded-pill bg-elevated text-text-muted border border-border font-bold">
              INSUFFICIENT DATA
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <button
            onClick={onOpenMethod}
            className="text-gold hover:underline cursor-pointer font-bold"
          >
            Read the method →
          </button>
          <a
            href="https://github.com/Burhanmalu/Goldlens"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-muted hover:text-text-secondary transition-colors"
          >
            View the code
          </a>
        </div>
      </div>
      </div>
    </section>
  );
}
