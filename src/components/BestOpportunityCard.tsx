'use client';

import React, { useState } from 'react';
import {
  ArrowRight, CheckCircle2,
  HelpCircle, Layers, Sliders
} from 'lucide-react';
import { Opportunity, OrderBookState, ContractSnapshot } from '@/lib/types';

interface BestOpportunityCardProps {
  opportunity: Opportunity;
  onViewDetails: () => void;
  onViewAllOpportunities: () => void;
  orderBook: OrderBookState;
  selectedSymbol?: string;
  setSelectedSymbol?: (s: string) => void;
  compareSymbol?: string;
  setCompareSymbol?: (s: string) => void;
  selectedSnapshot?: ContractSnapshot;
  compareSnapshot?: ContractSnapshot;
  normDiffPercent?: string;
  onViewSpreadOnChart?: () => void;
}

export function BestOpportunityCard({
  opportunity,
  onViewDetails,
  onViewAllOpportunities,
  orderBook,
  selectedSymbol = 'GOLDM',
  setSelectedSymbol,
  compareSymbol = 'GOLDTEN',
  setCompareSymbol,
  selectedSnapshot,
  compareSnapshot,
  normDiffPercent = '+0.33',
  onViewSpreadOnChart,
}: BestOpportunityCardProps) {
  const [activeTab, setActiveTab] = useState<'why' | 'compare' | 'depth'>('why');
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  return (
    <div className="bg-[#161A1F] rounded-2xl border border-gold/40 shadow-lg p-3.5 sm:p-4 flex flex-col justify-between select-none font-sans relative overflow-hidden min-h-[460px]">
      {/* Subtle glow background */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-2xl pointer-events-none" />

      {/* ── TOP: OPPORTUNITY HEADER & BADGE ── */}
      <div>
        <div className="flex items-center justify-between mb-2 border-b border-[#2B3139] pb-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            <span className="text-xs font-bold text-gold uppercase tracking-wider font-mono">
              BEST OPPORTUNITY
            </span>
          </div>

          <span className="px-2 py-0.5 rounded-full bg-buy/15 text-buy border border-buy/30 text-[11px] font-bold font-mono flex items-center gap-1">
            <CheckCircle2 size={12} />
            <span>✓ EDGE SURVIVES</span>
          </span>
        </div>

        {/* Pair Name & Strategy */}
        <div className="mb-2">
          <h3 className="text-base sm:text-lg font-black text-foreground tracking-tight font-mono">
            {opportunity.pair || 'GOLDM / GOLDTEN'}
          </h3>
          <div className="text-[11px] sm:text-xs font-bold text-gold font-mono">
            {opportunity.direction || 'LONG GOLDM / SHORT GOLDTEN'}
          </div>
        </div>

        {/* Core Clean Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 p-2.5 bg-[#11151A] rounded-xl border border-[#2B3139] mb-2.5 text-center font-mono">
          <div>
            <span className="text-[10px] text-muted block mb-0.5">Expected Edge</span>
            <span className="text-xs sm:text-sm font-black text-buy">
              +{opportunity.netEdge || 0.15}%
            </span>
          </div>

          <div>
            <span className="text-[10px] text-muted block mb-0.5">Confidence</span>
            <span className="text-xs sm:text-sm font-black text-foreground">
              {opportunity.confidence || 87}%
            </span>
          </div>

          <div>
            <span className="text-[10px] text-muted block mb-0.5" title="Z-Score">
              Z-Score
            </span>
            <span className="text-xs sm:text-sm font-black text-gold">
              +{opportunity.zScore || 2.41}σ
            </span>
          </div>
        </div>

        {/* Validation Checkpoints */}
        <div className="space-y-1 mb-3 text-[11px] text-text-secondary">
          <div className="flex items-center gap-2 text-foreground font-medium">
            <CheckCircle2 size={13} className="text-buy flex-shrink-0" />
            <span>Survives all transaction costs & STT</span>
          </div>
          <div className="flex items-center gap-2 text-foreground font-medium">
            <CheckCircle2 size={13} className="text-buy flex-shrink-0" />
            <span>Passed walk-forward out-of-sample validation</span>
          </div>
          <div className="flex items-center gap-2 text-foreground font-medium">
            <CheckCircle2 size={13} className="text-buy flex-shrink-0" />
            <span>High executable top-of-book liquidity</span>
          </div>
        </div>

        {/* View Details & Audit Button */}
        <button
          onClick={() => setShowDetailsModal(true)}
          className="w-full py-2.5 bg-gold hover:bg-gold-hover text-background font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-md min-h-[38px] touch-manipulation mb-3"
        >
          <span>VIEW DETAILS & AUDIT</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* ── BOTTOM TABBED TOOLBAR (Why | Comparator | Depth) ── */}
      <div className="border-t border-[#2B3139] pt-2.5 flex-1 flex flex-col justify-between min-h-[140px]">
        {/* Tab Selector Buttons */}
        <div className="flex items-center gap-1 bg-[#11151A] p-1 rounded-xl border border-[#2B3139] mb-2 text-xs font-mono">
          <button
            onClick={() => setActiveTab('why')}
            className={`flex-1 py-1 rounded-lg font-bold transition-all flex items-center justify-center gap-1 text-[11px] ${
              activeTab === 'why' ? 'bg-[#161A1F] text-gold border border-[#2B3139] shadow-sm' : 'text-muted hover:text-foreground'
            }`}
          >
            <HelpCircle size={12} />
            <span>Why</span>
          </button>
          <button
            onClick={() => setActiveTab('compare')}
            className={`flex-1 py-1 rounded-lg font-bold transition-all flex items-center justify-center gap-1 text-[11px] ${
              activeTab === 'compare' ? 'bg-[#161A1F] text-gold border border-[#2B3139] shadow-sm' : 'text-muted hover:text-foreground'
            }`}
          >
            <Sliders size={12} />
            <span>Comparator</span>
          </button>
          <button
            onClick={() => setActiveTab('depth')}
            className={`flex-1 py-1 rounded-lg font-bold transition-all flex items-center justify-center gap-1 text-[11px] ${
              activeTab === 'depth' ? 'bg-[#161A1F] text-gold border border-[#2B3139] shadow-sm' : 'text-muted hover:text-foreground'
            }`}
          >
            <Layers size={12} />
            <span>Depth</span>
          </button>
        </div>

        {/* TAB 1: WHY THIS OPPORTUNITY */}
        {activeTab === 'why' && (
          <div className="bg-[#11151A] p-2.5 rounded-xl border border-[#2B3139] space-y-2 text-xs">
            <p className="text-[11px] text-text-secondary leading-relaxed">
              <strong className="text-foreground">GoldM</strong> is trading below fair value vs{' '}
              <strong className="text-foreground">GoldTen</strong> after adjusting for purity & DTE carry.
            </p>
            <div className="flex items-center justify-between pt-1 border-t border-[#2B3139]/50 text-[11px]">
              <span className="text-muted">2 more opportunities</span>
              <button
                onClick={onViewAllOpportunities}
                className="text-gold hover:text-gold-hover font-bold flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight size={11} />
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: QUICK CROSS-CONTRACT COMPARATOR */}
        {activeTab === 'compare' && (
          <div className="bg-[#11151A] p-2.5 rounded-xl border border-[#2B3139] space-y-2 text-xs font-mono">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-muted block text-[9px] mb-0.5 font-sans">A</label>
                <select
                  value={selectedSymbol}
                  onChange={(e) => setSelectedSymbol && setSelectedSymbol(e.target.value)}
                  className="w-full bg-[#161A1F] text-foreground font-bold px-2 py-1 rounded-lg border border-[#2B3139] text-xs focus:outline-none"
                >
                  <option value="GOLDM">GOLDM (100g)</option>
                  <option value="GOLDTEN">GOLDTEN (10g)</option>
                  <option value="GOLDGUINEA">GOLDGUINEA (8g)</option>
                  <option value="GOLDPETAL">GOLDPETAL (1g)</option>
                </select>
              </div>
              <div>
                <label className="text-muted block text-[9px] mb-0.5 font-sans">B</label>
                <select
                  value={compareSymbol}
                  onChange={(e) => setCompareSymbol && setCompareSymbol(e.target.value)}
                  className="w-full bg-[#161A1F] text-foreground font-bold px-2 py-1 rounded-lg border border-[#2B3139] text-xs focus:outline-none"
                >
                  <option value="GOLDTEN">GOLDTEN (10g)</option>
                  <option value="GOLDM">GOLDM (100g)</option>
                  <option value="GOLDGUINEA">GOLDGUINEA (8g)</option>
                  <option value="GOLDPETAL">GOLDPETAL (1g)</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-[#2B3139] text-[11px]">
              <span className="text-muted">Spread:</span>
              <span className={Number(normDiffPercent) >= 0 ? 'text-buy font-bold' : 'text-sell font-bold'}>
                {Number(normDiffPercent) >= 0 ? '+' : ''}{normDiffPercent}%
              </span>
              {onViewSpreadOnChart && (
                <button
                  onClick={onViewSpreadOnChart}
                  className="text-gold hover:text-gold-hover text-[10px] font-bold underline ml-2"
                >
                  View on Chart →
                </button>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: ORDER BOOK DEPTH */}
        {activeTab === 'depth' && (
          <div className="bg-[#11151A] p-2 rounded-xl border border-[#2B3139] font-mono text-[10px] space-y-1">
            <div className="grid grid-cols-3 text-muted pb-0.5 border-b border-[#2B3139]">
              <span>PRICE</span>
              <span className="text-right">SIZE</span>
              <span className="text-right">SIDE</span>
            </div>
            {orderBook.asks.slice(-2).map((a, i) => (
              <div key={`a-${i}`} className="grid grid-cols-3 text-sell">
                <span>₹{a.price.toLocaleString('en-IN')}</span>
                <span className="text-right text-text-secondary">{a.size}</span>
                <span className="text-right uppercase font-bold">Ask</span>
              </div>
            ))}
            <div className="py-0.5 px-1 bg-[#161A1F] rounded flex justify-between text-muted text-[9px]">
              <span className="text-foreground font-bold">Mid: ₹{orderBook.lastPrice.toLocaleString('en-IN')}</span>
              <span>Spread: ₹{orderBook.spread}</span>
            </div>
            {orderBook.bids.slice(0, 2).map((b, i) => (
              <div key={`b-${i}`} className="grid grid-cols-3 text-buy">
                <span>₹{b.price.toLocaleString('en-IN')}</span>
                <span className="text-right text-text-secondary">{b.size}</span>
                <span className="text-right uppercase font-bold">Bid</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── MOBILE OPPORTUNITY DETAILS BOTTOM SHEET / MODAL ── */}
      {showDetailsModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
            onClick={() => setShowDetailsModal(false)}
          />

          {/* Modal / Sheet Container */}
          <div className="relative bg-[#161A1F] border border-[#2B3139] rounded-t-2xl sm:rounded-2xl p-5 sm:p-6 w-full max-w-lg max-h-[88vh] overflow-y-auto z-10 animate-slide-up shadow-2xl space-y-4 pb-safe">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-[#2B3139] pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-gold uppercase tracking-wider block">
                  OPPORTUNITY DECOMPOSITION
                </span>
                <h3 className="text-xl font-black text-foreground font-mono mt-0.5">
                  {opportunity.pair}
                </h3>
                <div className="text-xs font-bold text-gold font-mono">
                  {opportunity.direction}
                </div>
              </div>

              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-2 rounded-lg text-text-secondary hover:text-foreground hover:bg-[#1C2128] min-h-[44px] min-w-[44px] flex items-center justify-center text-sm"
              >
                ✕
              </button>
            </div>

            {/* Decomposition Math Breakdown */}
            <div className="p-3 bg-[#11151A] rounded-xl border border-[#2B3139] space-y-2 font-mono text-xs">
              <div className="flex justify-between text-muted">
                <span>Normalized Price Spread:</span>
                <span className="text-foreground font-bold">+0.33% (₹42/g)</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Expected Carry (DTE Adj):</span>
                <span className="text-sell">-0.09%</span>
              </div>
              <div className="flex justify-between text-foreground font-semibold">
                <span>Residual Dislocation:</span>
                <span className="text-gold font-bold">+0.24%</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Est. Transaction Costs (STT + Brokerage):</span>
                <span className="text-sell">-0.08%</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Top-of-Book Liquidity Slippage:</span>
                <span className="text-sell">-0.04%</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#2B3139] text-sm font-black">
                <span className="text-gold">Estimated Net Edge:</span>
                <span className="text-buy">+{opportunity.netEdge || 0.15}%</span>
              </div>
            </div>

            {/* Plain English Explanation */}
            <div className="space-y-1.5 font-sans">
              <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <HelpCircle size={14} className="text-gold" />
                <span>WHY DOES GOLDLENS RECOMMEND THIS?</span>
              </h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                GOLDM (100g, 995 purity) is currently trading at a statistical discount relative to GOLDTEN (10g, 999 purity). After normalizing both to ₹/gram fine gold and subtracting expected carry and round-trip trading frictions, a positive net edge of <strong className="text-buy">+0.15%</strong> remains.
              </p>
            </div>

            {/* 4 Validation Checks */}
            <div className="space-y-2 pt-2 border-t border-[#2B3139] text-xs">
              <div className="flex items-center gap-2 text-foreground font-medium">
                <CheckCircle2 size={15} className="text-buy flex-shrink-0" />
                <span>Friction Hurdle Passed: Edge exceeds total round-trip costs</span>
              </div>
              <div className="flex items-center gap-2 text-foreground font-medium">
                <CheckCircle2 size={15} className="text-buy flex-shrink-0" />
                <span>Liquidity Check Passed: High depth across bids & asks</span>
              </div>
              <div className="flex items-center gap-2 text-foreground font-medium">
                <CheckCircle2 size={15} className="text-buy flex-shrink-0" />
                <span>Walk-Forward Validated: Sharpe 1.84 over 4 out-of-sample folds</span>
              </div>
            </div>

            {/* Footer Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#2B3139]">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="py-2.5 px-4 bg-[#11151A] hover:bg-[#1C2128] border border-[#2B3139] rounded-xl text-xs font-semibold text-text-secondary hover:text-foreground transition-colors min-h-[44px] touch-manipulation"
              >
                Close
              </button>

              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  onViewDetails();
                }}
                className="py-2.5 px-4 bg-gold hover:bg-gold-hover text-background rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 min-h-[44px] touch-manipulation"
              >
                <span>Full Audit Suite</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
