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
      label: 'Gold Mini (100g)',
      price: priceTickers['GOLDM']?.price || 128411,
      change: priceTickers['GOLDM']?.change || 0.40,
    },
    {
      symbol: 'GOLDTEN',
      label: 'Gold Ten (10g)',
      price: priceTickers['GOLDTEN']?.price || 129180,
      change: priceTickers['GOLDTEN']?.change || 0.38,
    },
    {
      symbol: 'GOLDGUINEA',
      label: 'Gold Guinea (8g)',
      price: priceTickers['GOLDGUINEA']?.price || 103188,
      change: priceTickers['GOLDGUINEA']?.change || 0.42,
    },
    {
      symbol: 'GOLDPETAL',
      label: 'Gold Petal (1g)',
      price: priceTickers['GOLDPETAL']?.price || 12910,
      change: priceTickers['GOLDPETAL']?.change || 0.35,
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
              className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg transition-all flex-shrink-0 touch-manipulation min-h-[36px] ${
                isSelected
                  ? 'bg-[#161A1F] border border-gold/50 text-gold shadow-sm ring-1 ring-gold/20'
                  : 'bg-[#11151A]/60 border border-[#2B3139]/60 hover:bg-[#161A1F] text-text-secondary hover:text-foreground'
              }`}
            >
              <span className={`font-bold font-mono text-[11px] sm:text-xs ${isSelected ? 'text-gold' : 'text-foreground'}`}>
                {item.symbol}
              </span>

              <span className="font-mono tabular-nums text-foreground font-semibold text-[11px] sm:text-xs">
                ₹{item.price.toLocaleString('en-IN')}
              </span>

              <span
                className={`font-mono tabular-nums text-[10px] sm:text-[11px] font-bold ${
                  isUp ? 'text-buy' : 'text-sell'
                }`}
              >
                {isUp ? '+' : ''}
                {item.change.toFixed(2)}%
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
