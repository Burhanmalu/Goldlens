'use client';

import React, { useState } from 'react';
import {
  ShieldCheck, CheckCircle2, Play,
  ChevronDown, ChevronUp
} from 'lucide-react';
import { AuditDetailedStep } from '@/lib/types';
import { getDetailedAuditSteps } from '@/lib/mockData';

export function AlphaAuditView() {
  const steps = getDetailedAuditSteps();
  const [selectedStep, setSelectedStep] = useState<AuditDetailedStep>(steps[0]);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const [isRunningAudit, setIsRunningAudit] = useState(false);

  const runAuditAnimation = () => {
    setIsRunningAudit(true);
    let current = 0;
    const interval = setInterval(() => {
      if (current < steps.length) {
        setSelectedStep(steps[current]);
        current++;
      } else {
        clearInterval(interval);
        setIsRunningAudit(false);
      }
    }, 350);
  };

  const simpleChecklist = [
    { label: 'Historical Dislocation Test', result: 'Passed', detail: 'Residual dislocation +0.33% exceeds threshold' },
    { label: 'Out-of-Sample Walk-Forward Test', result: 'Passed', detail: 'Sharpe 1.84 across 4 test folds' },
    { label: 'Transaction Cost Hurdle', result: 'Passed', detail: 'Survives brokerage, STT & MCX turnover charges (-0.08%)' },
    { label: 'Executable Liquidity Test', result: 'Passed', detail: 'Top-of-book depth fills ₹10L lot with <0.04% slippage' },
    { label: 'Randomness & Monte Carlo Test', result: 'Passed', detail: 'p-value = 0.003 (99.7% confidence vs random noise)' },
  ];

  return (
    <div className="flex-1 bg-[#0B0E11] overflow-y-auto p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 font-sans select-none">
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2B3139] pb-4">
          <div>
            <div className="flex items-center gap-2 text-gold font-bold text-xs uppercase tracking-wider mb-1 font-mono">
              <ShieldCheck size={14} />
              <span>ALPHA ROBUSTNESS AUDIT</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-foreground">Signal Quality & Audit</h1>
            <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
              &quot;We don&apos;t just find a signal. We try to kill it.&quot;
            </p>
          </div>

          <button
            onClick={runAuditAnimation}
            disabled={isRunningAudit}
            className="w-full sm:w-auto px-4 py-2.5 bg-gold hover:bg-gold-hover text-background font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-md min-h-[44px] touch-manipulation"
          >
            <Play size={13} className={isRunningAudit ? 'animate-spin' : 'fill-background'} />
            <span>{isRunningAudit ? 'STRESS TESTING...' : 'RE-RUN AUDIT'}</span>
          </button>
        </div>

        {/* ── SIMPLE OVERALL SCORECARD ── */}
        <div className="p-4 sm:p-6 bg-[#161A1F] rounded-2xl border border-gold/40 shadow-xl space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2B3139] pb-4">
            <div>
              <span className="text-[10px] sm:text-xs text-muted font-mono uppercase tracking-wider block mb-0.5">AUDIT VERDICT</span>
              <h2 className="text-xl sm:text-2xl font-black text-buy flex items-center gap-2">
                <CheckCircle2 size={22} />
                <span>EDGE SURVIVES</span>
              </h2>
              <p className="text-xs text-text-secondary font-mono mt-0.5">
                Instrument Pair: <strong className="text-foreground">GOLDM / GOLDTEN</strong>
              </p>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start font-mono p-2 sm:p-0 bg-[#11151A] sm:bg-transparent rounded-xl border border-[#2B3139] sm:border-0">
              <span className="text-[10px] sm:text-xs text-muted block">OVERALL CONFIDENCE</span>
              <span className="text-2xl sm:text-3xl font-black text-foreground">87%</span>
              <span className="text-xs text-buy font-bold">+0.15% Net Edge</span>
            </div>
          </div>

          {/* Clean 5-Item Checklist */}
          <div className="space-y-2.5">
            {simpleChecklist.map((item, i) => (
              <div
                key={i}
                className="p-3 sm:p-3.5 bg-[#11151A] rounded-xl border border-[#2B3139] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4"
              >
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-buy flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-foreground">{item.label}</div>
                    <div className="text-[11px] sm:text-xs text-text-secondary mt-0.5 leading-relaxed">{item.detail}</div>
                  </div>
                </div>

                <span className="self-start sm:self-auto px-2.5 py-0.5 bg-buy/15 text-buy border border-buy/30 rounded-full font-mono text-[11px] font-bold">
                  ✓ {item.result}
                </span>
              </div>
            ))}
          </div>

          {/* Technical Details Toggle */}
          <div className="pt-2 text-center">
            <button
              onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
              className="w-full sm:w-auto px-5 py-2.5 bg-[#11151A] hover:bg-[#1C2128] text-gold border border-gold/40 rounded-xl text-xs font-bold transition-colors inline-flex items-center justify-center gap-1.5 min-h-[44px] touch-manipulation"
            >
              <span>{showTechnicalDetails ? 'Hide Technical Details' : 'View Technical Details'}</span>
              {showTechnicalDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>
        </div>

        {/* ── EXPANDABLE TECHNICAL DETAILS ── */}
        {showTechnicalDetails && (
          <div className="space-y-4 animate-slide-up">
            <h3 className="font-bold text-xs sm:text-sm text-foreground font-mono">
              Complete 8-Stage Mathematical Breakdown
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 font-mono">
              {steps.map((st) => (
                <button
                  key={st.id}
                  onClick={() => setSelectedStep(st)}
                  className={`p-2.5 sm:p-3 rounded-xl border text-left transition-all min-h-[44px] touch-manipulation ${
                    selectedStep.id === st.id
                      ? 'bg-[#161A1F] border-gold shadow ring-1 ring-gold/30'
                      : 'bg-[#11151A] border-[#2B3139] hover:border-[#363D47]'
                  }`}
                >
                  <div className="flex justify-between text-[9px] text-muted mb-0.5">
                    <span>0{st.id}</span>
                    <span className="text-buy font-bold">✓ PASS</span>
                  </div>
                  <div className="text-xs font-bold text-foreground truncate">{st.name}</div>
                  <div className="text-[10px] sm:text-[11px] text-gold font-bold mt-0.5 truncate">{st.metricValue}</div>
                </button>
              ))}
            </div>

            <div className="p-4 sm:p-5 bg-[#161A1F] rounded-2xl border border-[#2B3139] space-y-2.5 font-mono text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#2B3139] pb-2 gap-1">
                <span className="font-bold text-foreground text-sm">{selectedStep.name}</span>
                <span className="text-buy font-bold text-xs">Passed: {selectedStep.threshold}</span>
              </div>
              <p className="text-text-secondary font-sans leading-relaxed text-xs">{selectedStep.description}</p>
              <div className="p-2.5 bg-[#11151A] rounded-lg border border-[#2B3139] text-gold break-all text-[11px]">
                Formula: {selectedStep.formula}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
