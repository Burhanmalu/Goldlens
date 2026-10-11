'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';

interface CinematicAssetBackdropProps {
  asset: 'hero_convergence' | 'gold_waves' | 'monolith_card';
  opacity?: number;
  parallaxSpeed?: number;
  scaleRange?: [number, number];
  className?: string;
  blendMode?: 'screen' | 'lighten' | 'normal' | 'soft-light';
}

export function CinematicAssetBackdrop({
  asset,
  opacity = 0.35,
  parallaxSpeed = 60,
  scaleRange = [1, 1.12],
  className = '',
  blendMode = 'screen',
}: CinematicAssetBackdropProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const scale = useTransform(scrollYProgress, [0, 1], scaleRange);
  const y = useTransform(scrollYProgress, [0, 1], [-parallaxSpeed, parallaxSpeed]);

  const assetSrc = `/assets/cinematic/${asset}.jpg`;

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none -z-10 ${className}`}
    >
      <motion.div
        style={{ scale, y, opacity }}
        className="relative w-full h-full will-change-transform"
      >
        <Image
          src={assetSrc}
          alt="Cinematic background animation visual"
          fill
          priority={asset === 'hero_convergence'}
          className={`object-cover object-center filter contrast-125 brightness-95 ${
            blendMode === 'screen' ? 'mix-blend-screen' : ''
          }`}
        />
        {/* Subtle breathing ambient bloom */}
        <div className="absolute inset-0 bg-radial-gradient from-gold/10 via-transparent to-transparent animate-pulse-slow pointer-events-none" />
      </motion.div>

      {/* Deep smooth vignette masks for seamless integration with #0A0A0B canvas */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-transparent to-[#0A0A0B]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0B] via-transparent to-[#0A0A0B]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,#0A0A0B_95%)]" />
    </div>
  );
}
