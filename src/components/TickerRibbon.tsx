'use client';

import React from 'react';

interface TickerRibbonProps {
  selectedSymbol: string;
  onSelectSymbol: (symbol: string) => void;
  priceTickers: Record<string, { price: number; change: number; normalized: number }>;
}

export function TickerRibbon({
  selectedSymbol,
  onSelectSymbol,
  priceTickers,
}: TickerRibbonProps) {
  const instruments = [
    {
      symbol: 'GOLDM',
      expiry: '05 NOV',
      fullName: 'Gold Mini (100g)',
      price: priceTickers['GOLDM']?.price || 149921,
      change: priceTickers['GOLDM']?.change || 1.07,
    },
    {
      symbol: 'GOLDTEN',
      expiry: '30 OCT',
      fullName: 'Gold Ten (10g)',
      price: priceTickers['GOLDTEN']?.price || 150279,
      change: priceTickers['GOLDTEN']?.change || 1.07,
    },
    {
      symbol: 'GOLDGUINEA',
      expiry: '30 OCT',
      fullName: 'Gold Guinea (8g)',
      price: priceTickers['GOLDGUINEA']?.price || 120671,
      change: priceTickers['GOLDGUINEA']?.change || 1.05,
    },
    {
      symbol: 'GOLDPETAL',
      expiry: '30 OCT',
      fullName: 'Gold Petal (1g)',
      price: priceTickers['GOLDPETAL']?.price || 15083,
      change: priceTickers['GOLDPETAL']?.change || 1.02,
    },
  ];

  return (
    <div className="w-full bg-[#0B0E11] border-b border-[#2B3139] px-3 sm:px-5 py-2 select-none">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 w-full">
        {instruments.map((item) => {
          const isSelected = item.symbol === selectedSymbol;
          const isUp = item.change >= 0;

          return (
            <button
              key={item.symbol}
              onClick={() => onSelectSymbol(item.symbol)}
              className={`flex flex-col justify-center px-3 py-1.5 rounded-xl transition-all touch-manipulation min-h-[44px] text-left border ${
                isSelected
                  ? 'bg-[#161A1F] border-gold text-gold shadow-md ring-1 ring-gold/30'
                  : 'bg-[#11151A] border-[#2B3139]/80 hover:bg-[#161A1F] hover:border-[#383F48] text-text-secondary hover:text-foreground'
              }`}
            >
              {/* Top: Symbol & Expiry */}
              <div className="flex items-center justify-between gap-1 mb-0.5">
                <span className={`font-mono font-bold text-xs tracking-wide ${isSelected ? 'text-gold' : 'text-foreground'}`}>
                  {item.symbol}
                </span>
                <span className="text-[10px] text-muted font-mono bg-[#0B0E11] px-1.5 py-0.2 rounded border border-[#2B3139]">
                  {item.expiry}
                </span>
              </div>

              {/* Bottom: Price & Change */}
              <div className="flex items-baseline justify-between gap-1 font-mono">
                <span className="tabular-nums text-foreground font-bold text-xs sm:text-sm">
                  ₹{item.price.toLocaleString('en-IN')}
                </span>

                <span
                  className={`tabular-nums text-[11px] font-bold ${
                    isUp ? 'text-buy' : 'text-sell'
                  }`}
                >
                  {isUp ? '+' : ''}
                  {item.change.toFixed(2)}%
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
