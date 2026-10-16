'use client';

import React, { useEffect, useRef } from 'react';

interface CinematicCanvasProps {
  intensity?: number;
  mode?: 'hero' | 'tunnel' | 'waves' | 'constellation';
}

export function CinematicCanvas({ intensity = 1, mode = 'hero' }: CinematicCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle nodes for liquid gold motion
    const numParticles = mode === 'hero' ? 45 : 30;
    const particles = Array.from({ length: numParticles }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4 * intensity,
      vy: (Math.random() - 0.5) * 0.4 * intensity,
      radius: Math.random() * 2 + 0.8,
      alpha: Math.random() * 0.5 + 0.2,
      phase: Math.random() * Math.PI * 2,
    }));

    let t = 0;

    const render = () => {
      t += 0.008;
      ctx.clearRect(0, 0, width, height);

      // Deep atmospheric amber vignette gradient
      const grad = ctx.createRadialGradient(
        width * 0.5 + Math.sin(t * 0.5) * 100,
        height * 0.4 + Math.cos(t * 0.4) * 50,
        50,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.7
      );
      grad.addColorStop(0, 'rgba(214, 178, 106, 0.08)');
      grad.addColorStop(0.5, 'rgba(184, 137, 46, 0.03)');
      grad.addColorStop(1, 'rgba(10, 10, 11, 0)');

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Render glowing fluid harmonic curves
      if (mode === 'hero' || mode === 'waves') {
        for (let wave = 0; wave < 3; wave++) {
          ctx.beginPath();
          ctx.lineWidth = wave === 1 ? 1.5 : 1;
          const alpha = (0.15 - wave * 0.03) * intensity;
          ctx.strokeStyle = `rgba(235, 208, 143, ${alpha})`;

          const yOffset = height * (0.45 + wave * 0.08);
          for (let x = 0; x <= width; x += 15) {
            const y =
              yOffset +
              Math.sin(x * 0.003 + t + wave) * 35 +
              Math.cos(x * 0.006 - t * 0.8) * 15;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
      }

      // Render drifting gold specks & interconnected constellation lines
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const dynamicAlpha = (p.alpha + Math.sin(t * 2 + p.phase) * 0.15) * intensity;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(214, 178, 106, ${Math.max(0.05, dynamicAlpha)})`;
        ctx.shadowColor = '#D6B26A';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Subtle lines connecting close nodes
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 110) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(214, 178, 106, ${(0.08 - dist / 110 * 0.08) * intensity})`;
            ctx.lineWidth = 0.6;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [intensity, mode]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none -z-10"
    />
  );
}
