'use client';

import React, { useState } from 'react';
import {
  Zap, ShieldCheck, AlertTriangle, ArrowRight,
  Filter, CheckCircle2, XCircle, Search
} from 'lucide-react';
import { Opportunity } from '@/lib/types';

interface OpportunitiesViewProps {
  opportunities: Opportunity[];
  onInspectOpportunity: (opp: Opportunity) => void;
}

export function OpportunitiesView({
  opportunities,
  onInspectOpportunity,
}: OpportunitiesViewProps) {
  const [filter, setFilter] = useState<'all' | 'survives' | 'gross' | 'high_conf'>('all');

  const filteredOpps = opportunities.filter((opp) => {
    if (filter === 'survives') return opp.status === 'EDGE_SURVIVES';
    if (filter === 'gross') return opp.status === 'GROSS_ONLY';
    if (filter === 'high_conf') return opp.confidence >= 80;
    return true;
  });

  return (
    <div className="flex-1 bg-[#0B0E11] overflow-y-auto p-8 font-sans select-none">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#2B3139] pb-5">
          <div>
            <div className="flex items-center gap-2 text-gold font-bold text-xs uppercase tracking-wider mb-1 font-mono">
              <Zap size={14} />
              <span>CROSS-CONTRACT INTELLIGENCE</span>
            </div>
            <h1 className="text-2xl font-black text-foreground">Market Opportunities</h1>
            <p className="text-sm text-text-secondary mt-1">
              Potential pricing dislocations detected across MCX gold contracts after friction & carry adjustments.
            </p>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 bg-[#11151A] p-1 rounded-lg border border-[#2B3139]">
            {[
              { id: 'all', label: 'All Opportunities' },
              { id: 'survives', label: '✓ Edge Survives' },
              { id: 'gross', label: '⚠ Gross Only' },
              { id: 'high_conf', label: 'High Confidence (>80%)' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id as any)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  filter === f.id
                    ? 'bg-[#161A1F] text-gold border border-[#2B3139] shadow-sm'
                    : 'text-text-secondary hover:text-foreground'
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
                className={`p-5 bg-[#161A1F] rounded-xl border transition-all flex flex-col justify-between ${
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
                  <h3 className="text-lg font-black text-foreground font-mono mb-1">{opp.pair}</h3>
                  <div className="text-xs text-text-secondary font-mono mb-4">{opp.direction}</div>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-3 p-3 bg-[#11151A] rounded-lg border border-[#2B3139] mb-4 font-mono text-xs">
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
                  className="w-full py-2.5 bg-[#11151A] hover:bg-gold hover:text-background text-foreground border border-[#2B3139] hover:border-gold rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Inspect Audit Proof</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
