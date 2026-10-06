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
    <div className="h-10 bg-[#0B0E11] border-b border-[#2B3139] px-4 flex items-center justify-between select-none overflow-x-auto text-xs z-30">
      <div className="flex items-center gap-1.5 sm:gap-4 w-full justify-start sm:justify-center">
        {instruments.map((item) => {
          const isSelected = item.symbol === selectedSymbol;
          const isUp = item.change >= 0;

          return (
            <button
              key={item.symbol}
              onClick={() => onSelectSymbol(item.symbol)}
              className={`flex items-center gap-2.5 px-3 py-1 rounded-md transition-all ${
                isSelected
                  ? 'bg-[#161A1F] border border-gold/40 text-gold shadow-sm'
                  : 'hover:bg-[#161A1F]/70 text-text-secondary hover:text-foreground'
              }`}
            >
              <span className={`font-bold font-mono text-xs ${isSelected ? 'text-gold' : 'text-foreground'}`}>
                {item.symbol}
              </span>

              <span className="font-mono tabular-nums text-foreground font-semibold">
                ₹{item.price.toLocaleString('en-IN')}
              </span>

              <span
                className={`font-mono tabular-nums text-[11px] font-bold flex items-center ${
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
