'use client';

import React, { useState } from 'react';
import {
  ShieldCheck, AlertTriangle, XCircle, Zap, Play,
  Sliders, ArrowUpRight, ArrowDownRight, Check, Activity,
  Info, Sparkles, Scale
} from 'lucide-react';
import { Opportunity } from '@/lib/types';

interface IntelligencePanelProps {
  opportunities: Opportunity[];
  onSelectOpportunity: (opp: Opportunity) => void;
  onOpenAudit: (opp?: Opportunity) => void;
}

export function IntelligencePanel({
  opportunities,
  onSelectOpportunity,
  onOpenAudit,
}: IntelligencePanelProps) {
  const [activeTab, setActiveTab] = useState<'opportunities' | 'simulator' | 'score'>('opportunities');
  const [positionSize, setPositionSize] = useState<number>(1000000); // 10 Lakhs INR
  const [isTradeSimulated, setIsTradeSimulated] = useState(false);
  const [tradeLogs, setTradeLogs] = useState<string[]>([]);

  // Default primary opportunity
  const primaryOpp = opportunities[0] || {
    id: 'opp-1',
    pair: 'GOLDM / GOLDTEN',
    contractA: 'GOLDM',
    contractB: 'GOLDTEN',
    direction: 'LONG GOLDM / SHORT GOLDTEN',
    residual: 0.33,
    zScore: 2.41,
    transactionCost: 0.08,
    liquidityCost: 0.04,
    expectedCarry: 0.09,
    netEdge: 0.12,
    confidence: 89,
    status: 'EDGE_SURVIVES',
  };

  const handleSimulateTrade = () => {
    setIsTradeSimulated(true);
    const expectedProfit = Math.round(positionSize * (primaryOpp.netEdge / 100));
    setTradeLogs([
      `[${new Date().toLocaleTimeString()}] ORDER SUBMITTED: Long 10 Lots GOLDM @ MKT`,
      `[${new Date().toLocaleTimeString()}] ORDER SUBMITTED: Short 100 Lots GOLDTEN @ MKT`,
      `[${new Date().toLocaleTimeString()}] FILLED: Synthetic Pair Spread @ +0.42%`,
      `[${new Date().toLocaleTimeString()}] ESTIMATED NET PnL: ₹${expectedProfit.toLocaleString('en-IN')} (+${primaryOpp.netEdge.toFixed(2)}%)`,
    ]);
  };

  return (
    <div className="h-full bg-secondary border-l border-border flex flex-col select-none text-xs">
      {/* Panel Top Header & Tabs */}
      <div className="h-9 bg-panel border-b border-border flex items-center justify-between px-2.5 flex-shrink-0">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('opportunities')}
            className={`px-2 py-1 rounded text-[11px] font-bold tracking-wide transition-colors ${
              activeTab === 'opportunities'
                ? 'bg-secondary text-gold border border-border/80'
                : 'text-text-secondary hover:text-foreground'
            }`}
          >
            OPPORTUNITIES
          </button>
          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-2 py-1 rounded text-[11px] font-bold tracking-wide transition-colors ${
              activeTab === 'simulator'
                ? 'bg-secondary text-foreground border border-border/80'
                : 'text-text-secondary hover:text-foreground'
            }`}
          >
            SIMULATOR
          </button>
          <button
            onClick={() => setActiveTab('score')}
            className={`px-2 py-1 rounded text-[11px] font-bold tracking-wide transition-colors ${
              activeTab === 'score'
                ? 'bg-secondary text-foreground border border-border/80'
                : 'text-text-secondary hover:text-foreground'
            }`}
          >
            EDGE SCORE
          </button>
        </div>

        <span className="text-[9px] font-mono text-muted uppercase">QUANT DESK</span>
      </div>

      {/* ── TAB 1: OPPORTUNITIES LIST ── */}
      {activeTab === 'opportunities' && (
        <div className="flex-1 p-2 space-y-2 overflow-y-auto font-mono">
          <div className="flex items-center justify-between px-1 text-[10px] text-muted">
            <span>PAIR & DISLOCATION</span>
            <span>AUDIT VERDICT</span>
          </div>

          {opportunities.map((opp) => {
            const isSurvives = opp.status === 'EDGE_SURVIVES';
            const isGross = opp.status === 'GROSS_ONLY';

            return (
              <div
                key={opp.id}
                className={`p-2.5 rounded-lg border transition-all ${
                  isSurvives
                    ? 'bg-panel border-gold/40 hover:border-gold shadow-sm'
                    : isGross
                    ? 'bg-panel border-border hover:border-border-light'
                    : 'bg-panel/60 border-border/50 opacity-75'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-1.5">
                  <div>
                    <div className="text-xs font-black text-foreground flex items-center gap-1.5">
                      {opp.pair}
                    </div>
                    <div className="text-[10px] text-text-secondary">{opp.direction}</div>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold border flex items-center gap-1 ${
                      isSurvives
                        ? 'bg-buy/10 text-buy border-buy/30'
                        : isGross
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        : 'bg-sell/10 text-sell border-sell/30'
                    }`}
                  >
                    {isSurvives ? '✓ EDGE SURVIVES' : isGross ? '⚠ GROSS ONLY' : '✗ NO EDGE'}
                  </span>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-2 my-2 py-1.5 border-y border-border/50 text-[11px] tabular-nums">
                  <div>
                    <span className="text-[9px] text-muted block">RESIDUAL SPREAD</span>
                    <span className="font-bold text-foreground">
                      {opp.residual >= 0 ? '+' : ''}
                      {opp.residual.toFixed(2)}%
                    </span>
                    <span className="text-[10px] text-text-secondary ml-1">({opp.zScore.toFixed(2)}σ)</span>
                  </div>

                  <div className="text-right">
                    <span className="text-[9px] text-muted block">NET EDGE (AFTER COSTS)</span>
                    <span className={`font-black ${opp.netEdge > 0 ? 'text-buy' : 'text-sell'}`}>
                      {opp.netEdge >= 0 ? '+' : ''}
                      {opp.netEdge.toFixed(2)}%
                    </span>
                    <span className="text-[10px] text-text-secondary ml-1">({opp.confidence}% conf)</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-0.5">
                  <span className="text-[10px] text-muted">
                    Tx Cost: -{opp.transactionCost}% • Liq: -{opp.liquidityCost}%
                  </span>

                  <button
                    onClick={() => {
                      onSelectOpportunity(opp);
                      onOpenAudit(opp);
                    }}
                    className="px-2.5 py-1 bg-secondary hover:bg-panel-hover text-foreground hover:text-gold border border-border hover:border-gold/50 rounded font-semibold text-[10px] transition-all"
                  >
                    Inspect →
                  </button>
                </div>
              </div>
            );
          })}

          <div className="p-2 bg-panel rounded border border-border/70 text-[10px] text-text-secondary">
            <span className="text-gold font-bold block mb-0.5">GoldLens Principle:</span>
            Raw price differences are not edges. Only opportunities with positive net edge post carry, friction, and walk-forward testing are flagged as <span className="text-buy font-bold">EDGE SURVIVES</span>.
          </div>
        </div>
      )}

      {/* ── TAB 2: SIGNAL EXECUTION SIMULATOR ── */}
      {activeTab === 'simulator' && (
        <div className="flex-1 p-3 flex flex-col justify-between font-mono">
          <div className="space-y-3">
            {/* Header */}
            <div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-foreground">RELATIVE-VALUE TRADE</span>
                <span className="px-1.5 py-0.2 bg-sell/10 text-sell border border-sell/30 rounded text-[9px] font-bold">
                  SIMULATION ONLY
                </span>
              </div>
              <p className="text-[10px] text-muted mt-0.5">
                Multi-leg execution model across normalized units
              </p>
            </div>

            {/* Pair Legs */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 bg-buy/10 border border-buy/30 rounded">
                <span className="text-[9px] text-buy font-bold block">LEG 1: LONG</span>
                <span className="text-xs font-extrabold text-foreground">GOLDM</span>
                <span className="text-[10px] text-text-secondary block">10 Lots (~100g)</span>
              </div>

              <div className="p-2 bg-sell/10 border border-sell/30 rounded text-right">
                <span className="text-[9px] text-sell font-bold block">LEG 2: SHORT</span>
                <span className="text-xs font-extrabold text-foreground">GOLDTEN</span>
                <span className="text-[10px] text-text-secondary block">100 Lots (~100g)</span>
              </div>
            </div>

            {/* Position Size Slider */}
            <div>
              <div className="flex justify-between text-[10px] text-muted mb-1">
                <span>POSITION CAPITAL</span>
                <span className="text-foreground font-bold">₹{positionSize.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="500000"
                max="10000000"
                step="500000"
                value={positionSize}
                onChange={(e) => setPositionSize(Number(e.target.value))}
                className="w-full accent-gold h-1 bg-panel rounded"
              />
            </div>

            {/* Edge Breakdown Table */}
            <div className="bg-panel rounded border border-border p-2 space-y-1 text-[11px]">
              <div className="flex justify-between text-muted">
                <span>Expected Gross Edge:</span>
                <span className="text-foreground font-bold">+{primaryOpp.residual}%</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Cost of Carry Adjustment:</span>
                <span className="text-sell font-semibold">-{primaryOpp.expectedCarry}%</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Institutional Tx Cost (STT+MCX):</span>
                <span className="text-sell font-semibold">-{primaryOpp.transactionCost}%</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Modeled Slippage Impact:</span>
                <span className="text-sell font-semibold">-{primaryOpp.liquidityCost}%</span>
              </div>
              <div className="pt-1 border-t border-border flex justify-between font-bold">
                <span className="text-gold">Expected Net Edge:</span>
                <span className="text-buy font-black text-xs">+{primaryOpp.netEdge}%</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={handleSimulateTrade}
                className="py-2 bg-gold hover:bg-gold-hover text-background font-bold rounded text-xs transition-colors shadow"
              >
                SIMULATE TRADE
              </button>

              <button
                onClick={() => onOpenAudit(primaryOpp)}
                className="py-2 bg-panel-sub hover:bg-panel-hover text-foreground hover:text-gold border border-border rounded font-bold text-xs transition-colors"
              >
                RUN AUDIT
              </button>
            </div>

            {/* Simulation Execution Logs */}
            {isTradeSimulated && (
              <div className="p-2 bg-background rounded border border-buy/30 space-y-1 text-[9px] text-buy animate-slide-up">
                {tradeLogs.map((log, i) => (
                  <div key={i} className="truncate">
                    {log}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="text-[9px] text-muted text-center pt-2">
            No real orders are routed. Strictly for algorithmic research.
          </div>
        </div>
      )}

      {/* ── TAB 3: EDGE SCORE GAUGE ── */}
      {activeTab === 'score' && (
        <div className="flex-1 p-3 flex flex-col justify-between font-mono">
          <div>
            <div className="text-center py-3">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full border-4 border-gold/80 bg-gold/10 text-gold shadow-lg mb-2">
                <div className="text-center">
                  <span className="text-2xl font-black block">87</span>
                  <span className="text-[9px] text-gold/80 font-bold uppercase">/ 100</span>
                </div>
              </div>
              <div className="text-xs font-bold text-foreground">OVERALL EDGE SCORE</div>
              <div className="text-[10px] text-buy font-semibold">Tier 1 • High Defensibility</div>
            </div>

            {/* Component Breakdown Bars */}
            <div className="space-y-2 mt-2">
              {[
                { label: 'Spread Dislocation', score: 92, color: '#0ECB81' },
                { label: 'Statistical Z-Score', score: 89, color: '#F0B90B' },
                { label: 'Execution Liquidity', score: 81, color: '#3861FB' },
                { label: 'Cost Model Buffer', score: 86, color: '#0ECB81' },
                { label: 'Out-of-Sample Walk-Forward', score: 91, color: '#0ECB81' },
              ].map((item) => (
                <div key={item.label} className="text-[10px]">
                  <div className="flex justify-between text-text-secondary mb-0.5">
                    <span>{item.label}</span>
                    <span className="font-bold text-foreground">{item.score}/100</span>
                  </div>
                  <div className="w-full h-1.5 bg-panel rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${item.score}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onOpenAudit(primaryOpp)}
            className="w-full py-2 bg-panel-sub hover:bg-panel-hover text-gold border border-gold/40 rounded font-bold text-xs transition-colors mt-3"
          >
            View Complete Audit Trail →
          </button>
        </div>
      )}
    </div>
  );
}
