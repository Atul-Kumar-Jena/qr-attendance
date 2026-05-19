'use client';

import { useEffect, useRef } from 'react';

export function GridBackground() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const glow = glowRef.current!;
    let rafId = 0;
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let cx = mx;
    let cy = my;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };

    const tick = () => {
      cx = lerp(cx, mx, 0.08);
      cy = lerp(cy, my, 0.08);
      glow.style.background = `radial-gradient(700px circle at ${cx}px ${cy}px, rgba(255,107,61,0.04) 0%, rgba(255,107,61,0.015) 30%, transparent 70%)`;
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0" aria-hidden>
      {/* Static grid lines */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,107,61,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,107,61,0.025) 1px, transparent 1px)
          `,
          backgroundSize: '72px 72px',
        }}
      />
      {/* Mouse-following glow */}
      <div ref={glowRef} className="absolute inset-0 transition-none" />
      {/* Fade edges so grid doesn't bleed */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 80% 50% at 50% 0%, transparent 60%, var(--bg) 100%)',
      }} />
    </div>
  );
}
