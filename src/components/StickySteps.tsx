'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CinematicCanvas } from '@/components/CinematicCanvas';
import { CinematicVideoBackdrop } from '@/components/CinematicVideoBackdrop';
import { CinematicAssetBackdrop } from '@/components/CinematicAssetBackdrop';

export function StickySteps() {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      num: '01',
      title: 'NORMALIZE',
      desc: 'Every contract converted to ₹ per gram of fine gold. Size, quote basis and purity handled for you.',
      previewTag: 'P_fine = Settlement / (Basis_g × Purity)',
      highlight: '₹15,067.44 / g benchmark',
    },
    {
      num: '02',
      title: 'COMPARE',
      desc: 'Matched by expiry and adjusted for carry, so you see real gaps, not calendar noise.',
      previewTag: 'Carry = APR × ΔDays / 365',
      highlight: '+0.05% residual spread',
    },
    {
      num: '03',
      title: 'DECIDE',
      desc: 'Costs included, thin contracts penalised. If nothing clears the cost, we say: no trade today.',
      previewTag: 'Friction Hurdle: 0.09% (CTT + Exchange)',
      highlight: 'VERDICT: NO TRADE',
    },
    {
      num: '04',
      title: 'PROVE',
      desc: "Every strategy is tested on unseen data, against random entries, with gold's own moves removed.",
      previewTag: 'Walk-Forward Out-of-Sample',
      highlight: 'Beta: 0.02 · Placebo p=0.14',
    },
  ];

  return (
    <section id="how-it-works" className="relative py-28 px-6 max-w-7xl mx-auto border-b border-border overflow-hidden">
      <CinematicAssetBackdrop asset="gold_waves" opacity={0.35} parallaxSpeed={70} scaleRange={[1, 1.15]} />
      <CinematicCanvas intensity={0.6} mode="waves" />
      <CinematicVideoBackdrop type="geometry" opacity={0.2} />
      <div className="max-w-3xl mb-12">
        <div className="text-xs uppercase tracking-[0.12em] font-mono text-gold mb-3">
          02 — HOW IT WORKS
        </div>
        <h2 className="text-3xl sm:text-5xl font-display font-black uppercase tracking-tight text-text-primary leading-[1.05]">
          A rigorous four-step filter.
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Steps List */}
        <div className="lg:col-span-5 space-y-4">
          {steps.map((s, idx) => (
            <div
              key={s.num}
              onClick={() => setActiveStep(idx)}
              className={`p-6 rounded-card border transition-all cursor-pointer ${
                activeStep === idx
                  ? 'bg-surface border-gold/40 shadow-lg'
                  : 'bg-transparent border-border hover:bg-surface/40'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="font-mono text-xs text-gold font-bold">{s.num}</span>
                <span className="font-display text-lg font-bold uppercase tracking-wide text-text-primary">
                  {s.title}
                </span>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Right Column: Dynamic Mockup Preview Frame */}
        <div className="lg:col-span-7 sticky top-28 p-6 sm:p-8 rounded-card bg-surface border border-border min-h-[380px] flex flex-col justify-between shadow-2xl">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-border" />
              <span className="w-2.5 h-2.5 rounded-full bg-border" />
              <span className="w-2.5 h-2.5 rounded-full bg-border" />
              <span className="text-xs font-mono text-text-muted ml-2">GoldLens Engine Mockup</span>
            </div>
            <span className="text-xs font-mono text-gold font-bold">
              STEP {steps[activeStep].num}
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="py-12 flex flex-col items-center justify-center text-center space-y-4"
            >
              <div className="p-3 rounded-pill bg-[#0A0A0B] border border-border text-xs font-mono text-text-secondary">
                {steps[activeStep].previewTag}
              </div>

              <div className="text-2xl sm:text-3xl font-mono font-bold text-text-primary gold-gradient-text">
                {steps[activeStep].highlight}
              </div>

              <p className="text-xs font-mono text-text-muted max-w-md">
                Every calculation uses public MCX end-of-day settlement values without optimistic execution assumptions.
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="border-t border-border pt-4 flex items-center justify-between text-[11px] font-mono text-text-muted">
            <span>MCX Bhavcopy Normalized Stream</span>
            <span>Zero optimistic fill assumptions</span>
          </div>
        </div>
      </div>
    </section>
  );
}
