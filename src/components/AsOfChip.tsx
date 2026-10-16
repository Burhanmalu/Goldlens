import React from 'react';

interface AsOfChipProps {
  date: string;
  isSample?: boolean;
  className?: string;
}

export function AsOfChip({ date, className = '' }: AsOfChipProps) {
  return (
    <div className={`inline-flex items-center gap-1.5 font-mono text-[11px] ${className}`}>
      <span className="px-1.5 py-0.5 rounded text-[10px] bg-gold/15 text-gold font-medium border border-gold/30">
        mcxindia.com
      </span>
      <span className="text-text-muted">
        MCX settlement, {date}
      </span>
    </div>
  );
}
