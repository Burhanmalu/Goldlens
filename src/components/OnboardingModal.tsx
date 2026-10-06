'use client';

import React from 'react';
import { Hexagon, Scale, Zap, ShieldCheck, ArrowRight, X } from 'lucide-react';

interface OnboardingModalProps {
  onClose: () => void;
}

export function OnboardingModal({ onClose }: OnboardingModalProps) {
  return (
    <div className="fixed inset-0 z-50 bg-background/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 select-none font-sans animate-fade-in">
      <div className="bg-[#161A1F] border border-gold/40 rounded-2xl p-5 sm:p-8 max-w-2xl w-full shadow-2xl relative space-y-4 sm:space-y-6 max-h-[92vh] overflow-y-auto no-scrollbar">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-text-secondary hover:text-foreground hover:bg-[#1C2128] rounded-full transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center touch-manipulation"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-gold to-amber-600 text-background mb-1 shadow-lg">
            <Hexagon size={24} className="fill-background stroke-background" />
          </div>
          <h2 className="text-2xl font-black text-foreground">Welcome to GoldLens</h2>
          <p className="text-sm text-text-secondary max-w-md mx-auto leading-relaxed">
            GoldLens compares fragmented MCX gold contracts on the same fine-gold economic unit to find defensible pricing opportunities.
          </p>
        </div>

        {/* 3-Step Visual Process */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
          <div className="p-4 bg-[#11151A] rounded-xl border border-[#2B3139] text-center space-y-2">
            <div className="w-8 h-8 rounded-lg bg-gold/10 text-gold flex items-center justify-center mx-auto">
              <Scale size={18} />
            </div>
            <div className="font-bold text-sm text-foreground">1. NORMALIZE</div>
            <p className="text-xs text-text-secondary font-sans leading-relaxed">
              We convert different contract sizes and purities into ₹/gram of fine gold.
            </p>
          </div>

          <div className="p-4 bg-[#11151A] rounded-xl border border-[#2B3139] text-center space-y-2">
            <div className="w-8 h-8 rounded-lg bg-blue/10 text-blue flex items-center justify-center mx-auto">
              <Zap size={18} />
            </div>
            <div className="font-bold text-sm text-foreground">2. FIND</div>
            <p className="text-xs text-text-secondary font-sans leading-relaxed">
              We identify unusual price differences after adjusting for carry and expiry.
            </p>
          </div>

          <div className="p-4 bg-[#11151A] rounded-xl border border-buy/30 text-center space-y-2">
            <div className="w-8 h-8 rounded-lg bg-buy/10 text-buy flex items-center justify-center mx-auto">
              <ShieldCheck size={18} />
            </div>
            <div className="font-bold text-sm text-buy">3. AUDIT</div>
            <p className="text-xs text-text-secondary font-sans leading-relaxed">
              We test whether the opportunity survives transaction costs and unseen data.
            </p>
          </div>
        </div>

        {/* Action CTA */}
        <div className="pt-2 text-center">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-gold hover:bg-gold-hover text-background font-bold text-sm rounded-xl transition-all shadow-lg hover:shadow-xl inline-flex items-center gap-2"
          >
            <span>Explore GoldLens</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
