'use client';
import { useEffect, useRef } from 'react';

// Theme accent color: #FF6B3D (rgb 255, 107, 61) — same as --accent token
export function GridBackground() {
  const revealRef = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Skip mouse tracking on touch devices — static grid still renders
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const reveal = revealRef.current!;
    const spot = spotRef.current!;

    let mx = -9999, my = -9999;
    let cx = mx, cy = my;
    let raf = 0;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };

    const tick = () => {
      cx = lerp(cx, mx, 0.09);
      cy = lerp(cy, my, 0.09);

      const mask = `radial-gradient(380px circle at ${cx}px ${cy}px, black 0%, black 25%, transparent 68%)`;
      reveal.style.webkitMaskImage = mask;
      reveal.style.maskImage = mask;

      const isDark = document.documentElement.classList.contains('dark');
      spot.style.background = isDark
        ? `radial-gradient(600px circle at ${cx}px ${cy}px, rgba(255,107,61,0.14) 0%, rgba(255,107,61,0.05) 45%, transparent 70%)`
        : `radial-gradient(600px circle at ${cx}px ${cy}px, rgba(255,107,61,0.10) 0%, rgba(255,107,61,0.03) 45%, transparent 70%)`;

      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  const G = '48px 48px';

  return (
    <div className="fixed inset-0 pointer-events-none z-0" aria-hidden>
      {/* Dim base grid lines */}
      <div className="absolute inset-0" style={{
        backgroundImage: [
          'linear-gradient(rgba(255,107,61,0.045) 1px, transparent 1px)',
          'linear-gradient(90deg, rgba(255,107,61,0.045) 1px, transparent 1px)',
        ].join(', '),
        backgroundSize: G,
      }} />

      {/* Dim intersection dots */}
      <div className="absolute inset-0" style={{
        backgroundImage: 'radial-gradient(circle, rgba(255,107,61,0.16) 0.9px, transparent 0.9px)',
        backgroundSize: G,
      }} />

      {/* Cursor-revealed bright layer (masked, hidden off-screen until hover) */}
      <div
        ref={revealRef}
        data-grid-reveal
        className="absolute inset-0"
        style={{
          WebkitMaskImage: 'radial-gradient(380px circle at -9999px -9999px, black 0%, transparent 68%)',
          maskImage: 'radial-gradient(380px circle at -9999px -9999px, black 0%, transparent 68%)',
        }}
      >
        {/* Vivid lines */}
        <div className="absolute inset-0" style={{
          backgroundImage: [
            'linear-gradient(rgba(255,107,61,0.6) 1px, transparent 1px)',
            'linear-gradient(90deg, rgba(255,107,61,0.6) 1px, transparent 1px)',
          ].join(', '),
          backgroundSize: G,
        }} />
        {/* Vivid dots */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,140,100,0.95) 1.1px, transparent 1.1px)',
          backgroundSize: G,
        }} />
        {/* Bloom behind lines */}
        <div className="absolute inset-0" style={{
          backgroundImage: [
            'linear-gradient(rgba(255,140,100,0.18) 3px, transparent 3px)',
            'linear-gradient(90deg, rgba(255,140,100,0.18) 3px, transparent 3px)',
          ].join(', '),
          backgroundSize: G,
          filter: 'blur(2px)',
        }} />
      </div>

      {/* Ambient halo that follows cursor */}
      <div ref={spotRef} className="absolute inset-0" />

      {/* Edge vignette — fades grid at page edges */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 100% 55% at 50% 0%, transparent 40%, var(--bg, #FAFAF7) 100%)',
      }} />
    </div>
  );
}
