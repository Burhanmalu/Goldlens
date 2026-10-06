'use client';

import React from 'react';
import { Target, Zap, Info } from 'lucide-react';

interface ZScoreIndicatorProps {
  zScore: number;
  residual: number;
  threshold: number;
  expectedReversion: number;
  onOpenAudit: () => void;
}

export function ZScoreIndicator({
  zScore = 2.41,
  residual = 0.33,
  threshold = 2.0,
  expectedReversion = 0.18,
  onOpenAudit,
}: ZScoreIndicatorProps) {
  const isOpportunity = Math.abs(zScore) >= threshold;

  // Percentage position on -3σ to +3σ bar
  const clampedZ = Math.max(-3, Math.min(3, zScore));
  const pointerPercent = ((clampedZ + 3) / 6) * 100;

  return (
    <div className="bg-panel border-b border-border px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs select-none select-none font-mono">
      {/* LEFT: Z-Score & Status */}
      <div className="flex items-center gap-4">
        <div>
          <div className="text-[9px] text-muted uppercase tracking-wider flex items-center gap-1">
            <Target size={11} className="text-gold" />
            <span>RELATIVE-VALUE Z-SCORE</span>
          </div>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span
              className={`text-lg font-black tracking-tight ${
                zScore >= threshold
                  ? 'text-sell'
                  : zScore <= -threshold
                  ? 'text-buy'
                  : 'text-foreground'
              }`}
            >
              {zScore >= 0 ? '+' : ''}
              {zScore.toFixed(2)}σ
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold border flex items-center gap-1 ${
                isOpportunity
                  ? 'bg-gold/15 text-gold border-gold/40 animate-pulse'
                  : 'bg-panel-sub text-text-secondary border-border'
              }`}
            >
              {isOpportunity ? <Zap size={10} className="fill-gold" /> : <Info size={10} />}
              {isOpportunity ? 'OPPORTUNITY DETECTED' : 'WITHIN NORMAL BAND'}
            </span>
          </div>
        </div>

        {/* Visual Sigma Gauge */}
        <div className="hidden sm:block w-48 pt-1">
          <div className="flex justify-between text-[8px] text-muted mb-0.5">
            <span>-3σ</span>
            <span className="text-buy font-bold">-2σ</span>
            <span>0</span>
            <span className="text-sell font-bold">+2σ</span>
            <span>+3σ</span>
          </div>
          <div className="w-full h-2 bg-secondary rounded-full relative overflow-hidden border border-border">
            {/* Safe zone in middle */}
            <div className="absolute inset-y-0 left-[16.6%] right-[16.6%] bg-border-light/30" />
            {/* Pointer */}
            <div
              className="absolute top-0 bottom-0 w-2 bg-gold rounded-full shadow transition-all duration-300 -translate-x-1"
              style={{ left: `${pointerPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* RIGHT: Quant Metrics & Audit CTA */}
      <div className="flex items-center gap-4 text-xs">
        <div>
          <span className="text-[9px] text-muted block">THRESHOLD</span>
          <span className="text-foreground font-semibold">±{threshold.toFixed(2)}σ</span>
        </div>

        <div>
          <span className="text-[9px] text-muted block">RESIDUAL</span>
          <span className="text-gold font-bold">
            {residual >= 0 ? '+' : ''}
            {residual.toFixed(2)}%
          </span>
        </div>

        <div>
          <span className="text-[9px] text-muted block">EXP. REVERSION</span>
          <span className="text-buy font-bold">+{expectedReversion.toFixed(2)}%</span>
        </div>

        <button
          onClick={onOpenAudit}
          className="px-3 py-1.5 bg-panel-sub hover:bg-panel-hover text-foreground hover:text-gold border border-border hover:border-gold/50 rounded font-semibold text-[11px] transition-all flex items-center gap-1.5 shadow-sm"
        >
          <span>Run Alpha Audit</span>
          <span className="text-[10px] text-gold font-bold">→</span>
        </button>
      </div>
    </div>
  );
}
