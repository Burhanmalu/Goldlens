'use client';

import React, { useState } from 'react';
import { ConvergeHero } from '@/components/ConvergeHero';
import { MarqueeStrip } from '@/components/MarqueeStrip';
import { PerGramToggle } from '@/components/PerGramToggle';
import { StickySteps } from '@/components/StickySteps';
import { TodayTeaser } from '@/components/TodayTeaser';
import { AudienceList } from '@/components/AudienceList';
import { ProofSection } from '@/components/ProofSection';
import { FaqAccordion } from '@/components/FaqAccordion';
import { Footer } from '@/components/Footer';
import { AuthSheet } from '@/components/AuthSheet';

interface LandingViewProps {
  settlementDate: string;
  onOpenApp: (tab?: 'today' | 'compare' | 'playbooks' | 'proof' | 'method') => void;
  onOpenLogin: () => void;
  isLoginOpen: boolean;
  onCloseLogin: () => void;
}

export function LandingView({
  settlementDate,
  onOpenApp,
  onOpenLogin,
  isLoginOpen,
  onCloseLogin,
}: LandingViewProps) {
  const [legalModal, setLegalModal] = useState<'terms' | 'privacy' | null>(null);

  return (
    <div className="relative min-h-screen bg-[#0A0A0B] text-[#F5F2EA] overflow-x-hidden selection:bg-gold/20 selection:text-gold">
      {/* 0. STICKY NAV */}
      <nav className="fixed top-0 left-0 right-0 z-40 px-6 py-4 transition-all glass-panel border-b border-border">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand Wordmark */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="#D6B26A" strokeWidth="2" />
              <circle cx="12" cy="12" r="4" fill="#D6B26A" />
            </svg>
            <span className="font-display font-black tracking-tight text-xl text-text-primary">
              GoldLens
            </span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8 text-xs font-mono text-text-secondary">
            <a href="#how-it-works" className="hover:text-gold transition-colors">
              How it works
            </a>
            <a href="#who-its-for" className="hover:text-gold transition-colors">
              Who it&apos;s for
            </a>
            <a href="#proof" className="hover:text-gold transition-colors">
              Proof
            </a>
            <a href="#faq" className="hover:text-gold transition-colors">
              FAQ
            </a>
            <button
              onClick={() => onOpenApp('method')}
              className="hover:text-gold transition-colors cursor-pointer"
            >
              Method
            </button>
          </div>

          {/* Primary CTA */}
          <button
            onClick={onOpenLogin}
            className="px-5 py-2.5 rounded-pill bg-gold hover:opacity-90 text-[#0A0A0B] font-display font-bold text-xs tracking-wider transition-all shadow-[0_0_16px_rgba(214,178,106,0.2)] cursor-pointer"
          >
            Open GoldLens
          </button>
        </div>
      </nav>

      {/* 1. HERO */}
      <ConvergeHero settlementDate={settlementDate} onOpenApp={onOpenLogin} />

      {/* 2. MARQUEE STRIP */}
      <MarqueeStrip settlementDate={settlementDate} />

      {/* 3. THE PROBLEM */}
      <PerGramToggle />

      {/* 4. HOW IT WORKS */}
      <StickySteps />

      {/* 5. TODAY'S VERDICT TEASER */}
      <TodayTeaser />

      {/* 6. BUILT FOR */}
      <AudienceList />

      {/* 7. PROOF */}
      <ProofSection onOpenMethod={() => onOpenApp('method')} />

      {/* 8. FAQ */}
      <FaqAccordion />

      {/* 9. FINAL CTA */}
      <section className="py-28 px-6 text-center max-w-4xl mx-auto space-y-6">
        <h2 className="text-4xl sm:text-6xl font-display font-black uppercase tracking-tight text-text-primary">
          Know the price. Skip the noise.
        </h2>
        <p className="text-base sm:text-lg text-text-secondary font-mono max-w-lg mx-auto">
          Every MCX contract converted to ₹ per gram of fine gold with an honest verdict.
        </p>
        <div className="pt-2">
          <button
            onClick={onOpenLogin}
            className="px-8 py-3.5 rounded-pill bg-gold hover:opacity-90 text-[#0A0A0B] font-display font-bold text-sm tracking-wide transition-all shadow-[0_0_24px_rgba(214,178,106,0.3)] cursor-pointer"
          >
            Open GoldLens
          </button>
        </div>
      </section>

      {/* 10. FOOTER */}
      <Footer
        onNavigateTab={(tab) => onOpenApp(tab)}
        onOpenLegal={(type) => setLegalModal(type)}
      />

      {/* LOGIN OVERLAY SHEET */}
      <AuthSheet
        isOpen={isLoginOpen}
        onClose={onCloseLogin}
        onSuccess={() => {
          onCloseLogin();
          onOpenApp('today');
        }}
      />

      {/* SIMPLE LEGAL MODAL */}
      {legalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="p-8 rounded-card bg-surface border border-border max-w-lg w-full space-y-4 font-mono text-xs text-text-secondary">
            <div className="flex items-center justify-between text-text-primary font-bold">
              <span>{legalModal === 'terms' ? 'Terms of Service' : 'Privacy Policy'}</span>
              <button onClick={() => setLegalModal(null)} className="cursor-pointer text-text-muted hover:text-text-primary">✕</button>
            </div>
            <p>
              GoldLens is an educational research and analytics prototype built for Hack in Hills &apos;26. All analytics are computed from publicly released end-of-day MCX Bhavcopy settlements.
            </p>
            <p>
              GoldLens does not execute trades, accept customer funds, or operate as a SEBI registered broker or investment advisor.
            </p>
            <button
              onClick={() => setLegalModal(null)}
              className="w-full py-2 rounded-lg bg-elevated text-text-primary font-bold border border-border mt-4 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
