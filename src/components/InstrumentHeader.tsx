'use client';

import React, { useState } from 'react';
import {
  Star, Search, ChevronDown, Check, ShieldCheck,
  Scale, Info, ArrowUpRight, ArrowDownRight, Layers
} from 'lucide-react';
import { CONTRACT_REGISTRY, CONTRACT_LIST } from '@/lib/contracts';
import { ContractSnapshot } from '@/lib/types';

interface InstrumentHeaderProps {
  symbol: string;
  onSelectSymbol: (symbol: string) => void;
  snapshot: ContractSnapshot;
  priceFlash: 'green' | 'red' | null;
}

export function InstrumentHeader({
  symbol,
  onSelectSymbol,
  snapshot,
  priceFlash,
}: InstrumentHeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isStarred, setIsStarred] = useState(false);

  const spec = CONTRACT_REGISTRY[symbol] || CONTRACT_REGISTRY['GOLDM'];
  const isUp = (snapshot.change || 0) >= 0;

  const filteredContracts = CONTRACT_LIST.filter(
    (c) =>
      c.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-panel border-b border-border px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs select-none z-20">
      {/* LEFT: Instrument Selector & Contract Identification */}
      <div className="flex items-center gap-4">
        {/* Dropdown Selector */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-2.5 py-1.5 bg-secondary hover:bg-panel-hover border border-border rounded font-mono font-bold text-sm text-foreground transition-all hover:border-border-light"
          >
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: spec.color }} />
            <span>{spec.symbol}</span>
            <span className="text-[11px] font-sans font-normal text-text-secondary hidden sm:inline">
              / MCX
            </span>
            <ChevronDown size={14} className="text-muted ml-0.5" />
          </button>

          {/* Selector Dropdown Modal */}
          {dropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-72 bg-secondary border border-border rounded-lg shadow-2xl p-2 z-50 animate-slide-up">
              {/* Search Bar */}
              <div className="flex items-center gap-2 px-2.5 py-1.5 bg-panel rounded border border-border mb-2">
                <Search size={13} className="text-muted" />
                <input
                  type="text"
                  placeholder="Search MCX contracts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-xs text-foreground placeholder:text-muted focus:outline-none w-full font-mono"
                  autoFocus
                />
              </div>

              {/* Contract List */}
              <div className="space-y-1 max-h-56 overflow-y-auto">
                {filteredContracts.map((contract) => (
                  <button
                    key={contract.symbol}
                    onClick={() => {
                      onSelectSymbol(contract.symbol);
                      setDropdownOpen(false);
                      setSearchQuery('');
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded text-left transition-colors ${
                      contract.symbol === symbol
                        ? 'bg-panel-hover text-gold'
                        : 'text-text-secondary hover:text-foreground hover:bg-panel'
                    }`}
                  >
                    <div>
                      <div className="font-mono font-bold text-xs text-foreground flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: contract.color }} />
                        {contract.symbol}
                      </div>
                      <div className="text-[10px] text-muted">
                        {contract.name} • {contract.quoteUnit}
                      </div>
                    </div>
                    <div className="text-right font-mono text-[11px]">
                      <div className="text-foreground">Purity: {contract.purity}</div>
                      <div className="text-text-secondary text-[10px]">Lot: {contract.contractSize}g</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Contract Full Name */}
        <div className="hidden md:block">
          <div className="text-[11px] font-semibold text-foreground">{spec.name}</div>
          <div className="text-[10px] text-muted font-mono">{spec.quoteUnit}</div>
        </div>

        {/* Watchlist Star */}
        <button
          onClick={() => setIsStarred(!isStarred)}
          className={`p-1 rounded hover:bg-panel-hover transition-colors ${
            isStarred ? 'text-gold' : 'text-muted hover:text-text-secondary'
          }`}
          title={isStarred ? 'Remove from Watchlist' : 'Add to Watchlist'}
        >
          <Star size={15} className={isStarred ? 'fill-gold' : ''} />
        </button>

        {/* Core Price with Live Tick Flash */}
        <div
          className={`flex items-baseline gap-2 px-2 py-0.5 rounded transition-all ${
            priceFlash === 'green' ? 'animate-flash-green' : priceFlash === 'red' ? 'animate-flash-red' : ''
          }`}
        >
          <span className="font-mono font-black text-xl tabular-nums text-foreground tracking-tight">
            ₹{snapshot.lastPrice?.toLocaleString('en-IN') || '1,28,420'}
          </span>
          <span
            className={`font-mono tabular-nums text-xs font-bold flex items-center ${
              isUp ? 'text-buy' : 'text-sell'
            }`}
          >
            {isUp ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
            {isUp ? '+' : ''}
            {(snapshot.change || 0.42).toFixed(2)}%
          </span>
        </div>
      </div>

      {/* CENTER & RIGHT: Quant Metrics Bar */}
      <div className="flex items-center flex-wrap gap-4 text-[11px] font-mono">
        {/* Normalized Fine Gold Price (Hero Spec) */}
        <div className="px-2.5 py-1 bg-gold/10 border border-gold/30 rounded flex items-center gap-1.5 text-gold">
          <Scale size={12} className="text-gold" />
          <span className="text-[10px] uppercase font-bold tracking-wider">Normalized:</span>
          <span className="font-extrabold text-xs">
            ₹{Math.round(snapshot.normalizedPrice || 12842).toLocaleString('en-IN')}/g
          </span>
          <span className="text-[9px] text-gold/70">(999 Fine Gold)</span>
        </div>

        {/* 24h High / Low */}
        <div className="hidden lg:block text-text-secondary">
          <span className="text-muted text-[10px] block">24H HIGH / LOW</span>
          <span className="text-foreground">₹{(snapshot.lastPrice * 1.004).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
          <span className="text-muted mx-1">/</span>
          <span className="text-foreground">₹{(snapshot.lastPrice * 0.993).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
        </div>

        {/* 24h Volume */}
        <div className="hidden xl:block text-text-secondary">
          <span className="text-muted text-[10px] block">24H VOLUME</span>
          <span className="text-foreground font-semibold">₹1.84 Cr</span>
          <span className="text-muted text-[10px] ml-1">({(snapshot.volume || 48000).toLocaleString('en-IN')} lots)</span>
        </div>

        {/* Open Interest */}
        <div className="hidden xl:block text-text-secondary">
          <span className="text-muted text-[10px] block">OPEN INTEREST</span>
          <span className="text-foreground font-semibold">{(snapshot.openInterest || 24000).toLocaleString('en-IN')}</span>
          <span className="text-buy text-[10px] ml-1">(+3.8%)</span>
        </div>

        {/* Expiry */}
        <div className="hidden sm:block text-text-secondary">
          <span className="text-muted text-[10px] block">EXPIRY (DTE)</span>
          <span className="text-foreground font-semibold">{snapshot.expiry || '30 Oct 2026'}</span>
          <span className="text-gold text-[10px] ml-1">({snapshot.daysToExpiry || 23}d)</span>
        </div>

        {/* Liquidity Tier */}
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-buy/10 border border-buy/20 text-buy text-[10px] font-bold uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-buy" />
          <span>LIQUIDITY: HIGH</span>
        </div>

        {/* Audit Ready Badge */}
        <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded bg-panel-sub border border-border text-text-secondary text-[10px] font-semibold">
          <ShieldCheck size={12} className="text-gold" />
          <span>AUDIT READY</span>
        </div>
      </div>
    </div>
  );
}
