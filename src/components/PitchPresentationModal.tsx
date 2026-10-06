'use client';

import React, { useState } from 'react';
import { Hexagon, Play, ArrowRight, ArrowLeft, X } from 'lucide-react';

interface PitchPresentationModalProps {
  onClose: () => void;
  onLaunchDemo: () => void;
}

export function PitchPresentationModal({
  onClose,
  onLaunchDemo,
}: PitchPresentationModalProps) {
  const [slide, setSlide] = useState(0);

  const slides = [
    {
      title: 'GOLDLENS',
      subtitle: 'MCX Gold Cross-Contract Intelligence',
      tagline: 'Same Gold. Different Contracts. Different Prices.',
      content: (
        <div className="space-y-6 max-w-2xl mx-auto text-left">
          <div className="p-4 bg-secondary/80 rounded-xl border border-border">
            <h4 className="text-gold font-bold text-sm mb-2 font-mono">THE PROBLEM:</h4>
            <p className="text-text-secondary text-sm leading-relaxed">
              MCX offers 4 distinct gold futures (GOLDM, GOLDTEN, GOLDGUINEA, GOLDPETAL) representing the exact same underlying metal, but quoted in different sizes (100g, 10g, 8g, 1g) and purities (995 vs 999).
            </p>
          </div>
          <div className="p-4 bg-gold/10 rounded-xl border border-gold/40">
            <h4 className="text-gold font-bold text-sm mb-2 font-mono">THE SOLUTION:</h4>
            <p className="text-foreground text-sm leading-relaxed">
              GoldLens normalizes every contract to ₹/gram of fine gold, isolates residual dislocations, subtracts carry & transaction costs, and tests signals through an 8-step Alpha Audit.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: 'THE 4-PILLAR ARCHITECTURE',
      subtitle: 'From Raw Price Differences to Defensible Market Intelligence',
      tagline: 'Not every price difference is an opportunity.',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left font-mono">
          <div className="p-4 bg-secondary rounded-xl border border-border">
            <div className="text-gold font-bold text-lg mb-1">01. NORMALIZE</div>
            <div className="text-xs text-foreground font-semibold mb-2">₹/g Fine Gold</div>
            <p className="text-[11px] text-text-secondary font-sans leading-relaxed">
              Maps all nominal quotes into single standard units of 999 fine gold.
            </p>
          </div>

          <div className="p-4 bg-secondary rounded-xl border border-border">
            <div className="text-blue font-bold text-lg mb-1">02. DISCOVER</div>
            <div className="text-xs text-foreground font-semibold mb-2">Residual Dislocation</div>
            <p className="text-[11px] text-text-secondary font-sans leading-relaxed">
              Subtracts cost of carry & storage across asymmetric expiration dates.
            </p>
          </div>

          <div className="p-4 bg-secondary rounded-xl border border-border">
            <div className="text-amber-400 font-bold text-lg mb-1">03. AUDIT</div>
            <div className="text-xs text-foreground font-semibold mb-2">Alpha Robustness</div>
            <p className="text-[11px] text-text-secondary font-sans leading-relaxed">
              Friction, slippage, randomized entry, and walk-forward verification.
            </p>
          </div>

          <div className="p-4 bg-buy/10 rounded-xl border border-buy/40">
            <div className="text-buy font-bold text-lg mb-1">04. SURVIVE</div>
            <div className="text-xs text-buy font-semibold mb-2">Tradable Edge</div>
            <p className="text-[11px] text-text-secondary font-sans leading-relaxed">
              Only defensible, economically viable signals receive the final trade badge.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: 'ALPHA AUDIT: KILLING PHANTOM PROFITS',
      subtitle: 'The GoldLens Signature Difference',
      tagline: 'Gross spread (+0.42%) → Carry (-0.09%) → Friction (-0.12%) = True Edge (+0.12%)',
      content: (
        <div className="max-w-2xl mx-auto text-center space-y-4 font-mono">
          <div className="p-5 bg-panel rounded-xl border border-gold/50 shadow-2xl space-y-3 text-left">
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-muted text-xs">PAIR DISLOCATION:</span>
              <span className="text-foreground font-bold text-sm">GOLDM / GOLDTEN</span>
            </div>
            <div className="flex justify-between border-b border-border pb-2 text-xs">
              <span className="text-muted">Observed Raw Dislocation:</span>
              <span className="text-foreground font-semibold">+0.42%</span>
            </div>
            <div className="flex justify-between border-b border-border pb-2 text-xs">
              <span className="text-muted">Carry Cost Adjustment:</span>
              <span className="text-sell">-0.09%</span>
            </div>
            <div className="flex justify-between border-b border-border pb-2 text-xs">
              <span className="text-muted">STT + MCX Charges + Slippage:</span>
              <span className="text-sell">-0.12%</span>
            </div>
            <div className="flex justify-between text-sm font-bold pt-1">
              <span className="text-gold">SURVIVING TRADABLE EDGE:</span>
              <span className="text-buy font-black text-base">+0.12% (Sharpe 1.84)</span>
            </div>
          </div>

          <div className="text-xs text-text-secondary font-sans italic">
            &quot;Only genuine, tradeable edges survive.&quot;
          </div>
        </div>
      ),
    },
  ];

  const currentSlide = slides[slide];

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-8 select-none font-sans overflow-y-auto no-scrollbar">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-0">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-gold to-amber-600 rounded-lg flex items-center justify-center text-background font-black shadow flex-shrink-0">
            <Hexagon size={18} className="fill-background stroke-background" />
          </div>
          <span className="font-extrabold text-sm tracking-widest text-foreground font-mono">
            GOLD<span className="text-gold">LENS</span>
          </span>
          <span className="text-[11px] sm:text-xs text-muted font-mono ml-1 sm:ml-2">
            PITCH ({slide + 1}/{slides.length})
          </span>
        </div>

        <button
          onClick={onClose}
          className="p-2 text-text-secondary hover:text-foreground hover:bg-panel rounded-full transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center touch-manipulation"
        >
          <X size={20} />
        </button>
      </div>

      {/* Main Slide Content */}
      <div className="max-w-4xl mx-auto text-center space-y-4 sm:space-y-6 my-auto py-4 animate-fade-in w-full">
        <div className="space-y-1.5 sm:space-y-2">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight font-serif">
            {currentSlide.title}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gold font-mono font-bold">
            {currentSlide.subtitle}
          </p>
          <p className="text-xs md:text-sm text-text-secondary font-mono italic">
            {currentSlide.tagline}
          </p>
        </div>

        <div className="py-2 sm:py-4">{currentSlide.content}</div>
      </div>

      {/* Bottom Slide Navigation & Demo Launch CTA */}
      <div className="flex flex-col sm:flex-row items-center justify-between max-w-4xl mx-auto w-full pt-4 sm:pt-6 border-t border-border gap-3">
        <div className="flex items-center gap-2 order-2 sm:order-1">
          {slide > 0 && (
            <button
              onClick={() => setSlide(slide - 1)}
              className="px-4 py-2 bg-panel hover:bg-panel-hover text-foreground rounded-lg font-mono text-xs transition-colors flex items-center gap-1.5 min-h-[40px] touch-manipulation"
            >
              <ArrowLeft size={14} />
              <span>Previous</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end order-1 sm:order-2">
          {slide < slides.length - 1 ? (
            <button
              onClick={() => setSlide(slide + 1)}
              className="px-4 sm:px-6 py-2 sm:py-2.5 bg-panel hover:bg-panel-hover text-gold border border-gold/40 rounded-lg font-mono text-xs font-bold transition-colors flex items-center justify-center gap-1.5 min-h-[40px] flex-1 sm:flex-none touch-manipulation"
            >
              <span>Next Slide</span>
              <ArrowRight size={14} />
            </button>
          ) : null}

          <button
            onClick={() => {
              onClose();
              onLaunchDemo();
            }}
            className="px-4 sm:px-6 py-2 sm:py-2.5 bg-gold hover:bg-gold-hover text-background rounded-lg font-mono text-xs font-black transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl min-h-[40px] flex-1 sm:flex-none touch-manipulation"
          >
            <Play size={14} className="fill-background" />
            <span>START DEMO →</span>
          </button>
        </div>
      </div>
    </div>
  );
}
