'use client';

import React, { useState } from 'react';
import {
  Activity, ShieldCheck, TrendingUp, FileText, Database,
  CheckCircle, XCircle, AlertTriangle, ArrowRight, Layers,
  ChevronRight, Play, RefreshCw
} from 'lucide-react';
import { TradeTick, SignalEvent, AuditDetailedStep } from '@/lib/types';
import { CONTRACT_REGISTRY, CONTRACT_LIST } from '@/lib/contracts';

interface BottomTerminalPanelProps {
  trades: TradeTick[];
  signals: SignalEvent[];
  auditSteps: AuditDetailedStep[];
  onSelectAuditStep: (step: AuditDetailedStep) => void;
  selectedAuditStep: AuditDetailedStep | null;
  onNavigatePage: (page: string) => void;
}

export function BottomTerminalPanel({
  trades,
  signals,
  auditSteps,
  onSelectAuditStep,
  selectedAuditStep,
  onNavigatePage,
}: BottomTerminalPanelProps) {
  const [bottomTab, setBottomTab] = useState<
    'trades' | 'signals' | 'audit' | 'backtest' | 'contracts' | 'data'
  >('signals');

  return (
    <div className="h-56 bg-secondary border-t border-border flex flex-col select-none text-xs flex-shrink-0">
      {/* Panel Header & Tabs */}
      <div className="h-8 bg-panel border-b border-border flex items-center justify-between px-3 flex-shrink-0">
        <div className="flex items-center gap-1">
          {[
            { id: 'signals', label: 'SIGNALS STREAM', count: signals.length },
            { id: 'trades', label: 'MARKET TRADES', count: trades.length },
            { id: 'audit', label: 'ALPHA AUDIT PIPELINE', highlight: true },
            { id: 'backtest', label: 'WALK-FORWARD BACKTEST' },
            { id: 'contracts', label: 'MCX CONTRACT SPECS' },
            { id: 'data', label: 'PIPELINE HEALTH' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setBottomTab(tab.id as any)}
              className={`px-2.5 py-1 rounded text-[11px] font-bold tracking-wide transition-colors flex items-center gap-1.5 ${
                bottomTab === tab.id
                  ? 'bg-secondary text-gold border border-border/80 shadow-sm'
                  : 'text-text-secondary hover:text-foreground'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className="text-[9px] font-mono px-1 py-0.2 bg-panel rounded text-muted">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-[10px] font-mono text-muted">
          <span className="w-1.5 h-1.5 rounded-full bg-buy" />
          <span>PIPE: MCX_REALTIME_STREAM</span>
        </div>
      </div>

      {/* ── TAB 1: SIGNALS STREAM ── */}
      {bottomTab === 'signals' && (
        <div className="flex-1 p-2 overflow-y-auto font-mono space-y-1">
          <div className="grid grid-cols-12 text-[10px] text-muted pb-1 px-2 border-b border-border/40">
            <span className="col-span-2">TIMESTAMP</span>
            <span className="col-span-2">PAIR</span>
            <span className="col-span-2">EVENT TYPE</span>
            <span className="col-span-5">QUANTITATIVE INTELLIGENCE MESSAGE</span>
            <span className="col-span-1 text-right">STATUS</span>
          </div>

          {signals.map((sig) => (
            <div
              key={sig.id}
              className="grid grid-cols-12 py-1 px-2 text-[11px] hover:bg-panel rounded transition-colors items-center"
            >
              <span className="col-span-2 text-muted">{sig.time}</span>
              <span className="col-span-2 font-bold text-foreground">{sig.pair}</span>
              <span className="col-span-2 text-gold text-[10px] font-semibold">[{sig.type}]</span>
              <span className="col-span-5 text-text-secondary truncate">{sig.message}</span>
              <span className="col-span-1 text-right">
                <span
                  className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                    sig.status === 'ALERT'
                      ? 'bg-gold/20 text-gold border border-gold/40'
                      : sig.status === 'PASSED'
                      ? 'bg-buy/20 text-buy border border-buy/40'
                      : 'bg-panel text-muted'
                  }`}
                >
                  {sig.value || 'OK'}
                </span>
              </span>
            </div>
          ))}
        </div>
      )}

      {/* ── TAB 2: MARKET TRADES (TIME & SALES) ── */}
      {bottomTab === 'trades' && (
        <div className="flex-1 p-2 overflow-y-auto font-mono">
          <div className="grid grid-cols-6 text-[10px] text-muted pb-1 px-2 border-b border-border/40">
            <span>TIME</span>
            <span>RAW PRICE</span>
            <span>NORMALIZED ₹/G</span>
            <span>SPREAD %</span>
            <span>SIZE (LOTS)</span>
            <span className="text-right">EXECUTION SIDE</span>
          </div>

          {trades.map((tr) => (
            <div
              key={tr.id}
              className="grid grid-cols-6 py-0.5 px-2 text-[11px] tabular-nums hover:bg-panel rounded transition-colors"
            >
              <span className="text-muted">{tr.time}</span>
              <span className="font-semibold text-foreground">₹{tr.price.toLocaleString('en-IN')}</span>
              <span className="text-text-secondary">₹{Math.round(tr.normalizedPrice)}/g</span>
              <span className={tr.spread >= 0 ? 'text-buy' : 'text-sell'}>
                {tr.spread >= 0 ? '+' : ''}
                {tr.spread}%
              </span>
              <span className="text-foreground">{tr.size}</span>
              <span
                className={`text-right font-bold uppercase text-[10px] ${
                  tr.side === 'buy' ? 'text-buy' : 'text-sell'
                }`}
              >
                {tr.side}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* ── TAB 3: ALPHA AUDIT PIPELINE ── */}
      {bottomTab === 'audit' && (
        <div className="flex-1 p-3 overflow-y-auto font-mono flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-xs font-bold text-foreground">ALPHA AUDIT PIPELINE</span>
              <span className="text-[10px] text-muted ml-2">
                &quot;We don&apos;t just find a signal. We try to kill it.&quot;
              </span>
            </div>

            <button
              onClick={() => onNavigatePage('alpha-audit')}
              className="px-2.5 py-1 bg-gold/15 text-gold hover:bg-gold/25 border border-gold/30 rounded font-bold text-[10px] transition-colors"
            >
              Open Full Audit Suite →
            </button>
          </div>

          {/* Horizontal 8-Step Pipeline */}
          <div className="grid grid-cols-8 gap-1.5 py-2">
            {auditSteps.map((st, i) => {
              const isSelected = selectedAuditStep?.id === st.id;
              return (
                <button
                  key={st.id}
                  onClick={() => onSelectAuditStep(st)}
                  className={`p-2 rounded border text-left transition-all relative ${
                    isSelected
                      ? 'bg-panel-hover border-gold shadow'
                      : 'bg-panel border-border hover:border-border-light'
                  }`}
                >
                  <div className="flex items-center justify-between text-[9px] mb-1">
                    <span className="text-muted">0{st.id}</span>
                    <span className="text-buy font-bold">✓ PASS</span>
                  </div>
                  <div className="text-[10px] font-bold text-foreground truncate">{st.name}</div>
                  <div className="text-[9px] text-text-secondary truncate mt-0.5">{st.metricValue}</div>
                </button>
              );
            })}
          </div>

          {/* Selected Step Readout Banner */}
          {selectedAuditStep && (
            <div className="p-2 bg-panel rounded border border-border/80 flex items-center justify-between text-[11px]">
              <div>
                <span className="text-gold font-bold">{selectedAuditStep.name}:</span>{' '}
                <span className="text-foreground">{selectedAuditStep.description}</span>{' '}
                <span className="text-muted font-sans font-normal italic">
                  Formula: {selectedAuditStep.formula}
                </span>
              </div>
              <span className="px-2 py-0.5 bg-buy/20 text-buy rounded font-bold text-[10px]">
                {selectedAuditStep.verdictNote}
              </span>
            </div>
          )}
        </div>
      )}

      {/* ── TAB 4: WALK-FORWARD BACKTEST ── */}
      {bottomTab === 'backtest' && (
        <div className="flex-1 p-3 overflow-y-auto font-mono flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-xs font-bold text-foreground">WALK-FORWARD ROBUSTNESS VALIDATION</div>
            <p className="text-[10px] text-muted">
              Rolling 6-Month In-Sample Train Window • 2-Month Unseen Out-of-Sample Test Window
            </p>

            <div className="grid grid-cols-4 gap-4 pt-2">
              <div className="p-2 bg-panel rounded border border-border">
                <span className="text-[9px] text-muted block">ANNUALIZED SHARPE</span>
                <span className="text-base font-black text-buy">1.84</span>
                <span className="text-[9px] text-muted block">Benchmark: 0.92</span>
              </div>
              <div className="p-2 bg-panel rounded border border-border">
                <span className="text-[9px] text-muted block">OOS NET RETURN</span>
                <span className="text-base font-black text-foreground">+8.7%</span>
                <span className="text-[9px] text-buy block">Gross: +14.2%</span>
              </div>
              <div className="p-2 bg-panel rounded border border-border">
                <span className="text-[9px] text-muted block">MAX DRAWDOWN</span>
                <span className="text-base font-black text-sell">-5.7%</span>
                <span className="text-[9px] text-muted block">Duration: 12d</span>
              </div>
              <div className="p-2 bg-panel rounded border border-border">
                <span className="text-[9px] text-muted block">ALPHA SURVIVAL</span>
                <span className="text-base font-black text-gold">89%</span>
                <span className="text-[9px] text-buy block">Passed 4/4 folds</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigatePage('backtest')}
            className="px-4 py-2 bg-gold text-background rounded font-bold text-xs hover:bg-gold-hover transition-colors shadow"
          >
            Open Backtest Studio →
          </button>
        </div>
      )}

      {/* ── TAB 5: MCX CONTRACT SPECS ── */}
      {bottomTab === 'contracts' && (
        <div className="flex-1 p-2 overflow-y-auto font-mono">
          <table className="w-full text-[11px] text-left">
            <thead>
              <tr className="text-[10px] text-muted border-b border-border/50">
                <th className="py-1">SYMBOL</th>
                <th>NAME</th>
                <th>CONTRACT SIZE</th>
                <th>QUOTATION UNIT</th>
                <th>QUOTE BASIS</th>
                <th>PURITY</th>
                <th>PURITY FACTOR</th>
                <th>TICK SIZE</th>
                <th>NORMALIZATION FORMULA</th>
              </tr>
            </thead>
            <tbody>
              {CONTRACT_LIST.map((c) => (
                <tr key={c.symbol} className="border-b border-border/30 hover:bg-panel">
                  <td className="py-1 font-bold text-foreground flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                    {c.symbol}
                  </td>
                  <td className="text-text-secondary">{c.name}</td>
                  <td className="text-foreground font-semibold">{c.contractSize} grams</td>
                  <td className="text-text-secondary">{c.quoteUnit}</td>
                  <td className="text-foreground">{c.quoteBasis}g</td>
                  <td className="text-gold font-bold">{c.purity}</td>
                  <td className="text-text-secondary">{c.purityFactor}</td>
                  <td className="text-foreground">₹{c.tickSize}</td>
                  <td className="text-muted font-mono text-[10px]">
                    (P_raw / {c.quoteBasis}) / {c.purityFactor}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── TAB 6: DATA PIPELINE HEALTH ── */}
      {bottomTab === 'data' && (
        <div className="flex-1 p-3 font-mono text-xs flex items-center justify-between">
          <div className="space-y-2">
            <div className="text-xs font-bold text-foreground">MCX FEED INGESTION & PIPELINE STATUS</div>
            <div className="flex items-center gap-6 text-[11px]">
              <div>
                <span className="text-muted text-[10px] block">FEED STATUS:</span>
                <span className="text-buy font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-buy animate-pulse" />
                  HEALTHY (99.8% SLA)
                </span>
              </div>
              <div>
                <span className="text-muted text-[10px] block">LATENCY:</span>
                <span className="text-foreground font-semibold">14ms tick-to-trade</span>
              </div>
              <div>
                <span className="text-muted text-[10px] block">CARRY CALIBRATION:</span>
                <span className="text-foreground font-semibold">RBI MIBOR 6.50%</span>
              </div>
              <div>
                <span className="text-muted text-[10px] block">RECORDS INGESTED:</span>
                <span className="text-foreground font-semibold">14,280 ticks / min</span>
              </div>
            </div>
          </div>

          <div className="p-2 bg-panel rounded border border-border text-[10px] text-muted max-w-xs">
            Deterministic mock market feed active. All calculations run strictly in-memory.
          </div>
        </div>
      )}
    </div>
  );
}
