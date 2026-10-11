'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import { CinematicCanvas } from '@/components/CinematicCanvas';
import { CinematicVideoBackdrop } from '@/components/CinematicVideoBackdrop';
import { CinematicAssetBackdrop } from '@/components/CinematicAssetBackdrop';

interface ConvergeHeroProps {
  settlementDate: string;
  onOpenApp: () => void;
}

export function ConvergeHero({ settlementDate, onOpenApp }: ConvergeHeroProps) {
  const [istTime, setIstTime] = useState<string>('21:07:55');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const istString = now.toLocaleTimeString('en-GB', {
        timeZone: 'Asia/Kolkata',
        hour12: false,
      });
      setIstTime(istString);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-between pt-28 pb-12 px-6 max-w-7xl mx-auto overflow-hidden">
      {/* Background Cinematic Convergence Clip & Particle Shaders */}
      <CinematicAssetBackdrop asset="hero_convergence" opacity={0.42} parallaxSpeed={80} scaleRange={[1, 1.15]} />
      <CinematicCanvas intensity={0.9} mode="hero" />
      <CinematicVideoBackdrop type="molten_gold" opacity={0.25} />

      <div className="flex flex-col items-center text-center space-y-6 pt-8 sm:pt-16 max-w-4xl mx-auto">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-pill bg-surface border border-border text-xs uppercase tracking-[0.12em] font-mono text-text-secondary">
          <span>MCX GOLD</span>
          <span className="text-gold">·</span>
          <span>ONE PRICE PER GRAM</span>
        </div>

        {/* Huge Display Heading */}
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-display font-black uppercase tracking-[-0.03em] leading-[0.92] text-text-primary">
          SAME GOLD.{' '}
          <span className="font-serif-italic lowercase text-gold font-normal px-1">
            one true
          </span>{' '}
          PRICE.
        </h1>

        {/* Calm Subhead */}
        <p className="text-base sm:text-xl text-text-secondary max-w-2xl font-normal leading-relaxed">
          Four MCX gold contracts, normalized to a single price per gram, with an honest answer on whether anything is worth doing today.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={onOpenApp}
            className="px-8 py-3.5 rounded-pill bg-gold hover:opacity-90 text-[#0A0A0B] font-display font-bold text-sm tracking-wide transition-all shadow-[0_0_24px_rgba(214,178,106,0.25)] cursor-pointer"
          >
            Open GoldLens
          </button>
          <a
            href="#problem"
            className="px-6 py-3.5 rounded-pill bg-surface hover:bg-elevated text-text-secondary hover:text-text-primary border border-border font-medium text-sm transition-all"
          >
            How it works
          </a>
        </div>
      </div>

      {/* Code-driven Convergence Visual */}
      <div className="w-full max-w-4xl mx-auto my-8 h-40 sm:h-48 relative flex items-center justify-center">
        <svg
          viewBox="0 0 800 160"
          className="w-full h-full overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Track 1: GOLDM (Starts High) */}
          <motion.path
            d="M 20 20 C 300 20, 500 80, 780 80"
            stroke="url(#goldGradient)"
            strokeWidth="1.5"
            strokeOpacity="0.4"
            initial={{ pathLength: 0.2, opacity: 0.3 }}
            animate={{ pathLength: 1, opacity: 0.7 }}
            transition={{ duration: 2.4, ease: [0.2, 0.8, 0.2, 1] }}
          />
          <text x="24" y="16" fill="#A29C8E" fontSize="10" fontFamily="JetBrains Mono">
            GOLDM (10g / 995)
          </text>

          {/* Track 2: GOLDTEN */}
          <motion.path
            d="M 20 50 C 300 50, 500 80, 780 80"
            stroke="url(#goldGradient)"
            strokeWidth="1.5"
            strokeOpacity="0.5"
            initial={{ pathLength: 0.2, opacity: 0.3 }}
            animate={{ pathLength: 1, opacity: 0.7 }}
            transition={{ duration: 2.4, ease: [0.2, 0.8, 0.2, 1] }}
          />
          <text x="24" y="46" fill="#A29C8E" fontSize="10" fontFamily="JetBrains Mono">
            GOLDTEN (10g / 999)
          </text>

          {/* Track 3: GOLDGUINEA */}
          <motion.path
            d="M 20 110 C 300 110, 500 80, 780 80"
            stroke="url(#goldGradient)"
            strokeWidth="1.5"
            strokeOpacity="0.4"
            initial={{ pathLength: 0.2, opacity: 0.3 }}
            animate={{ pathLength: 1, opacity: 0.7 }}
            transition={{ duration: 2.4, ease: [0.2, 0.8, 0.2, 1] }}
          />
          <text x="24" y="126" fill="#A29C8E" fontSize="10" fontFamily="JetBrains Mono">
            GOLDGUINEA (8g / 999)
          </text>

          {/* Track 4: GOLDPETAL (Starts Low) */}
          <motion.path
            d="M 20 140 C 300 140, 500 80, 780 80"
            stroke="url(#goldGradient)"
            strokeWidth="1.5"
            strokeOpacity="0.4"
            initial={{ pathLength: 0.2, opacity: 0.3 }}
            animate={{ pathLength: 1, opacity: 0.7 }}
            transition={{ duration: 2.4, ease: [0.2, 0.8, 0.2, 1] }}
          />
          <text x="24" y="154" fill="#A29C8E" fontSize="10" fontFamily="JetBrains Mono">
            GOLDPETAL (1g / 999)
          </text>

          {/* Converged Center Line */}
          <motion.line
            x1="520"
            y1="80"
            x2="780"
            y2="80"
            stroke="#D6B26A"
            strokeWidth="3"
            filter="drop-shadow(0 0 8px rgba(214,178,106,0.8))"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 1 }}
          />
          <text x="610" y="70" fill="#D6B26A" fontSize="11" fontWeight="bold" fontFamily="JetBrains Mono">
            ₹ / gram fine gold
          </text>

          <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#A29C8E" stopOpacity="0.3" />
              <stop offset="60%" stopColor="#D6B26A" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#EBD08F" stopOpacity="1" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Moto-style Clocks / Timestamps */}
      <div className="w-full border-t border-border pt-6 flex flex-wrap items-center justify-between text-xs font-mono text-text-muted gap-4">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
          <span>IST</span>
          <span className="text-text-primary tabular-nums font-semibold">{istTime}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-text-muted">Last MCX settlement:</span>
          <span className="text-text-secondary font-medium">{settlementDate}</span>
          <span className="px-1.5 py-0.5 rounded text-[10px] bg-caution/15 text-caution font-medium border border-caution/30">
            Sample data
          </span>
        </div>

        <div className="text-text-muted">
          Next update: after the next settlement
        </div>
      </div>
    </section>
  );
}
