'use client';
import { useEffect, useRef } from 'react';

/**
 * Natural light-spread background.
 *  - A faint, theme-aware hairline grid (var --grid-line / --grid-dot).
 *  - Two large, slowly drifting ambient glows (the "light spread") that give
 *    the page an organic, breathing warmth instead of a rigid grid.
 *  - A gentle cursor-reveal that brightens the grid locally (desktop only).
 * All colours come from CSS tokens so it adapts to light / dark automatically.
 */
export function GridBackground() {
  const revealRef = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(pointer: coarse)').matches) return; // no tracking on touch

    const reveal = revealRef.current!;
    const spot = spotRef.current!;
    let mx = -9999, my = -9999, cx = mx, cy = my, raf = 0;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };

    const tick = () => {
      cx = lerp(cx, mx, 0.09);
      cy = lerp(cy, my, 0.09);
      const mask = `radial-gradient(340px circle at ${cx}px ${cy}px, black 0%, black 22%, transparent 70%)`;
      reveal.style.webkitMaskImage = mask;
      reveal.style.maskImage = mask;
      spot.style.background =
        `radial-gradient(520px circle at ${cx}px ${cy}px, var(--glow) 0%, transparent 68%)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('mousemove', onMove); };
  }, []);

  const G = '64px 64px';

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden>
      {/* Soft drifting ambient glows — the "light spread" */}
      <div className="absolute" style={{
        width: '70vw', height: '70vw', left: '-15vw', top: '-20vh',
        background: 'radial-gradient(circle at 50% 50%, var(--glow) 0%, transparent 70%)',
        filter: 'blur(8px)', animation: 'glowDrift1 26s ease-in-out infinite',
      }} />
      <div className="absolute" style={{
        width: '60vw', height: '60vw', right: '-12vw', bottom: '-18vh',
        background: 'radial-gradient(circle at 50% 50%, var(--glow-2) 0%, transparent 72%)',
        filter: 'blur(8px)', animation: 'glowDrift2 32s ease-in-out infinite',
      }} />

      {/* Faint hairline grid */}
      <div className="absolute inset-0" style={{
        backgroundImage: [
          'linear-gradient(var(--grid-line) 1px, transparent 1px)',
          'linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)',
        ].join(', '),
        backgroundSize: G,
        maskImage: 'radial-gradient(ellipse 90% 70% at 50% 35%, black 30%, transparent 92%)',
        WebkitMaskImage: 'radial-gradient(ellipse 90% 70% at 50% 35%, black 30%, transparent 92%)',
      }} />

      {/* Faint intersection dots */}
      <div className="absolute inset-0" style={{
        backgroundImage: 'radial-gradient(circle, var(--grid-dot) 1px, transparent 1px)',
        backgroundSize: G,
        maskImage: 'radial-gradient(ellipse 90% 70% at 50% 35%, black 30%, transparent 92%)',
        WebkitMaskImage: 'radial-gradient(ellipse 90% 70% at 50% 35%, black 30%, transparent 92%)',
      }} />

      {/* Cursor-revealed accent grid (desktop) */}
      <div
        ref={revealRef}
        data-grid-reveal
        className="absolute inset-0"
        style={{
          WebkitMaskImage: 'radial-gradient(340px circle at -9999px -9999px, black 0%, transparent 70%)',
          maskImage: 'radial-gradient(340px circle at -9999px -9999px, black 0%, transparent 70%)',
        }}
      >
        <div className="absolute inset-0" style={{
          backgroundImage: [
            'linear-gradient(rgba(var(--ink-mute-rgb) / 0.55) 1px, transparent 1px)',
            'linear-gradient(90deg, rgba(var(--ink-mute-rgb) / 0.55) 1px, transparent 1px)',
          ].join(', '),
          backgroundSize: G,
        }} />
        {/* Intersection dots — monochrome, theme-aware (brightens the grid the
            cursor passes over without breaking the strict black/white palette). */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, rgba(var(--ink-rgb) / 0.85) 1.1px, transparent 1.1px)',
          backgroundSize: G,
        }} />
      </div>

      {/* Ambient halo following the cursor */}
      <div ref={spotRef} className="absolute inset-0" />

      {/* Edge vignette → blends into page bg (neutralised in dark mode so the
          global aurora shows through — see .grid-bg-vignette in globals.css) */}
      <div className="grid-bg-vignette absolute inset-0" style={{
        background: 'radial-gradient(ellipse 100% 60% at 50% 0%, transparent 45%, var(--bg) 100%)',
      }} />
    </div>
  );
}
