'use client';

import React from 'react';
import { GitCompareArrows } from 'lucide-react';
import { PairSpread, Opportunity } from '@/lib/types';

interface RelativeValueViewProps {
  pairSpreads?: PairSpread[];
  opportunities?: Opportunity[];
  onSelectPair: (pair: string) => void;
  onNavigateAudit: (opp?: Opportunity) => void;
}

export function RelativeValueView({
  onSelectPair,
  onNavigateAudit,
}: RelativeValueViewProps) {
  const pairs = [
    {
      pair: 'GOLDM / GOLDTEN',
      spread: 0.42,
      carry: 0.09,
      residual: 0.33,
      zScore: 2.41,
      status: 'EDGE_SURVIVES',
      netEdge: 0.12,
      confidence: 89,
    },
    {
      pair: 'GOLDGUINEA / GOLDPETAL',
      spread: 0.21,
      carry: 0.12,
      residual: 0.09,
      zScore: 1.72,
      status: 'GROSS_ONLY',
      netEdge: 0.01,
      confidence: 52,
    },
    {
      pair: 'GOLDM / GOLDGUINEA',
      spread: 0.08,
      carry: 0.01,
      residual: 0.07,
      zScore: 2.12,
      status: 'NO_EDGE',
      netEdge: -0.05,
      confidence: 31,
    },
    {
      pair: 'GOLDTEN / GOLDPETAL',
      spread: -0.15,
      carry: -0.03,
      residual: -0.12,
      zScore: -1.24,
      status: 'NO_EDGE',
      netEdge: -0.08,
      confidence: 40,
    },
    {
      pair: 'GOLDM / GOLDPETAL',
      spread: -0.22,
      carry: -0.02,
      residual: -0.20,
      zScore: -1.88,
      status: 'GROSS_ONLY',
      netEdge: 0.02,
      confidence: 48,
    },
    {
      pair: 'GOLDTEN / GOLDGUINEA',
      spread: 0.34,
      carry: 0.08,
      residual: 0.26,
      zScore: 1.95,
      status: 'GROSS_ONLY',
      netEdge: 0.04,
      confidence: 55,
    },
  ];

  return (
    <div className="flex-1 bg-background overflow-y-auto p-6 font-mono text-xs select-none">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
          <div>
            <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
              <GitCompareArrows size={20} className="text-gold" />
              CROSS-CONTRACT RELATIVE-VALUE MATRIX
            </h1>
            <p className="text-text-secondary text-xs mt-1 font-sans">
              Pairwise dislocation analysis across all 6 combinations of MCX gold derivatives.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="px-2.5 py-1 bg-buy/15 text-buy border border-buy/30 rounded font-bold">
              1 Tradable Edge Survives
            </span>
            <span className="px-2.5 py-1 bg-amber-500/15 text-amber-400 border border-amber-500/30 rounded font-bold">
              3 Gross Dislocations
            </span>
          </div>
        </div>

        {/* 6-Pair Dislocation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pairs.map((p) => {
            const isSurvives = p.status === 'EDGE_SURVIVES';
            const isGross = p.status === 'GROSS_ONLY';

            return (
              <div
                key={p.pair}
                className={`p-4 bg-panel rounded-xl border transition-all ${
                  isSurvives
                    ? 'border-gold shadow-lg ring-1 ring-gold/40'
                    : isGross
                    ? 'border-border hover:border-border-light'
                    : 'border-border/60 opacity-80'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-extrabold text-sm text-foreground">{p.pair}</h3>
                    <span className="text-[10px] text-muted">Synthetic Relative Spread</span>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      isSurvives
                        ? 'bg-buy/15 text-buy border-buy/30'
                        : isGross
                        ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                        : 'bg-sell/15 text-sell border-sell/30'
                    }`}
                  >
                    {isSurvives ? '✓ EDGE SURVIVES' : isGross ? '⚠ GROSS ONLY' : '✗ NO EDGE'}
                  </span>
                </div>

                <div className="space-y-1.5 py-2 border-y border-border/50 text-[11px] tabular-nums">
                  <div className="flex justify-between text-muted">
                    <span>Normalized Spread:</span>
                    <span className="text-foreground font-semibold">
                      {p.spread >= 0 ? '+' : ''}
                      {p.spread}%
                    </span>
                  </div>
                  <div className="flex justify-between text-muted">
                    <span>Expected Carry (DTE):</span>
                    <span className="text-sell">
                      {p.carry >= 0 ? '+' : ''}
                      {p.carry}%
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-foreground">
                    <span>Residual Dislocation:</span>
                    <span className="text-gold">
                      {p.residual >= 0 ? '+' : ''}
                      {p.residual}%
                    </span>
                  </div>
                  <div className="flex justify-between text-muted">
                    <span>Statistical Z-Score:</span>
                    <span className="font-bold text-foreground">
                      {p.zScore >= 0 ? '+' : ''}
                      {p.zScore}σ
                    </span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-border/40 font-bold">
                    <span className="text-gold">Net Edge Post-Audit:</span>
                    <span className={p.netEdge > 0 ? 'text-buy' : 'text-sell'}>
                      {p.netEdge >= 0 ? '+' : ''}
                      {p.netEdge}% ({p.confidence}% conf)
                    </span>
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-between">
                  <button
                    onClick={() => onSelectPair(p.pair)}
                    className="text-[10px] text-text-secondary hover:text-foreground font-semibold"
                  >
                    View Chart →
                  </button>

                  <button
                    onClick={() => onNavigateAudit()}
                    className="px-3 py-1 bg-secondary hover:bg-panel-hover text-gold border border-border hover:border-gold/40 rounded font-bold text-[10px] transition-colors"
                  >
                    Audit Step →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
