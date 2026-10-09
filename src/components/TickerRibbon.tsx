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
      expiry: '05NOV2026',
      label: 'Gold Mini (100g)',
      price: priceTickers['GOLDM']?.price || 149921,
      change: priceTickers['GOLDM']?.change || 1.07,
    },
    {
      symbol: 'GOLDTEN',
      expiry: '30OCT2026',
      label: 'Gold Ten (10g)',
      price: priceTickers['GOLDTEN']?.price || 150279,
      change: priceTickers['GOLDTEN']?.change || 1.07,
    },
    {
      symbol: 'GOLDGUINEA',
      expiry: '30OCT2026',
      label: 'Gold Guinea (8g)',
      price: priceTickers['GOLDGUINEA']?.price || 120671,
      change: priceTickers['GOLDGUINEA']?.change || 1.05,
    },
    {
      symbol: 'GOLDPETAL',
      expiry: '30OCT2026',
      label: 'Gold Petal (1g)',
      price: priceTickers['GOLDPETAL']?.price || 15083,
      change: priceTickers['GOLDPETAL']?.change || 1.02,
    },
  ];

  return (
    <div className="w-full bg-[#0B0E11] border-b border-[#2B3139] px-2 sm:px-4 py-1.5 flex items-center select-none overflow-x-auto no-scrollbar touch-pan-x text-xs z-20">
      <div className="flex items-center gap-1.5 sm:gap-3 flex-nowrap min-w-max mx-auto sm:mx-0">
        {instruments.map((item) => {
          const isSelected = item.symbol === selectedSymbol;
          const isUp = item.change >= 0;

          return (
            <button
              key={item.symbol}
              onClick={() => onSelectSymbol(item.symbol)}
              className={`flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-xl transition-all flex-shrink-0 touch-manipulation min-h-[40px] text-left ${
                isSelected
                  ? 'bg-[#161A1F] border border-gold text-gold shadow-md ring-1 ring-gold/30'
                  : 'bg-[#11151A]/80 border border-[#2B3139]/80 hover:bg-[#161A1F] hover:border-[#383F48] text-text-secondary hover:text-foreground'
              }`}
            >
              <div className="flex items-center gap-1.5 justify-between">
                <span className={`font-bold font-mono text-[11px] sm:text-xs tracking-wider ${isSelected ? 'text-gold' : 'text-foreground'}`}>
                  {item.symbol}
                </span>
                <span className="text-[9px] text-muted font-mono bg-[#0B0E11] px-1 py-0.2 rounded border border-[#2B3139]">
                  {item.expiry}
                </span>
              </div>

              <div className="flex items-baseline gap-1.5">
                <span className="font-mono tabular-nums text-foreground font-bold text-[11px] sm:text-xs">
                  ₹{item.price.toLocaleString('en-IN')}.00
                </span>

                <span
                  className={`font-mono tabular-nums text-[10px] sm:text-[11px] font-bold ${
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
