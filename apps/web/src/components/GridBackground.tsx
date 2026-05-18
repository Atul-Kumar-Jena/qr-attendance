'use client';
import { useEffect, useRef } from 'react';

export function GridBackground() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const glow = glowRef.current!;
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let cx = mx, cy = my;
    let raf = 0;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };

    const tick = () => {
      cx = lerp(cx, mx, 0.06);
      cy = lerp(cy, my, 0.06);
      const isDark = document.documentElement.classList.contains('dark');
      if (isDark) {
        glow.style.background = `radial-gradient(800px circle at ${cx}px ${cy}px, rgba(139,92,246,0.08) 0%, rgba(99,102,241,0.04) 35%, transparent 65%)`;
      } else {
        glow.style.background = `radial-gradient(800px circle at ${cx}px ${cy}py, rgba(139,92,246,0.05) 0%, rgba(99,102,241,0.025) 35%, transparent 65%)`;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0" aria-hidden>
      {/* Primary grid lines — very subtle */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: [
            'linear-gradient(rgba(139,92,246,0.045) 1px, transparent 1px)',
            'linear-gradient(90deg, rgba(139,92,246,0.045) 1px, transparent 1px)',
          ].join(', '),
          backgroundSize: '48px 48px',
        }}
      />
      {/* Intersection dots — barely visible accent */}
      <div
        className="absolute inset-0 hidden dark:block"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(139,92,246,0.18) 0.8px, transparent 0.8px)',
          backgroundSize: '48px 48px',
        }}
      />
      <div
        className="absolute inset-0 block dark:hidden"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(139,92,246,0.12) 0.8px, transparent 0.8px)',
          backgroundSize: '48px 48px',
        }}
      />
      {/* Mouse-following glow */}
      <div ref={glowRef} className="absolute inset-0 transition-none" />
      {/* Fade edges */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 90% 60% at 50% 0%, transparent 50%, var(--bg, #FAFAF7) 100%)',
      }} />
    </div>
  );
}
