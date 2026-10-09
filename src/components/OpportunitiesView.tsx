'use client';

import React, { useState } from 'react';
import { Zap, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import { Opportunity } from '@/lib/types';

interface OpportunitiesViewProps {
  opportunities: Opportunity[];
  onInspectOpportunity: (opp: Opportunity) => void;
}

type FilterType = 'all' | 'survives' | 'gross' | 'high_conf';

export function OpportunitiesView({
  opportunities,
  onInspectOpportunity,
}: OpportunitiesViewProps) {
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredOpps = opportunities.filter((opp) => {
    if (filter === 'survives') return opp.status === 'EDGE_SURVIVES';
    if (filter === 'gross') return opp.status === 'GROSS_ONLY';
    if (filter === 'high_conf') return opp.confidence >= 80;
    return true;
  });

  const filterOptions: { id: FilterType; label: string }[] = [
    { id: 'all', label: 'All Opportunities' },
    { id: 'survives', label: '✓ Edge Survives' },
    { id: 'gross', label: '⚠ Gross Only' },
    { id: 'high_conf', label: 'High Confidence (>80%)' },
  ];

  return (
    <div className="flex-1 bg-[#0B0E11] overflow-y-auto p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 font-sans select-none">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#2B3139] pb-5 w-full max-w-full min-w-0 box-border">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 text-gold font-bold text-xs uppercase tracking-wider mb-1 font-mono">
              <Zap size={14} />
              <span>CROSS-CONTRACT RELATIVE VALUE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">Market Opportunities</h1>
            <p className="text-xs sm:text-sm text-text-secondary mt-1 max-w-xl">
              Statistical pricing dislocations detected across MCX gold contracts after factoring in statutory taxes, STT, carry, and liquidity hurdles.
            </p>
          </div>

          {/* Filters (Responsive Pill Bar with flex-shrink-0 buttons) */}
          <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar touch-pan-x bg-[#11151A] p-1 sm:p-1.5 rounded-xl border border-[#2B3139] flex-shrink-0 max-w-full min-w-0 box-border">
            {filterOptions.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap flex-shrink-0 touch-manipulation min-h-[36px] ${
                  filter === f.id
                    ? 'bg-[#161A1F] text-gold border border-gold/40 shadow-sm font-bold'
                    : 'text-text-secondary hover:text-foreground hover:bg-[#161A1F]/50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Opportunities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredOpps.map((opp) => {
            const isSurvives = opp.status === 'EDGE_SURVIVES';
            const isGross = opp.status === 'GROSS_ONLY';

            return (
              <div
                key={opp.id}
                className={`p-5 bg-[#161A1F] rounded-2xl border transition-all flex flex-col justify-between ${
                  isSurvives
                    ? 'border-[#2B3139] hover:border-gold/60 shadow-lg'
                    : isGross
                    ? 'border-[#2B3139] hover:border-[#363D47]'
                    : 'border-[#2B3139]/60 opacity-75'
                }`}
              >
                <div>
                  {/* Status Banner */}
                  <div className="flex items-center justify-between mb-3.5">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold font-mono flex items-center gap-1.5 border ${
                        isSurvives
                          ? 'bg-buy/15 text-buy border-buy/30'
                          : isGross
                          ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                          : 'bg-sell/15 text-sell border-sell/30'
                      }`}
                    >
                      {isSurvives ? '✓ EDGE SURVIVES' : isGross ? '⚠ GROSS ONLY' : '✗ NO EDGE'}
                    </span>

                    <span className="text-xs font-mono text-muted tabular-nums">
                      {opp.confidence}% Confidence
                    </span>
                  </div>

                  {/* Pair Name & Direction */}
                  <h3 className="text-lg font-black text-foreground font-mono tracking-tight mb-1">
                    {opp.pair}
                  </h3>
                  <div className="text-xs font-mono font-bold text-text-secondary mb-3.5">
                    {opp.direction}
                  </div>

                  {/* Metrics 2-Column Grid */}
                  <div className="grid grid-cols-2 gap-3 p-3.5 bg-[#11151A] rounded-xl border border-[#2B3139] mb-4 font-mono text-xs">
                    <div>
                      <span className="text-[11px] text-muted block mb-0.5 font-sans">Price Spread</span>
                      <span className="text-foreground font-bold text-sm tabular-nums">+{opp.residual}%</span>
                      <span
                        className="text-[11px] text-gold font-bold ml-1 tabular-nums cursor-help"
                        title="Standard deviations from mean"
                      >
                        ({opp.zScore}σ)
                      </span>
                    </div>

                    <div>
                      <span
                        className="text-[11px] text-muted block mb-0.5 font-sans cursor-help"
                        title="Net tradable edge after deducting all brokerage, STT, and slippage"
                      >
                        Net Edge
                      </span>
                      <span className={`text-sm font-black tabular-nums ${opp.netEdge > 0 ? 'text-buy' : 'text-sell'}`}>
                        {opp.netEdge >= 0 ? '+' : ''}
                        {opp.netEdge}%
                      </span>
                    </div>
                  </div>

                  {/* Breakdown details */}
                  <div className="space-y-1.5 text-xs text-text-secondary mb-5 font-sans">
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-1 cursor-help" title="STT + Exchange turnover fees + stamp duty">
                        <HelpCircle size={12} className="text-muted" />
                        <span>Friction Cost (STT):</span>
                      </span>
                      <span className="text-foreground font-mono font-semibold tabular-nums">-{opp.transactionCost}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-1 cursor-help" title="Financing and time-to-expiry drift difference">
                        <HelpCircle size={12} className="text-muted" />
                        <span>Carry Adjustment:</span>
                      </span>
                      <span className="text-foreground font-mono font-semibold tabular-nums">-{opp.expectedCarry}%</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onInspectOpportunity(opp)}
                  className="w-full py-3 bg-[#11151A] hover:bg-gold hover:text-background text-foreground border border-[#2B3139] hover:border-gold rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 min-h-[44px] touch-manipulation shadow-sm font-mono tracking-wide"
                >
                  <ShieldCheck size={15} />
                  <span>INSPECT AUDIT PROOF</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
