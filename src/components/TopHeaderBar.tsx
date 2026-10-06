'use client';

import React from 'react';
import { Bell, User } from 'lucide-react';
import { TickerRibbon } from './TickerRibbon';

interface TopHeaderBarProps {
  selectedSymbol: string;
  onSelectSymbol: (symbol: string) => void;
  priceTickers: Record<string, { price: number; change: number; normalized: number }>;
}

export function TopHeaderBar({
  selectedSymbol,
  onSelectSymbol,
  priceTickers,
}: TopHeaderBarProps) {
  return (
    <header className="h-12 bg-[#11151A] border-b border-[#2B3139] flex items-center justify-between px-4 select-none flex-shrink-0 z-30 text-xs">
      {/* LEFT: 4-Contract Quick Ticker */}
      <div className="flex-1 overflow-x-auto flex items-center">
        <TickerRibbon
          selectedSymbol={selectedSymbol}
          onSelectSymbol={onSelectSymbol}
          priceTickers={priceTickers}
        />
      </div>

      {/* RIGHT: Notifications & User Desk */}
      <div className="flex items-center gap-3 pl-3 border-l border-[#2B3139] flex-shrink-0">
        <button
          className="relative p-1.5 text-text-secondary hover:text-foreground hover:bg-[#161A1F] rounded-lg transition-colors"
          title="Notifications"
        >
          <Bell size={15} />
          <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-sell text-white font-mono font-bold text-[9px] rounded-full flex items-center justify-center">
            1
          </span>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#161A1F] border border-[#2B3139] flex items-center justify-center text-text-secondary">
            <User size={12} />
          </div>
          <span className="hidden md:inline font-mono text-[11px] text-text-secondary font-semibold">
            QUANT_DESK
          </span>
        </div>
      </div>
    </header>
  );
}
