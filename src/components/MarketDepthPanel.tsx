'use client';

import React, { useState } from 'react';
import { Layers, Activity, BarChart2, Info, ArrowRight } from 'lucide-react';
import { OrderBookState, ContractSnapshot } from '@/lib/types';
import { CONTRACT_REGISTRY, CONTRACT_SYMBOLS } from '@/lib/contracts';

interface MarketDepthPanelProps {
  selectedSymbol: string;
  onSelectSymbol: (symbol: string) => void;
  orderBook: OrderBookState;
  allSnapshots: ContractSnapshot[];
  zScores: Record<string, number>;
}

export function MarketDepthPanel({
  selectedSymbol,
  onSelectSymbol,
  orderBook,
  allSnapshots,
  zScores,
}: MarketDepthPanelProps) {
  const [activeTab, setActiveTab] = useState<'orderbook' | 'cross' | 'depth'>('orderbook');

  const spec = CONTRACT_REGISTRY[selectedSymbol] || CONTRACT_REGISTRY['GOLDM'];

  return (
    <div className="h-full bg-secondary border-r border-border flex flex-col select-none text-xs">
      {/* Panel Header & Tabs */}
      <div className="h-9 bg-panel border-b border-border flex items-center justify-between px-2.5 flex-shrink-0">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('orderbook')}
            className={`px-2 py-1 rounded text-[11px] font-bold tracking-wide transition-colors ${
              activeTab === 'orderbook'
                ? 'bg-secondary text-foreground border border-border/80'
                : 'text-text-secondary hover:text-foreground'
            }`}
          >
            ORDER BOOK
          </button>
          <button
            onClick={() => setActiveTab('cross')}
            className={`px-2 py-1 rounded text-[11px] font-bold tracking-wide transition-colors ${
              activeTab === 'cross'
                ? 'bg-secondary text-gold border border-border/80'
                : 'text-text-secondary hover:text-foreground'
            }`}
          >
            CROSS-CONTRACT
          </button>
          <button
            onClick={() => setActiveTab('depth')}
            className={`px-2 py-1 rounded text-[11px] font-bold tracking-wide transition-colors ${
              activeTab === 'depth'
                ? 'bg-secondary text-foreground border border-border/80'
                : 'text-text-secondary hover:text-foreground'
            }`}
          >
            DEPTH
          </button>
        </div>

        <span className="text-[9px] font-mono text-muted uppercase">SIMULATED</span>
      </div>

      {/* TAB 1: ORDER BOOK */}
      {activeTab === 'orderbook' && (
        <div className="flex-1 flex flex-col p-2 overflow-hidden font-mono">
          {/* Column Headers */}
          <div className="grid grid-cols-3 text-[10px] text-muted pb-1.5 border-b border-border/50">
            <span className="text-left">PRICE (₹)</span>
            <span className="text-right">SIZE</span>
            <span className="text-right">TOTAL</span>
          </div>

          {/* ASKS (Sell Orders - Top down in descending order) */}
          <div className="flex-1 flex flex-col justify-end space-y-0.5 overflow-hidden py-1">
            {orderBook.asks.slice(-6).map((ask, idx) => (
              <div
                key={`ask-${idx}`}
                className="relative grid grid-cols-3 py-0.5 px-1 text-[11px] tabular-nums hover:bg-panel-hover rounded cursor-pointer group"
                style={
                  {
                    '--depth': `${ask.depthPercent}%`,
                  } as React.CSSProperties
                }
              >
                {/* Visual Depth Bar */}
                <div
                  className="absolute inset-y-0 right-0 bg-sell/10 pointer-events-none rounded-r"
                  style={{ width: `${ask.depthPercent}%` }}
                />
                <span className="text-sell font-semibold z-10">{ask.price.toLocaleString('en-IN')}</span>
                <span className="text-right text-foreground z-10">{ask.size.toLocaleString('en-IN')}</span>
                <span className="text-right text-text-secondary z-10">{ask.total.toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>

          {/* MID MARKET SPREAD BANNER */}
          <div className="py-2 my-1 px-2 bg-panel rounded border border-border flex items-center justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm font-black text-foreground tabular-nums">
                ₹{orderBook.lastPrice?.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-muted">
                ≈ ₹{Math.round(orderBook.normalizedPrice || 12842)}/g
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-text-secondary">
                Spread: <span className="text-foreground font-semibold">₹{orderBook.spread || 20}</span> (
                {orderBook.spreadPercent || 0.02}%)
              </span>
            </div>
          </div>

          {/* BIDS (Buy Orders - Ascending order from top) */}
          <div className="flex-1 space-y-0.5 overflow-hidden py-1">
            {orderBook.bids.slice(0, 6).map((bid, idx) => (
              <div
                key={`bid-${idx}`}
                className="relative grid grid-cols-3 py-0.5 px-1 text-[11px] tabular-nums hover:bg-panel-hover rounded cursor-pointer group"
              >
                {/* Visual Depth Bar */}
                <div
                  className="absolute inset-y-0 right-0 bg-buy/10 pointer-events-none rounded-r"
                  style={{ width: `${bid.depthPercent}%` }}
                />
                <span className="text-buy font-semibold z-10">{bid.price.toLocaleString('en-IN')}</span>
                <span className="text-right text-foreground z-10">{bid.size.toLocaleString('en-IN')}</span>
                <span className="text-right text-text-secondary z-10">{bid.total.toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>

          {/* Bottom Depth Aggregation */}
          <div className="pt-2 border-t border-border/50 text-[10px] flex justify-between text-muted">
            <span>Bids 52.4%</span>
            <div className="w-24 h-1.5 bg-sell/40 rounded-full overflow-hidden flex self-center">
              <div className="bg-buy h-full" style={{ width: '52.4%' }} />
            </div>
            <span>Asks 47.6%</span>
          </div>
        </div>
      )}

      {/* TAB 2: CROSS-CONTRACT LIVE MATRIX */}
      {activeTab === 'cross' && (
        <div className="flex-1 p-2 overflow-y-auto font-mono flex flex-col space-y-2">
          <div className="text-[10px] text-muted uppercase tracking-wider mb-1">
            Normalized Fine Gold (₹/g)
          </div>

          {CONTRACT_SYMBOLS.map((sym) => {
            const contract = CONTRACT_REGISTRY[sym];
            const snap = allSnapshots.find((s) => s.symbol === sym) || {
              lastPrice: 128420,
              normalizedPrice: 12842,
              change: 0.42,
            };
            const isSelected = sym === selectedSymbol;
            const zScore = zScores[sym] !== undefined ? zScores[sym] : sym === 'GOLDTEN' ? 2.41 : sym === 'GOLDPETAL' ? -0.21 : 0.12;
            const isDislocated = Math.abs(zScore) >= 2.0;

            return (
              <button
                key={sym}
                onClick={() => onSelectSymbol(sym)}
                className={`w-full p-2 rounded-lg border text-left transition-all ${
                  isSelected
                    ? 'bg-panel-hover border-gold/50 shadow-sm'
                    : 'bg-panel border-border hover:border-border-light'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: contract.color }} />
                    <span className={`font-bold text-xs ${isSelected ? 'text-gold' : 'text-foreground'}`}>
                      {sym}
                    </span>
                    <span className="text-[10px] text-muted">({contract.contractSize}g)</span>
                  </div>
                  {isDislocated && (
                    <span className="px-1.5 py-0.2 bg-gold/20 text-gold border border-gold/40 rounded text-[9px] font-bold animate-pulse">
                      DISLOCATION
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-border/40">
                  <div>
                    <span className="text-[9px] text-muted block">NORMALIZED</span>
                    <span className="font-bold text-foreground">
                      ₹{Math.round(snap.normalizedPrice || 12842)}/g
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-muted block">Z-SCORE</span>
                    <span
                      className={`font-bold ${
                        zScore >= 2
                          ? 'text-sell'
                          : zScore <= -2
                          ? 'text-buy'
                          : 'text-text-secondary'
                      }`}
                    >
                      {zScore >= 0 ? '+' : ''}
                      {zScore.toFixed(2)}σ
                    </span>
                  </div>
                </div>
              </button>
            );
          })}

          <div className="mt-auto p-2 bg-panel rounded border border-border/60 text-[10px] text-muted">
            <span className="text-gold font-semibold block mb-0.5">Quantitative Insight:</span>
            Raw prices vary from ₹12,910 to ₹1,28,420, but economic values converge within ±0.33% of ₹12,842/g.
          </div>
        </div>
      )}

      {/* TAB 3: LIQUIDITY DEPTH CHART */}
      {activeTab === 'depth' && (
        <div className="flex-1 p-3 flex flex-col justify-between font-mono">
          <div>
            <div className="text-[11px] font-bold text-foreground mb-1">LIQUIDITY DEPTH</div>
            <p className="text-[10px] text-muted mb-3">Estimated executable liquidity curve</p>

            {/* Simulated depth curve bars */}
            <div className="space-y-1.5">
              <div className="text-[10px] text-buy font-semibold flex justify-between">
                <span>BID CUMULATIVE</span>
                <span>₹1.42 Cr</span>
              </div>
              <div className="w-full bg-panel h-3 rounded overflow-hidden flex">
                <div className="bg-buy/70 h-full" style={{ width: '68%' }} />
              </div>

              <div className="text-[10px] text-sell font-semibold flex justify-between pt-2">
                <span>ASK CUMULATIVE</span>
                <span>₹1.28 Cr</span>
              </div>
              <div className="w-full bg-panel h-3 rounded overflow-hidden flex justify-end">
                <div className="bg-sell/70 h-full" style={{ width: '58%' }} />
              </div>
            </div>
          </div>

          <div className="p-2 bg-panel rounded border border-border text-[10px] text-muted">
            <div className="text-foreground font-semibold mb-1">Slippage Estimates:</div>
            <div className="flex justify-between py-0.5">
              <span>₹10,00,000 Lot:</span>
              <span className="text-buy font-bold">0.02%</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span>₹50,00,000 Lot:</span>
              <span className="text-text-secondary font-bold">0.05%</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span>₹1,00,00,000 Lot:</span>
              <span className="text-sell font-bold">0.11%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
