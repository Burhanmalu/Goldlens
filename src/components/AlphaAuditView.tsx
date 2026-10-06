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
    <div className="flex-1 bg-[#0B0E11] overflow-y-auto p-8 font-sans select-none">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#2B3139] pb-4">
          <div>
            <div className="flex items-center gap-2 text-gold font-bold text-xs uppercase tracking-wider mb-1 font-mono">
              <ShieldCheck size={14} />
              <span>ALPHA ROBUSTNESS AUDIT</span>
            </div>
            <h1 className="text-2xl font-black text-foreground">Signal Quality & Audit</h1>
            <p className="text-sm text-text-secondary mt-0.5">
              &quot;We don&apos;t just find a signal. We try to kill it.&quot;
            </p>
          </div>

          <button
            onClick={runAuditAnimation}
            disabled={isRunningAudit}
            className="px-4 py-2 bg-gold hover:bg-gold-hover text-background font-bold text-xs rounded-lg transition-all flex items-center gap-2 shadow-md"
          >
            <Play size={13} className={isRunningAudit ? 'animate-spin' : 'fill-background'} />
            <span>{isRunningAudit ? 'STRESS TESTING...' : 'RE-RUN AUDIT'}</span>
          </button>
        </div>

        {/* ── SIMPLE OVERALL SCORECARD ── */}
        <div className="p-6 bg-[#161A1F] rounded-2xl border border-gold/40 shadow-xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#2B3139] pb-4">
            <div>
              <span className="text-xs text-muted font-mono uppercase tracking-wider block mb-1">AUDIT VERDICT</span>
              <h2 className="text-2xl font-black text-buy flex items-center gap-2">
                <CheckCircle2 size={24} />
                <span>EDGE SURVIVES</span>
              </h2>
              <p className="text-xs text-text-secondary font-mono mt-0.5">
                Instrument Pair: <strong className="text-foreground">GOLDM / GOLDTEN</strong>
              </p>
            </div>

            <div className="text-right font-mono">
              <span className="text-xs text-muted block mb-1">OVERALL CONFIDENCE</span>
              <span className="text-3xl font-black text-foreground">87%</span>
              <span className="text-[11px] text-buy block mt-0.5 font-bold">Net Edge: +0.15%</span>
            </div>
          </div>

          {/* Clean 5-Item Checklist */}
          <div className="space-y-3">
            {simpleChecklist.map((item, i) => (
              <div
                key={i}
                className="p-3.5 bg-[#11151A] rounded-xl border border-[#2B3139] flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-buy flex-shrink-0" />
                  <div>
                    <div className="text-sm font-bold text-foreground">{item.label}</div>
                    <div className="text-xs text-text-secondary mt-0.5">{item.detail}</div>
                  </div>
                </div>

                <span className="px-3 py-1 bg-buy/15 text-buy border border-buy/30 rounded-full font-mono text-xs font-bold">
                  ✓ {item.result}
                </span>
              </div>
            ))}
          </div>

          {/* Technical Details Toggle */}
          <div className="pt-2 text-center">
            <button
              onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
              className="px-5 py-2 bg-[#11151A] hover:bg-[#1C2128] text-gold border border-gold/40 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1.5"
            >
              <span>{showTechnicalDetails ? 'Hide Technical Details' : 'View Technical Details'}</span>
              {showTechnicalDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>
        </div>

        {/* ── EXPANDABLE TECHNICAL DETAILS ── */}
        {showTechnicalDetails && (
          <div className="space-y-4 animate-slide-up">
            <h3 className="font-bold text-sm text-foreground font-mono">
              Complete 8-Stage Mathematical Breakdown
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 font-mono">
              {steps.map((st) => (
                <button
                  key={st.id}
                  onClick={() => setSelectedStep(st)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    selectedStep.id === st.id
                      ? 'bg-[#161A1F] border-gold shadow'
                      : 'bg-[#11151A] border-[#2B3139] hover:border-[#363D47]'
                  }`}
                >
                  <div className="flex justify-between text-[10px] text-muted mb-1">
                    <span>STAGE 0{st.id}</span>
                    <span className="text-buy font-bold">✓ PASS</span>
                  </div>
                  <div className="text-xs font-bold text-foreground truncate">{st.name}</div>
                  <div className="text-[11px] text-gold font-bold mt-1">{st.metricValue}</div>
                </button>
              ))}
            </div>

            <div className="p-5 bg-[#161A1F] rounded-xl border border-[#2B3139] space-y-3 font-mono text-xs">
              <div className="flex justify-between border-b border-[#2B3139] pb-2">
                <span className="font-bold text-foreground text-sm">{selectedStep.name}</span>
                <span className="text-buy font-bold">Passed Threshold: {selectedStep.threshold}</span>
              </div>
              <p className="text-text-secondary font-sans leading-relaxed">{selectedStep.description}</p>
              <div className="p-3 bg-[#11151A] rounded border border-[#2B3139] text-gold">
                Formula: {selectedStep.formula}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
