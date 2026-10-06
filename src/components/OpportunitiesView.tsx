'use client';

import React, { useState } from 'react';
import { Zap, ArrowRight } from 'lucide-react';
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
      <div className="max-w-6xl mx-auto space-y-5 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2B3139] pb-4 sm:pb-5">
          <div>
            <div className="flex items-center gap-2 text-gold font-bold text-xs uppercase tracking-wider mb-1 font-mono">
              <Zap size={14} />
              <span>CROSS-CONTRACT INTELLIGENCE</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-foreground">Market Opportunities</h1>
            <p className="text-xs sm:text-sm text-text-secondary mt-1">
              Potential pricing dislocations detected across MCX gold contracts after friction & carry adjustments.
            </p>
          </div>

          {/* Filters (Horizontally scrollable on mobile) */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar touch-pan-x bg-[#11151A] p-1 rounded-xl border border-[#2B3139]">
            {filterOptions.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap flex-shrink-0 touch-manipulation min-h-[38px] ${
                  filter === f.id
                    ? 'bg-[#161A1F] text-gold border border-gold/40 shadow-sm ring-1 ring-gold/20'
                    : 'text-text-secondary hover:text-foreground'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Opportunities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredOpps.map((opp) => {
            const isSurvives = opp.status === 'EDGE_SURVIVES';
            const isGross = opp.status === 'GROSS_ONLY';

            return (
              <div
                key={opp.id}
                className={`p-4 sm:p-5 bg-[#161A1F] rounded-2xl border transition-all flex flex-col justify-between ${
                  isSurvives
                    ? 'border-gold/50 shadow-lg hover:border-gold'
                    : isGross
                    ? 'border-[#2B3139] hover:border-[#363D47]'
                    : 'border-[#2B3139]/60 opacity-75'
                }`}
              >
                <div>
                  {/* Status Banner */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono flex items-center gap-1 border ${
                        isSurvives
                          ? 'bg-buy/15 text-buy border-buy/30'
                          : isGross
                          ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                          : 'bg-sell/15 text-sell border-sell/30'
                      }`}
                    >
                      {isSurvives ? '✓ EDGE SURVIVES' : isGross ? '⚠ GROSS ONLY' : '✗ NO EDGE'}
                    </span>

                    <span className="text-xs font-mono text-muted">{opp.confidence}% Confidence</span>
                  </div>

                  {/* Pair Name & Strategy */}
                  <h3 className="text-base sm:text-lg font-black text-foreground font-mono mb-0.5">{opp.pair}</h3>
                  <div className="text-xs text-gold font-mono mb-3 font-semibold">{opp.direction}</div>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 p-3 bg-[#11151A] rounded-xl border border-[#2B3139] mb-4 font-mono text-xs">
                    <div>
                      <span className="text-[10px] text-muted block mb-0.5">Price Difference</span>
                      <span className="text-foreground font-bold text-sm">+{opp.residual}%</span>
                      <span className="text-[10px] text-muted ml-1">({opp.zScore}σ)</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-muted block mb-0.5">Net Tradable Edge</span>
                      <span className={`text-sm font-black ${opp.netEdge > 0 ? 'text-buy' : 'text-sell'}`}>
                        {opp.netEdge >= 0 ? '+' : ''}
                        {opp.netEdge}%
                      </span>
                    </div>
                  </div>

                  {/* Trust Details */}
                  <div className="space-y-1 text-xs text-text-secondary mb-4">
                    <div className="flex justify-between">
                      <span>Transaction Cost:</span>
                      <span className="text-foreground font-mono">-{opp.transactionCost}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Carry Adjustment:</span>
                      <span className="text-foreground font-mono">-{opp.expectedCarry}%</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onInspectOpportunity(opp)}
                  className="w-full py-3 bg-[#11151A] hover:bg-gold hover:text-background text-foreground border border-[#2B3139] hover:border-gold rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 min-h-[44px] touch-manipulation shadow-sm"
                >
                  <span>Inspect Audit Proof</span>
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
