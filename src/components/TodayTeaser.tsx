'use client';

import React, { useState } from 'react';

import { CinematicAssetBackdrop } from '@/components/CinematicAssetBackdrop';

export function TodayTeaser() {
  const [activeTab, setActiveTab] = useState<'no_trade' | 'watching' | 'opportunity'>('no_trade');

  const states = {
    no_trade: {
      tag: 'NO TRADE TODAY',
      tagColor: 'text-text-muted bg-elevated border-border',
      headline: 'No trade today. The biggest gap is 0.07%. It costs about 0.09% to trade it. Nothing to capture.',
      subline: 'Cross-contract spreads are compressed tightly inside the CTT and slippage transaction hurdle.',
      chip1: { label: 'Benchmark Gold', val: '₹15,067.44 / g' },
      chip2: { label: "Today's Gap", val: '+0.07%' },
      chip3: { label: 'Transaction Cost', val: '0.09%' },
    },
    watching: {
      tag: 'WATCHING (ILLUSTRATIVE)',
      tagColor: 'text-caution bg-caution/10 border-caution/30',
      headline: "A gap is forming between GOLDM and GOLDTEN. It is still below cost. We'll tell you if it crosses.",
      subline: 'Residual gap is widening toward 0.08%. Friction band requires >0.09% for statistical edge.',
      chip1: { label: 'Current Residual', val: '+0.08%' },
      chip2: { label: 'Hurdle Threshold', val: '0.09%' },
      chip3: { label: 'Status', val: 'Pre-trigger' },
    },
    opportunity: {
      tag: 'OPPORTUNITY (ILLUSTRATIVE)',
      tagColor: 'text-positive bg-positive/10 border-positive/30',
      headline: 'Buy 20 GOLDTEN, sell 2 GOLDM (200 g each). Expected net gain ₹140 per ₹1 lakh after CTT & costs.',
      subline: 'Exit rule: Target mean-reversion within 5 settlement sessions or stop-loss at 1.5x initial spread.',
      chip1: { label: 'Expected Net Gain', val: '+0.14%' },
      chip2: { label: 'Worst Case', val: '-₹420 / ₹1L' },
      chip3: { label: 'Verdict', val: 'EDGE SURVIVES' },
    },
  };

  const curr = states[activeTab];

  return (
    <section className="relative py-28 px-6 max-w-7xl mx-auto border-b border-border overflow-hidden">
      <CinematicAssetBackdrop asset="hero_convergence" opacity={0.35} parallaxSpeed={80} scaleRange={[1, 1.15]} />
      <div className="max-w-3xl mb-12">
        <div className="text-xs uppercase tracking-[0.12em] font-mono text-gold mb-3">
          03 — THE ANSWER FIRST
        </div>
        <h2 className="text-3xl sm:text-5xl font-display font-black uppercase tracking-tight text-text-primary leading-[1.05]">
          Most days, the right move is no move.
        </h2>
      </div>

      <div className="p-8 sm:p-10 rounded-card bg-surface border border-border max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
        {/* Subtle accent line at top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

        <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
          <span className={`px-3 py-1 rounded-pill text-xs font-mono font-bold border ${curr.tagColor}`}>
            {curr.tag}
          </span>
          <span className="text-xs font-mono text-text-muted">
            MCX settlement, 2026-04-03
          </span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-display font-bold text-text-primary leading-snug mb-3">
          {curr.headline}
        </h3>

        <p className="text-sm sm:text-base text-text-secondary leading-relaxed mb-8 max-w-2xl">
          {curr.subline}
        </p>

        {/* 3 Core Facts */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-border mb-8">
          <div className="p-4 rounded-xl bg-[#0A0A0B] border border-border">
            <span className="text-[11px] font-mono text-text-muted block mb-1">{curr.chip1.label}</span>
            <span className="text-lg font-mono font-bold text-text-primary">{curr.chip1.val}</span>
          </div>

          <div className="p-4 rounded-xl bg-[#0A0A0B] border border-border">
            <span className="text-[11px] font-mono text-text-muted block mb-1">{curr.chip2.label}</span>
            <span className="text-lg font-mono font-bold text-gold">{curr.chip2.val}</span>
          </div>

          <div className="p-4 rounded-xl bg-[#0A0A0B] border border-border">
            <span className="text-[11px] font-mono text-text-muted block mb-1">{curr.chip3.label}</span>
            <span className="text-lg font-mono font-bold text-text-secondary">{curr.chip3.val}</span>
          </div>
        </div>

        {/* State Preview Chips */}
        <div className="flex items-center gap-2 pt-2 text-xs font-mono">
          <span className="text-text-muted mr-2">Preview state:</span>
          <button
            onClick={() => setActiveTab('no_trade')}
            className={`px-3 py-1.5 rounded-pill border transition-all cursor-pointer ${
              activeTab === 'no_trade'
                ? 'bg-elevated border-gold text-gold font-bold'
                : 'bg-transparent border-border text-text-secondary hover:text-text-primary'
            }`}
          >
            No Trade (Real today)
          </button>

          <button
            onClick={() => setActiveTab('watching')}
            className={`px-3 py-1.5 rounded-pill border transition-all cursor-pointer ${
              activeTab === 'watching'
                ? 'bg-caution/20 border-caution text-caution font-bold'
                : 'bg-transparent border-border text-text-secondary hover:text-text-primary'
            }`}
          >
            Watching
          </button>

          <button
            onClick={() => setActiveTab('opportunity')}
            className={`px-3 py-1.5 rounded-pill border transition-all cursor-pointer ${
              activeTab === 'opportunity'
                ? 'bg-positive/20 border-positive text-positive font-bold'
                : 'bg-transparent border-border text-text-secondary hover:text-text-primary'
            }`}
          >
            Opportunity
          </button>
        </div>
      </div>
    </section>
  );
}
