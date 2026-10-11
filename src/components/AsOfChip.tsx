import React from 'react';

interface AsOfChipProps {
  date: string;
  isSample?: boolean;
  className?: string;
}

export function AsOfChip({ date, isSample = true, className = '' }: AsOfChipProps) {
  return (
    <div className={`inline-flex items-center gap-1.5 font-mono text-[11px] ${className}`}>
      {isSample && (
        <span className="px-1.5 py-0.5 rounded text-[10px] bg-caution/15 text-caution font-medium border border-caution/30">
          Sample data
        </span>
      )}
      <span className="text-text-muted">
        MCX settlement, {date}
      </span>
    </div>
  );
}
