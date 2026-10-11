'use client';

import React from 'react';

interface MarqueeStripProps {
  settlementDate: string;
}

export function MarqueeStrip({ settlementDate }: MarqueeStripProps) {
  const content = (
    <div className="flex items-center gap-8 shrink-0 font-mono text-xs text-text-secondary uppercase tracking-wider">
      <span>GOLDM ₹15,067/g</span>
      <span className="text-gold">·</span>
      <span>GOLDTEN ₹15,043/g</span>
      <span className="text-gold">·</span>
      <span>GOLDGUINEA ₹15,099/g</span>
      <span className="text-gold">·</span>
      <span>GOLDPETAL ₹15,098/g</span>
      <span className="text-gold">·</span>
      <span>per gram of fine gold</span>
      <span className="text-gold">·</span>
      <span>MCX settlement {settlementDate}</span>
      <span className="text-gold">·</span>
    </div>
  );

  return (
    <div className="w-full border-y border-border py-3 bg-surface/50 overflow-hidden relative flex items-center marquee-container">
      <div className="absolute left-4 z-10 hidden sm:block">
        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-caution/15 text-caution font-medium border border-caution/30 shadow-sm">
          Sample data
        </span>
      </div>

      <div className="flex w-max animate-marquee gap-8 pl-8 select-none">
        {content}
        {content}
        {content}
        {content}
      </div>
    </div>
  );
}
