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

  const marketRows = CONTRACT_LIST.map((spec) => {
    const snap = snapshots.find((s) => s.symbol === spec.symbol) || {
      lastPrice: 128420,
      normalizedPrice: 12842,
      change: 0.42,
      volume: 48000,
      openInterest: 24000,
    };

    const isUp = (snap.change || 0) >= 0;
    const zScore = spec.symbol === 'GOLDTEN' ? 2.41 : spec.symbol === 'GOLDPETAL' ? -0.21 : 0.12;

    return {
      ...spec,
      lastPrice: snap.lastPrice,
      normalizedPrice: snap.normalizedPrice,
      change: snap.change,
      volume: snap.volume,
      openInterest: snap.openInterest,
      isUp,
      zScore,
      signal: spec.symbol === 'GOLDTEN' ? 'OPPORTUNITY' : 'NORMAL',
    };
  }).filter((row) =>
    row.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    row.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 bg-background overflow-y-auto p-6 font-mono text-xs select-none">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
          <div>
            <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Layers size={20} className="text-gold" />
              MCX GOLD MARKETS OVERVIEW
            </h1>
            <p className="text-text-secondary text-xs mt-1 font-sans">
              All active MCX gold derivatives normalized into a common economic unit (₹/g 999 fine gold).
            </p>
          </div>

          {/* Search & Refresh */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-panel rounded border border-border">
              <Search size={14} className="text-muted" />
              <input
                type="text"
                placeholder="Search contracts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-xs text-foreground placeholder:text-muted focus:outline-none w-48 font-mono"
              />
            </div>
            <button
              onClick={onNavigateTerminal}
              className="px-4 py-2 bg-gold hover:bg-gold-hover text-background font-bold rounded-lg text-xs transition-colors shadow"
            >
              Open Dashboard →
            </button>
          </div>
        </div>

        {/* Quick KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-panel rounded-lg border border-border">
            <span className="text-[10px] text-muted uppercase block">FAIR FINE GOLD BENCHMARK</span>
            <div className="text-xl font-black text-gold mt-1">₹12,842.10/g</div>
            <span className="text-[10px] text-buy block mt-1">+0.42% (24h)</span>
          </div>

          <div className="p-4 bg-panel rounded-lg border border-border">
            <span className="text-[10px] text-muted uppercase block">DISLOCATED PAIRS</span>
            <div className="text-xl font-black text-foreground mt-1">1 Live Pair</div>
            <span className="text-[10px] text-gold block mt-1">GOLDM / GOLDTEN (+0.33%)</span>
          </div>

          <div className="p-4 bg-panel rounded-lg border border-border">
            <span className="text-[10px] text-muted uppercase block">TOTAL MCX DAILY TURNOVER</span>
            <div className="text-xl font-black text-foreground mt-1">₹3,420 Cr</div>
            <span className="text-[10px] text-text-secondary block mt-1">Highest: GOLDM (68%)</span>
          </div>

          <div className="p-4 bg-panel rounded-lg border border-border">
            <span className="text-[10px] text-muted uppercase block">ALPHA SURVIVAL RATE</span>
            <div className="text-xl font-black text-buy mt-1">89% Validated</div>
            <span className="text-[10px] text-text-secondary block mt-1">Walk-Forward Sharpe 1.84</span>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 border-b border-border pb-2">
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
              className={`px-3 py-1.5 rounded font-semibold text-xs transition-colors ${
                activeCategory === cat.id
                  ? 'bg-panel text-gold border border-border'
                  : 'text-text-secondary hover:text-foreground'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Markets Table */}
        <div className="bg-panel rounded-lg border border-border overflow-hidden">
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
                      className="px-3 py-1 bg-secondary hover:bg-gold hover:text-background text-foreground border border-border rounded font-bold text-[10px] transition-all"
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
