'use client';

/**
 * CinematicAssetBackdrop
 * ──────────────────────────────────────────────────────────────────────────
 * Renders one of the three cinematic still images as a full-bleed,
 * always-visible background with a gentle scroll-driven parallax.
 *
 * Place this as the first child of a `relative overflow-hidden` section.
 */

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';

type Asset = 'hero_convergence' | 'gold_waves' | 'monolith_card';

interface Props {
  asset: Asset;
  /** Visible opacity of the image (0–1). Default 0.5. */
  opacity?: number;
  /** Pixels to shift vertically at full scroll extent. Default 60. */
  parallaxPx?: number;
  priority?: boolean;
  className?: string;
}

export function CinematicAssetBackdrop({
  asset,
  opacity = 0.5,
  parallaxPx = 60,
  priority = false,
  className = '',
}: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);

  /* useScroll targeting the *parent* element (the section) */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  /* Simple parallax — no opacity animation so the image is always visible */
  const y = useTransform(scrollYProgress, [0, 1], [`-${parallaxPx}px`, `${parallaxPx}px`]);

  return (
    <div
      ref={sectionRef}
      aria-hidden="true"
      className={`absolute inset-0 overflow-hidden pointer-events-none select-none ${className}`}
      style={{ zIndex: 0 }}
    >
      <motion.div
        style={{ y }}
        className="absolute inset-[-8%] will-change-transform"
      >
        <Image
          src={`/assets/cinematic/${asset}.webp`}
          alt=""
          fill
          unoptimized
          priority={priority}
          style={{ opacity }}
          className="object-cover object-center"
        />
      </motion.div>

      {/* ── Gradient vignettes ── */}
      <div className="absolute inset-0 bg-gradient-to-t  from-[#0A0A0B] via-[#0A0A0B]/10 to-[#0A0A0B]/70" />
      <div className="absolute inset-0 bg-gradient-to-r  from-[#0A0A0B]/60 via-transparent to-[#0A0A0B]/60" />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 70% at 50% 50%, transparent 25%, #0A0A0B 95%)',
        }}
      />
    </div>
  );
}
