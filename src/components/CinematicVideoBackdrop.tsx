'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface CinematicVideoBackdropProps {
  type: 'molten_gold' | 'bullion_vault' | 'ticker_grid' | 'geometry';
  opacity?: number;
  className?: string;
}

export function CinematicVideoBackdrop({
  type,
  opacity = 0.22,
  className = '',
}: CinematicVideoBackdropProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const yParallax = useTransform(scrollYProgress, [0, 1], [-20, 40]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none -z-10 ${className}`}
    >
      <motion.div
        style={{ scale, y: yParallax, opacity }}
        className="relative w-full h-full"
      >
        {/* Cinematic Molten Gold Simulation */}
        {type === 'molten_gold' && (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-600/30 via-gold/15 to-transparent blur-3xl animate-pulse-slow">
            <svg className="w-full h-full opacity-60 mix-blend-screen" viewBox="0 0 1000 600" preserveAspectRatio="none">
              <filter id="noiseFilter">
                <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="3" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="35" />
              </filter>
              <g filter="url(#noiseFilter)">
                <ellipse cx="500" cy="300" rx="420" ry="220" fill="url(#goldRadial)" />
                <path d="M 100 150 Q 500 50 900 250 T 400 550 Z" fill="rgba(214,178,106,0.2)" />
              </g>
              <defs>
                <radialGradient id="goldRadial" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#EBD08F" stopOpacity="0.8" />
                  <stop offset="60%" stopColor="#B8892E" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#0A0A0B" stopOpacity="0" />
                </radialGradient>
              </defs>
            </svg>
          </div>
        )}

        {/* Cinematic Bullion Grid & Vault Rays */}
        {type === 'bullion_vault' && (
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(214,178,106,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(214,178,106,0.04)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-gold/10 rounded-full blur-[100px]" />
          </div>
        )}

        {/* Quantitative Matrix Ticker Background */}
        {type === 'ticker_grid' && (
          <div className="absolute inset-0 flex items-center justify-center opacity-30 select-none">
            <div className="text-[140px] font-mono font-black text-white/[0.02] tracking-tighter uppercase rotate-[-6deg] whitespace-nowrap">
              MCX GOLD · 15067.44 · RESIDUAL · 0.05%
            </div>
          </div>
        )}

        {/* Sacred Quant Geometry */}
        {type === 'geometry' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[500px] h-[500px] rounded-full border border-gold/15 animate-spin-ultra-slow" />
            <div className="w-[720px] h-[720px] rounded-full border border-gold/10 animate-reverse-spin" />
          </div>
        )}
      </motion.div>

      {/* Edge gradient mask for seamless blending into #0A0A0B */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-transparent to-[#0A0A0B]" />
    </div>
  );
}
