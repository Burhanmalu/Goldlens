'use client';

/**
 * CinematicFilamentsVideo
 * ──────────────────────────────────────────────────────────────────────────
 * Renders the Google-Flow MP4 as a full-bleed, always-visible, looping
 * ambient video background.  No scroll-scrubbing — we just autoplay it.
 *
 * Place this as the first child of a `relative overflow-hidden` section.
 */

import React, { useRef, useEffect } from 'react';

interface Props {
  /** Peak opacity of the video layer (0–1). Default 0.5. */
  opacity?: number;
  className?: string;
}

export function CinematicFilamentsVideo({ opacity = 0.5, className = '' }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;           // required for autoplay in all browsers
    v.play().catch(() => {});  // attempt autoplay, ignore DOMException
  }, []);

  return (
    /* Outer — sized to fill the parent, clips overflow from scale/parallax */
    <div
      aria-hidden="true"
      className={`absolute inset-0 overflow-hidden pointer-events-none select-none ${className}`}
      style={{ zIndex: 0 }}
    >
      {/* Video — slightly over-sized so it never letterboxes */}
      <video
        ref={videoRef}
        src="/assets/cinematic/Gold_filaments_drifting_in_darkness_20261012135943.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        style={{ opacity }}
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* ── Gradient vignettes to blend into the dark page background without blacking out the filaments ── */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-transparent to-[#0A0A0B]/40" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0B]/40 via-transparent to-[#0A0A0B]/40" />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 50%, transparent 40%, #0A0A0B 90%)',
        }}
      />
    </div>
  );
}
