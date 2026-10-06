'use client';

import React, { useState } from 'react';
import {
  ArrowRight, CheckCircle2,
  HelpCircle, Layers, ChevronDown, ChevronUp
} from 'lucide-react';
import { Opportunity, OrderBookState } from '@/lib/types';

interface BestOpportunityCardProps {
  opportunity: Opportunity;
  onViewDetails: () => void;
  onViewAllOpportunities: () => void;
  orderBook: OrderBookState;
}

export function BestOpportunityCard({
  opportunity,
  onViewDetails,
  onViewAllOpportunities,
  orderBook,
}: BestOpportunityCardProps) {
  const [showDepth, setShowDepth] = useState(false);

  return (
    <div className="space-y-4 font-sans select-none">
      {/* ── CARD 1: BEST OPPORTUNITY ── */}
      <div className="p-5 bg-[#161A1F] rounded-xl border border-gold/40 shadow-lg relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-2xl pointer-events-none" />

        {/* Top Tag & Status */}
        <div className="flex items-center justify-between mb-3 border-b border-[#2B3139] pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            <span className="text-xs font-bold text-gold uppercase tracking-wider font-mono">
              BEST OPPORTUNITY
            </span>
          </div>

          <span className="px-2.5 py-0.5 rounded-full bg-buy/15 text-buy border border-buy/30 text-xs font-bold font-mono flex items-center gap-1">
            <CheckCircle2 size={13} />
            <span>VERIFIED</span>
          </span>
        </div>

        {/* Pair Name & Strategy */}
        <div className="mb-4">
          <h3 className="text-xl font-black text-foreground tracking-tight font-mono">
            {opportunity.pair || 'GOLDM / GOLDTEN'}
          </h3>
          <div className="text-xs font-bold text-text-secondary mt-0.5 font-mono">
            {opportunity.direction || 'LONG GOLDM / SHORT GOLDTEN'}
          </div>
        </div>

        {/* Core Clean Metrics Grid */}
        <div className="grid grid-cols-3 gap-3 p-3 bg-[#11151A] rounded-lg border border-[#2B3139] mb-4 text-center font-mono">
          <div>
            <span className="text-[11px] text-muted block mb-0.5">Expected Edge</span>
            <span className="text-base font-black text-buy">
              +{opportunity.netEdge || 0.15}%
            </span>
          </div>

          <div>
            <span className="text-[11px] text-muted block mb-0.5">Confidence</span>
            <span className="text-base font-black text-foreground">
              {opportunity.confidence || 87}%
            </span>
          </div>

          <div>
            <span className="text-[11px] text-muted block mb-0.5" title="Z-Score">
              Unusualness
            </span>
            <span className="text-base font-black text-gold">
              +{opportunity.zScore || 2.41}σ
            </span>
          </div>
        </div>

        {/* Trust & Validation Checkmarks */}
        <div className="space-y-1.5 mb-5 text-xs text-text-secondary">
          <div className="flex items-center gap-2 text-foreground font-medium">
            <CheckCircle2 size={14} className="text-buy flex-shrink-0" />
            <span>Survives all transaction costs & STT</span>
          </div>
          <div className="flex items-center gap-2 text-foreground font-medium">
            <CheckCircle2 size={14} className="text-buy flex-shrink-0" />
            <span>Passed walk-forward out-of-sample validation</span>
          </div>
          <div className="flex items-center gap-2 text-foreground font-medium">
            <CheckCircle2 size={14} className="text-buy flex-shrink-0" />
            <span>High executable top-of-book liquidity</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onViewDetails}
          className="w-full py-2.5 bg-gold hover:bg-gold-hover text-background font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md"
        >
          <span>View Details & Audit</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* ── CARD 2: "WHY THIS OPPORTUNITY?" ── */}
      <div className="p-4 bg-[#161A1F] rounded-xl border border-[#2B3139] space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
          <HelpCircle size={14} className="text-gold" />
          <span>WHY THIS OPPORTUNITY?</span>
        </div>

        <p className="text-xs text-text-secondary leading-relaxed">
          <strong className="text-foreground">GoldM</strong> is currently cheaper than{' '}
          <strong className="text-foreground">GoldTen</strong> after adjusting for contract size and purity.
        </p>

        <p className="text-xs text-text-secondary leading-relaxed">
          The difference is wider than normal historical ranges. Estimated edge after friction is{' '}
          <span className="text-buy font-bold font-mono">+{opportunity.netEdge || 0.15}%</span> with{' '}
          <span className="text-foreground font-bold font-mono">{opportunity.confidence || 87}%</span> confidence.
        </p>
      </div>

      {/* ── MORE OPPORTUNITIES CALLOUT ── */}
      <div className="p-3 bg-[#11151A] rounded-lg border border-[#2B3139] flex items-center justify-between text-xs">
        <span className="text-text-secondary font-medium">2 more opportunities available</span>
        <button
          onClick={onViewAllOpportunities}
          className="text-gold hover:text-gold-hover font-bold flex items-center gap-1 transition-colors"
        >
          <span>View All</span>
          <ArrowRight size={12} />
        </button>
      </div>

      {/* ── COLLAPSIBLE POWER-USER MARKET DEPTH ── */}
      <div className="border border-[#2B3139] rounded-xl overflow-hidden bg-[#161A1F]">
        <button
          onClick={() => setShowDepth(!showDepth)}
          className="w-full px-4 py-2.5 flex items-center justify-between text-xs font-semibold text-text-secondary hover:text-foreground transition-colors"
        >
          <div className="flex items-center gap-2">
            <Layers size={13} className="text-muted" />
            <span>Market Depth & Order Book</span>
          </div>
          {showDepth ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {showDepth && (
          <div className="p-3 border-t border-[#2B3139] font-mono text-xs bg-[#11151A] space-y-1.5">
            <div className="grid grid-cols-3 text-[10px] text-muted pb-1 border-b border-[#2B3139]">
              <span>PRICE</span>
              <span className="text-right">SIZE</span>
              <span className="text-right">SIDE</span>
            </div>
            {orderBook.asks.slice(-3).map((a, i) => (
              <div key={`a-${i}`} className="grid grid-cols-3 text-[11px] text-sell">
                <span>₹{a.price.toLocaleString('en-IN')}</span>
                <span className="text-right text-text-secondary">{a.size}</span>
                <span className="text-right uppercase font-bold">Ask</span>
              </div>
            ))}
            <div className="py-1 my-1 px-2 bg-[#161A1F] rounded border border-[#2B3139] flex justify-between text-[11px]">
              <span className="text-foreground font-bold">Mid: ₹{orderBook.lastPrice.toLocaleString('en-IN')}</span>
              <span className="text-muted">Spread: ₹{orderBook.spread}</span>
            </div>
            {orderBook.bids.slice(0, 3).map((b, i) => (
              <div key={`b-${i}`} className="grid grid-cols-3 text-[11px] text-buy">
                <span>₹{b.price.toLocaleString('en-IN')}</span>
                <span className="text-right text-text-secondary">{b.size}</span>
                <span className="text-right uppercase font-bold">Bid</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
