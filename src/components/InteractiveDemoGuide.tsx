'use client';

import React from 'react';
import { ChevronRight, X } from 'lucide-react';

interface InteractiveDemoGuideProps {
  demoStep: number;
  setDemoStep: (step: number) => void;
  onExit: () => void;
  onActionStep: (step: number) => void;
}

export function InteractiveDemoGuide({
  demoStep,
  setDemoStep,
  onExit,
  onActionStep,
}: InteractiveDemoGuideProps) {
  const steps = [
    {
      title: 'Step 1: The Fragmentation Dilemma',
      desc: 'MCX lists multiple gold contracts (GOLDM, GOLDTEN, GOLDGUINEA, GOLDPETAL). Notice how nominal raw prices vary wildly (₹12,910 vs ₹1,28,420).',
      actionLabel: 'Normalize Units →',
      target: 'normalized',
    },
    {
      title: 'Step 2: Fine Gold Normalization',
      desc: 'All 4 contracts are converted to ₹/g of 999 fine gold. Watch the prices converge within ±0.33% of fair benchmark (₹12,842/g).',
      actionLabel: 'Inspect Relative Spread →',
      target: 'spread',
    },
    {
      title: 'Step 3: Spread & Carry Isolation',
      desc: 'Observed spread between GOLDM and GOLDTEN is +0.42%. We subtract the +0.09% cost of carry across asymmetric expiration dates.',
      actionLabel: 'Extract Residual →',
      target: 'residual',
    },
    {
      title: 'Step 4: Residual Dislocation (+0.33%)',
      desc: 'The clean residual dislocation is +0.33%, pushing the statistical Z-Score to +2.41σ above historical mean.',
      actionLabel: 'Detect Opportunity →',
      target: 'zscore',
    },
    {
      title: 'Step 5: Opportunity Flagged (+2.41σ)',
      desc: 'A statistical dislocation is detected. But is it real, or will trading friction destroy the profit?',
      actionLabel: 'Launch Alpha Audit →',
      target: 'audit',
    },
    {
      title: 'Step 6: Alpha Audit Robustness Testing',
      desc: 'We stress-test the signal through 8 quantitative hurdles: STT + MCX charges (-0.08%), slippage (-0.04%), and walk-forward verification.',
      actionLabel: 'Validate Out-of-Sample →',
      target: 'backtest',
    },
    {
      title: 'Step 7: Walk-Forward Out-of-Sample Proof',
      desc: 'Tested on unseen 2-month data folds. Annualized Sharpe reaches 1.84 with an 89% alpha survival rate.',
      actionLabel: 'View Final Verdict →',
      target: 'verdict',
    },
    {
      title: 'Step 8: EDGE SURVIVES (+0.12% Net Edge)',
      desc: 'Not every price difference is an opportunity. GoldLens isolates and validates only defensible, tradeable alpha.',
      actionLabel: 'Finish Guided Tour ✓',
      target: 'finish',
    },
  ];

  const current = steps[demoStep] || steps[0];

  const handleNext = () => {
    if (demoStep < steps.length - 1) {
      const nextStep = demoStep + 1;
      setDemoStep(nextStep);
      onActionStep(nextStep);
    } else {
      onExit();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md w-full bg-secondary/95 border border-gold/60 rounded-xl p-4 shadow-2xl backdrop-blur-md text-xs font-mono select-none animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
          <span className="text-gold font-bold text-xs uppercase tracking-wider">
            GOLDLENS GUIDED TOUR ({demoStep + 1}/{steps.length})
          </span>
        </div>

        <button
          onClick={onExit}
          className="text-muted hover:text-foreground transition-colors p-1"
          title="Exit Tour"
        >
          <X size={14} />
        </button>
      </div>

      {/* Body */}
      <div className="space-y-2 mb-4">
        <h3 className="font-bold text-sm text-foreground">{current.title}</h3>
        <p className="text-text-secondary font-sans text-xs leading-relaxed">{current.desc}</p>
      </div>

      {/* Footer Controls */}
      <div className="flex items-center justify-between pt-2 border-t border-border">
        {demoStep > 0 ? (
          <button
            onClick={() => setDemoStep(demoStep - 1)}
            className="px-3 py-1 bg-panel hover:bg-panel-hover text-text-secondary hover:text-foreground rounded border border-border text-[11px] transition-colors"
          >
            Back
          </button>
        ) : (
          <div />
        )}

        <button
          onClick={handleNext}
          className="px-4 py-1.5 bg-gold hover:bg-gold-hover text-background font-bold rounded text-xs transition-colors flex items-center gap-1.5 shadow"
        >
          <span>{current.actionLabel}</span>
          <ChevronRight size={13} />
        </button>
      </div>
    </div>
  );
}
