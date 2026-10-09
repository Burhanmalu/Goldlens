'use client';

import React, { useState } from 'react';
import {
  ShieldCheck, CheckCircle2, Play,
  ChevronDown, ChevronUp, HelpCircle
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
    { label: 'Historical Dislocation Test', result: 'Passed', detail: 'Residual dislocation +0.33% exceeds +2.0σ threshold' },
    { label: 'Out-of-Sample Walk-Forward Test', result: 'Passed', detail: 'Sharpe 1.84 across 4 walk-forward test folds' },
    { label: 'Transaction Cost Hurdle (STT)', result: 'Passed', detail: 'Survives brokerage, STT & MCX turnover charges (-0.08%)' },
    { label: 'Executable Liquidity Test', result: 'Passed', detail: 'Top-of-book depth fills ₹10L combo with <0.04% slippage' },
    { label: 'Monte Carlo Robustness Test', result: 'Passed', detail: 'p-value = 0.003 (99.7% confidence vs random price walk)' },
  ];

  return (
    <div className="flex-1 bg-[#0B0E11] overflow-y-auto p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 font-sans select-none">
      <div className="max-w-4xl mx-auto space-y-5 sm:space-y-7">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2B3139] pb-4 sm:pb-5">
          <div>
            <div className="flex items-center gap-2 text-gold font-bold text-xs uppercase tracking-wider mb-1 font-mono">
              <ShieldCheck size={14} />
              <span>ALPHA ROBUSTNESS AUDIT SUITE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">Signal Quality & Audit</h1>
            <p className="text-xs sm:text-sm text-text-secondary mt-1">
              &quot;We don&apos;t just find an edge. We stress-test it against every friction hurdle.&quot;
            </p>
          </div>

          <button
            onClick={runAuditAnimation}
            disabled={isRunningAudit}
            className="w-full sm:w-auto px-5 py-2.5 bg-gold hover:bg-gold-hover text-background font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-md min-h-[44px] touch-manipulation font-mono tracking-wide"
          >
            <Play size={14} className={isRunningAudit ? 'animate-spin' : 'fill-background'} />
            <span>{isRunningAudit ? 'STRESS TESTING...' : 'RE-RUN AUDIT'}</span>
          </button>
        </div>

        {/* ── SIMPLE OVERALL SCORECARD ── */}
        <div className="p-5 sm:p-6 bg-[#161A1F] rounded-2xl border border-[#2B3139] shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2B3139] pb-4">
            <div>
              <span className="text-xs text-muted font-mono uppercase tracking-wider block mb-1">AUDIT VERDICT</span>
              <h2 className="text-2xl font-black text-buy flex items-center gap-2 font-mono">
                <CheckCircle2 size={24} />
                <span>EDGE SURVIVES</span>
              </h2>
              <p className="text-xs text-text-secondary font-mono mt-1">
                Instrument Pair: <strong className="text-foreground">GOLDM / GOLDTEN</strong>
              </p>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start font-mono p-3 sm:p-0 bg-[#11151A] sm:bg-transparent rounded-xl border border-[#2B3139] sm:border-0">
              <span className="text-xs text-muted block font-sans">OVERALL CONFIDENCE</span>
              <span className="text-3xl font-black text-foreground tabular-nums">87%</span>
              <span className="text-xs text-buy font-bold tabular-nums">+0.15% Net Edge</span>
            </div>
          </div>

          {/* Clean 5-Item Checklist */}
          <div className="space-y-3">
            {simpleChecklist.map((item, i) => (
              <div
                key={i}
                className="p-3.5 sm:p-4 bg-[#11151A] rounded-xl border border-[#2B3139] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-buy flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-bold text-foreground">{item.label}</div>
                    <div className="text-xs text-text-secondary mt-0.5 leading-relaxed">{item.detail}</div>
                  </div>
                </div>

                <span className="self-end sm:self-center px-2.5 py-1 rounded-full bg-buy/15 text-buy border border-buy/30 text-xs font-mono font-bold flex-shrink-0">
                  {item.result}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── TECHNICAL AUDIT ACCORDION ── */}
        <div className="border border-[#2B3139] rounded-2xl overflow-hidden bg-[#161A1F]">
          <button
            onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
            className="w-full px-5 py-4 flex items-center justify-between text-xs font-bold text-text-secondary hover:text-foreground transition-colors"
          >
            <span className="flex items-center gap-2">
              <HelpCircle size={15} className="text-gold" />
              <span>Step-by-Step Mathematical Normalization Audit</span>
            </span>
            {showTechnicalDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {showTechnicalDetails && (
            <div className="p-5 border-t border-[#2B3139] space-y-4 font-mono text-xs bg-[#11151A] animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                {steps.map((s, idx) => (
                  <button
                    key={s.stepNumber}
                    onClick={() => setSelectedStep(s)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      selectedStep.stepNumber === s.stepNumber
                        ? 'bg-[#161A1F] text-gold border-gold/50 shadow-sm'
                        : 'bg-[#161A1F]/60 text-muted border-[#2B3139] hover:text-foreground'
                    }`}
                  >
                    <div className="text-[10px] uppercase">Step 0{idx + 1}</div>
                    <div className="font-bold text-xs truncate mt-0.5">{s.title}</div>
                  </button>
                ))}
              </div>

              <div className="p-4 bg-[#161A1F] rounded-xl border border-[#2B3139] space-y-2">
                <div className="text-sm font-bold text-foreground">{selectedStep.title}</div>
                <div className="text-xs text-text-secondary font-sans leading-relaxed">{selectedStep.description}</div>
                <div className="p-2.5 bg-[#11151A] rounded-lg border border-[#2B3139] text-gold font-mono text-xs">
                  {selectedStep.formula}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
