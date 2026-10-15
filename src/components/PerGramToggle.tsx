'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CinematicAssetBackdrop } from '@/components/CinematicAssetBackdrop';
import { CinematicFilamentsVideo } from '@/components/CinematicFilamentsVideo';

export function PerGramToggle() {
  const [mode, setMode] = useState<'quoted' | 'normalized'>('quoted');

  const contracts = [
    {
      name: 'GOLDM',
      spec: '10g · 995 fine',
      quotedText: '₹1,49,921 per 10 g',
      quotedValue: 149921,
      normalizedText: '₹15,067 / g',
      normalizedValue: 15067.4,
      diff: 'Benchmark',
    },
    {
      name: 'GOLDTEN',
      spec: '10g · 999 fine',
      quotedText: '₹1,50,279 per 10 g',
      quotedValue: 150279,
      normalizedText: '₹15,043 / g',
      normalizedValue: 15042.9,
      diff: '-0.16%',
    },
    {
      name: 'GOLDGUINEA',
      spec: '8g · 999 fine',
      quotedText: '₹1,20,671 per 8 g',
      quotedValue: 120671,
      normalizedText: '₹15,099 / g',
      normalizedValue: 15099.0,
      diff: '+0.21%',
    },
    {
      name: 'GOLDPETAL',
      spec: '1g · 999 fine',
      quotedText: '₹15,083 per 1 g',
      quotedValue: 15083,
      normalizedText: '₹15,098 / g',
      normalizedValue: 15098.1,
      diff: '+0.20%',
    },
  ];

  // Max width normalization
  const maxQuoted = 155000;
  const maxNormalized = 15200;

  return (
    <section id="problem" className="relative py-28 border-b border-white/[0.06] overflow-hidden">
      {/* monolith_card.webp backdrop */}
      <CinematicAssetBackdrop asset="monolith_card" opacity={0.40} parallaxPx={50} />
      {/* Drifting gold filaments video */}
      <CinematicFilamentsVideo opacity={0.25} />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
      <div className="max-w-3xl mb-12">
        <div className="text-xs uppercase tracking-[0.12em] font-mono text-gold mb-3">
          01 — THE PROBLEM
        </div>
        <h2 className="text-3xl sm:text-5xl font-display font-black uppercase tracking-tight text-text-primary leading-[1.05]">
          Four contracts. One gold. Four different prices.
        </h2>
        <p className="text-base sm:text-lg text-text-secondary mt-4 leading-relaxed">
          Lot size, quotation basis, purity and expiry make raw prices impossible to compare. Most &apos;gaps&apos; you see are just arithmetic.
        </p>
      </div>

      {/* Segmented Controller */}
      <div className="p-6 sm:p-8 rounded-card bg-surface border border-border max-w-4xl mx-auto shadow-2xl">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <div className="inline-flex p-1 rounded-pill bg-[#0A0A0B] border border-border">
            <button
              onClick={() => setMode('quoted')}
              className={`px-5 py-2 rounded-pill text-xs font-mono font-medium transition-all cursor-pointer ${
                mode === 'quoted'
                  ? 'bg-elevated text-text-primary shadow-sm'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              As quoted
            </button>
            <button
              onClick={() => setMode('normalized')}
              className={`px-5 py-2 rounded-pill text-xs font-mono font-medium transition-all cursor-pointer ${
                mode === 'normalized'
                  ? 'bg-gold text-[#0A0A0B] font-bold shadow-sm'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              Per gram of fine gold
            </button>
          </div>

          <span className="text-xs font-mono text-text-muted">
            {mode === 'quoted' ? 'Notice the wide artificial divergence' : 'Reveals true fine gold value'}
          </span>
        </div>

        {/* Visual Comparison Bars */}
        <div className="space-y-6">
          {contracts.map((c) => {
            const widthPct =
              mode === 'quoted'
                ? (c.quotedValue / maxQuoted) * 100
                : (c.normalizedValue / maxNormalized) * 100;

            return (
              <div key={c.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-text-primary">{c.name}</span>
                    <span className="text-text-muted">({c.spec})</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-text-secondary tabular-nums">
                      {mode === 'quoted' ? c.quotedText : c.normalizedText}
                    </span>
                    {mode === 'normalized' && (
                      <span className="text-[11px] text-gold font-semibold">
                        {c.diff}
                      </span>
                    )}
                  </div>
                </div>

                <div className="h-4 bg-[#0A0A0B] rounded-full overflow-hidden p-0.5 border border-border/40">
                  <motion.div
                    className={`h-full rounded-full ${
                      mode === 'normalized'
                        ? 'bg-gradient-to-r from-gold-from to-gold-to'
                        : 'bg-text-secondary/40'
                    }`}
                    initial={false}
                    animate={{ width: `${Math.min(100, widthPct)}%` }}
                    transition={{ type: 'spring', damping: 20, stiffness: 120 }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* The bottom takeaway */}
        <div className="mt-8 pt-6 border-t border-border flex items-center justify-between text-xs font-mono text-text-secondary">
          <span>What is left is the real question: is the difference bigger than the cost of trading it?</span>
        </div>
      </div>
      </div>
    </section>
  );
}
