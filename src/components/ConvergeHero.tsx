'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import { CinematicCanvas } from '@/components/CinematicCanvas';
import { CinematicFilamentsVideo } from '@/components/CinematicFilamentsVideo';
import { CinematicAssetBackdrop } from '@/components/CinematicAssetBackdrop';

interface ConvergeHeroProps {
  settlementDate: string;
  onOpenApp: () => void;
}

export function ConvergeHero({ settlementDate, onOpenApp }: ConvergeHeroProps) {
  const [istTime, setIstTime] = useState<string>('--:--:--');

  useEffect(() => {
    const update = () => {
      setIstTime(
        new Date().toLocaleTimeString('en-GB', { timeZone: 'Asia/Kolkata', hour12: false })
      );
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    /* Full-bleed section — backdrops can fill this freely */
    <section className="relative min-h-screen flex flex-col justify-between pt-28 pb-12 overflow-hidden">

      {/* ── LAYER 0: Drifting gold filaments video (Google Flow) — HERO FEATURE ── */}
      <CinematicFilamentsVideo opacity={0.85} />


      {/* ── LAYER 2: Canvas particle field ── */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        <CinematicCanvas intensity={0.8} mode="hero" />
      </div>

      {/* ─────────── Content (constrained) ─────────── */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 flex flex-col flex-1 justify-between">
        <div className="flex flex-col items-center text-center space-y-6 pt-8 sm:pt-16">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs uppercase tracking-[0.12em] font-mono text-[#A29C8E]">
            <span>MCX GOLD</span>
            <span className="text-[#D6B26A]">·</span>
            <span>ONE PRICE PER GRAM</span>
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-display font-black uppercase tracking-[-0.03em] leading-[0.92] text-[#F5F2EA]">
            SAME GOLD.{' '}
            <span className="font-serif-italic lowercase text-[#D6B26A] font-normal px-1">
              one true
            </span>{' '}
            PRICE.
          </h1>

          <p className="text-base sm:text-xl text-[#A29C8E] max-w-2xl font-normal leading-relaxed">
            Four MCX gold contracts, normalized to a single price per gram, with an
            honest answer on whether anything is worth doing today.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={onOpenApp}
              className="px-8 py-3.5 rounded-full bg-[#D6B26A] hover:opacity-90 text-[#0A0A0B] font-display font-bold text-sm tracking-wide transition-all shadow-[0_0_32px_rgba(214,178,106,0.35)] cursor-pointer"
            >
              Open GoldLens
            </button>
            <a
              href="#problem"
              className="px-6 py-3.5 rounded-full bg-white/5 hover:bg-white/10 text-[#A29C8E] hover:text-[#F5F2EA] border border-white/10 font-medium text-sm transition-all"
            >
              How it works
            </a>
          </div>
        </div>

        {/* Convergence SVG */}
        <div className="w-full max-w-4xl mx-auto my-8 h-40 sm:h-48 relative flex items-center justify-center">
          <svg viewBox="0 0 800 160" className="w-full h-full overflow-visible" fill="none">
            {(['M 20 20 C 300 20, 500 80, 780 80', 'M 20 50 C 300 50, 500 80, 780 80', 'M 20 110 C 300 110, 500 80, 780 80', 'M 20 140 C 300 140, 500 80, 780 80'] as const).map((d, i) => (
              <motion.path
                key={i}
                d={d}
                stroke="url(#goldGradient)"
                strokeWidth="1.5"
                strokeOpacity={0.4 + (i === 1 ? 0.1 : 0)}
                initial={{ pathLength: 0.2, opacity: 0.3 }}
                animate={{ pathLength: 1, opacity: 0.7 }}
                transition={{ duration: 2.4, ease: [0.2, 0.8, 0.2, 1] }}
              />
            ))}
            {(['GOLDM (10g / 995)', 'GOLDTEN (10g / 999)', 'GOLDGUINEA (8g / 999)', 'GOLDPETAL (1g / 999)'] as const).map((label, i) => (
              <text key={label} x="24" y={[16, 46, 126, 154][i]} fill="#A29C8E" fontSize="10" fontFamily="JetBrains Mono">
                {label}
              </text>
            ))}
            <motion.line x1="520" y1="80" x2="780" y2="80" stroke="#D6B26A" strokeWidth="3"
              filter="drop-shadow(0 0 8px rgba(214,178,106,0.8))"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6, duration: 1 }} />
            <text x="610" y="70" fill="#D6B26A" fontSize="11" fontWeight="bold" fontFamily="JetBrains Mono">₹ / gram fine gold</text>
            <defs>
              <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#A29C8E" stopOpacity="0.3" />
                <stop offset="60%" stopColor="#D6B26A" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#EBD08F" stopOpacity="1" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Bottom bar */}
        <div className="w-full border-t border-white/[0.08] pt-6 flex flex-wrap items-center justify-between text-xs font-mono text-[#6F6A5F] gap-4">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D6B26A] animate-pulse" />
            <span>IST</span>
            <span className="text-[#F5F2EA] tabular-nums font-semibold">{istTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>MCX Bhavcopy settlement:</span>
            <span className="text-[#A29C8E] font-medium">{settlementDate}</span>
            <span className="px-2 py-0.5 rounded text-[10px] bg-[#D6B26A]/15 text-[#D6B26A] font-medium border border-[#D6B26A]/30">
              mcxindia.com
            </span>
          </div>
          <div>Next update: after the next settlement</div>
        </div>
      </div>
    </section>
  );
}
