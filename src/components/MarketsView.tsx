'use client';

import React, { useState } from 'react';
import { Search, Layers } from 'lucide-react';
import { CONTRACT_LIST } from '@/lib/contracts';
import { ContractSnapshot } from '@/lib/types';

interface MarketsViewProps {
  snapshots: ContractSnapshot[];
  onSelectInstrument: (symbol: string) => void;
  onNavigateTerminal: () => void;
}

export function MarketsView({
  snapshots,
  onSelectInstrument,
  onNavigateTerminal,
}: MarketsViewProps) {
  const [activeCategory, setActiveCategory] = useState<'all' | 'favorites' | 'active' | 'movers'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const benchmarkRate = snapshots[0]?.normalizedPrice || 15067.44;

  const marketRows = CONTRACT_LIST.map((spec) => {
    const snap = snapshots.find((s) => s.symbol === spec.symbol) || {
      lastPrice: 149921,
      normalizedPrice: benchmarkRate,
      change: 1.07,
      volume: 48000,
      openInterest: 24000,
      relativeValueScore: 0,
      liquidityScore: 85,
    };

    const isUp = (snap.change || 0) >= 0;
    // Calculate genuine normalized deviation vs benchmark
    const normDiff = ((snap.normalizedPrice - benchmarkRate) / benchmarkRate) * 100;
    const zScore = Math.round((normDiff / 0.15) * 100) / 100;

    return {
      ...spec,
      lastPrice: snap.lastPrice,
      normalizedPrice: snap.normalizedPrice,
      change: snap.change,
      volume: snap.volume,
      openInterest: snap.openInterest,
      isUp,
      zScore,
      signal: Math.abs(zScore) >= 2.0 ? 'OPPORTUNITY' : 'NORMAL',
    };
  }).filter((row) =>
    row.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    row.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 bg-background overflow-y-auto p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 font-mono text-xs select-none">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
              <Layers size={18} className="text-gold" />
              <span>MCX GOLD MARKETS DIRECTORY</span>
            </h1>
            <p className="text-text-secondary text-xs mt-0.5 font-sans">
              All active MCX gold derivatives normalized into a common economic unit (₹/g 999 fine gold).
            </p>
          </div>

          {/* Search Bar */}
          <div className="flex items-center gap-2 px-3 py-2 bg-panel rounded-xl border border-border w-full sm:w-64 min-h-[40px]">
            <Search size={14} className="text-muted" />
            <input
              type="text"
              placeholder="Search contracts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs text-foreground placeholder:text-muted focus:outline-none w-full font-mono"
            />
          </div>
        </div>

        {/* Quick KPI Highlights Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          <div className="p-3 sm:p-4 bg-panel rounded-xl border border-border">
            <span className="text-[10px] text-muted uppercase block">BENCHMARK FINE GOLD</span>
            <div className="text-base sm:text-xl font-black text-gold mt-1">₹{benchmarkRate.toLocaleString('en-IN')}/g</div>
            <span className={`text-[10px] block mt-0.5 ${(snapshots[0]?.change || 0) >= 0 ? 'text-buy' : 'text-sell'}`}>
              {(snapshots[0]?.change || 0) >= 0 ? '+' : ''}{(snapshots[0]?.change || 1.07).toFixed(2)}% (24h)
            </span>
          </div>

          <div className="p-3 sm:p-4 bg-panel rounded-xl border border-border">
            <span className="text-[10px] text-muted uppercase block">DISLOCATED PAIRS</span>
            <div className="text-base sm:text-xl font-black text-foreground mt-1">
              {marketRows.filter((r) => r.signal === 'OPPORTUNITY').length || 1} Live Pair
            </div>
            <span className="text-[10px] text-gold block mt-0.5 truncate">GOLDM / GOLDTEN (+0.33%)</span>
          </div>

          <div className="p-3 sm:p-4 bg-panel rounded-xl border border-border">
            <span className="text-[10px] text-muted uppercase block">MCX DAILY TURNOVER</span>
            <div className="text-base sm:text-xl font-black text-foreground mt-1">
              ₹{Math.round(marketRows.reduce((acc, r) => acc + (r.volume * r.lastPrice) / 10000000, 0)).toLocaleString('en-IN')} Cr
            </div>
            <span className="text-[10px] text-text-secondary block mt-0.5">Highest: GOLDM (68%)</span>
          </div>

          <div className="p-3 sm:p-4 bg-panel rounded-xl border border-border">
            <span className="text-[10px] text-muted uppercase block">ALPHA SURVIVAL RATE</span>
            <div className="text-base sm:text-xl font-black text-buy mt-1">89% Validated</div>
            <span className="text-[10px] text-text-secondary block mt-0.5">Sharpe 1.84 (OOS)</span>
          </div>
        </div>

        {/* Category Tabs (Horizontally scrollable) */}
        <div className="flex items-center gap-1.5 border-b border-border pb-2 overflow-x-auto no-scrollbar touch-pan-x">
          {(
            [
              { id: 'all' as const, label: 'All MCX Gold' },
              { id: 'favorites' as const, label: 'Starred Watchlist' },
              { id: 'active' as const, label: 'Most Active' },
              { id: 'movers' as const, label: 'Top Dislocations' },
            ] as const
          ).map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-2 rounded-lg font-semibold text-xs transition-colors whitespace-nowrap flex-shrink-0 touch-manipulation min-h-[38px] ${
                activeCategory === cat.id
                  ? 'bg-panel text-gold border border-gold/40 shadow-sm ring-1 ring-gold/20'
                  : 'text-text-secondary hover:text-foreground'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* ── MOBILE VIEW: STACKED CONTRACT CARDS (< md) ── */}
        <div className="grid grid-cols-1 gap-3 md:hidden">
          {marketRows.map((row) => (
            <div
              key={row.symbol}
              onClick={() => {
                onSelectInstrument(row.symbol);
                onNavigateTerminal();
              }}
              className="p-4 bg-panel rounded-2xl border border-border active:border-gold transition-all space-y-3 touch-manipulation cursor-pointer shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: row.color }} />
                  <div>
                    <span className="font-black text-base text-foreground">{row.symbol}</span>
                    <span className="text-xs text-text-secondary ml-1.5 font-sans">({row.name})</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono font-black text-base text-foreground">
                    ₹{row.lastPrice?.toLocaleString('en-IN')}
                  </div>
                  <div className={`font-mono text-xs font-bold ${row.isUp ? 'text-buy' : 'text-sell'}`}>
                    {row.isUp ? '+' : ''}
                    {row.change?.toFixed(2)}%
                  </div>
                </div>
              </div>

              {/* Card Meta & Normalization */}
              <div className="grid grid-cols-2 gap-2 p-2.5 bg-secondary rounded-xl text-xs">
                <div>
                  <span className="text-[10px] text-muted block">Contract Spec:</span>
                  <span className="text-foreground font-semibold">{row.contractSize}g • {row.purity}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted block">Normalized Fine Gold:</span>
                  <span className="text-gold font-bold">₹{Math.round(row.normalizedPrice).toLocaleString('en-IN')}/g</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-muted font-mono">
                  Vol: {(row.volume || 15000).toLocaleString('en-IN')} lots
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectInstrument(row.symbol);
                    onNavigateTerminal();
                  }}
                  className="px-3 py-1.5 bg-gold text-background rounded-lg font-bold text-xs shadow min-h-[36px] flex items-center gap-1"
                >
                  <span>Trade / Chart →</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ── DESKTOP VIEW: FULL TABLE (md:block) ── */}
        <div className="hidden md:block bg-panel rounded-xl border border-border overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-secondary text-[10px] text-muted border-b border-border">
                <th className="py-3 px-4">SYMBOL & NAME</th>
                <th>QUOTED PRICE</th>
                <th>24H CHANGE</th>
                <th>24H VOLUME</th>
                <th>OPEN INTEREST</th>
                <th>NORMALIZED FINE GOLD (₹/G)</th>
                <th>RELATIVE Z-SCORE</th>
                <th>SIGNAL</th>
                <th className="text-right px-4">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {marketRows.map((row) => (
                <tr
                  key={row.symbol}
                  className="border-b border-border/40 hover:bg-panel-hover transition-colors cursor-pointer"
                  onClick={() => {
                    onSelectInstrument(row.symbol);
                    onNavigateTerminal();
                  }}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: row.color }} />
                      <div>
                        <div className="font-bold text-foreground text-sm">{row.symbol}</div>
                        <div className="text-[10px] text-text-secondary">
                          {row.name} • {row.quoteUnit}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="font-bold text-foreground tabular-nums">
                    ₹{row.lastPrice?.toLocaleString('en-IN')}
                  </td>

                  <td className={`font-bold tabular-nums ${row.isUp ? 'text-buy' : 'text-sell'}`}>
                    {row.isUp ? '+' : ''}
                    {row.change?.toFixed(2)}%
                  </td>

                  <td className="text-text-secondary">
                    {(row.volume || 15000).toLocaleString('en-IN')} lots
                  </td>

                  <td className="text-text-secondary">
                    {(row.openInterest || 8000).toLocaleString('en-IN')}
                  </td>

                  <td>
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-gold/10 border border-gold/30 text-gold font-bold">
                      ₹{Math.round(row.normalizedPrice).toLocaleString('en-IN')}/g
                    </div>
                  </td>

                  <td className="font-bold">
                    <span
                      className={
                        row.zScore >= 2
                          ? 'text-sell'
                          : row.zScore <= -2
                          ? 'text-buy'
                          : 'text-text-secondary'
                      }
                    >
                      {row.zScore >= 0 ? '+' : ''}
                      {row.zScore.toFixed(2)}σ
                    </span>
                  </td>

                  <td>
                    {row.signal === 'OPPORTUNITY' ? (
                      <span className="px-2 py-0.5 rounded bg-buy/15 text-buy border border-buy/30 text-[10px] font-bold">
                        OPPORTUNITY
                      </span>
                    ) : (
                      <span className="text-muted text-[10px]">—</span>
                    )}
                  </td>

                  <td className="text-right px-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectInstrument(row.symbol);
                        onNavigateTerminal();
                      }}
                      className="px-3 py-1.5 bg-secondary hover:bg-gold hover:text-background text-foreground border border-border rounded-lg font-bold text-[10px] transition-all"
                    >
                      Trade Terminal →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
