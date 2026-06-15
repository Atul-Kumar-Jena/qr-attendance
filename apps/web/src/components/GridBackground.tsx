'use client';
import { useEffect, useRef } from 'react';

/**
 * Deep atmospheric backdrop — a dark, softly-drifting iridescent gradient field
 * with a faint grid and (on desktop) a cursor-revealed glow. GPU-composited
 * transforms only, so it stays cheap during fast scroll.
 */
export function GridBackground() {
  const spotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const spot = spotRef.current!;
    let mx = -9999, my = -9999, cx = mx, cy = my, raf = 0;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };

    const tick = () => {
      cx = lerp(cx, mx, 0.09);
      cy = lerp(cy, my, 0.09);
      spot.style.background =
        `radial-gradient(560px circle at ${cx}px ${cy}px, rgba(46,138,92,0.12) 0%, rgba(234,215,155,0.05) 42%, transparent 70%)`;
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('mousemove', onMove); };
  }, []);

  const G = '54px 54px';

  return (
    <div className="atmos" aria-hidden>
      {/* Base wash */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(120% 90% at 50% -10%, rgba(20,54,38,0.35), transparent 60%)',
      }} />

      {/* Drifting iridescent blobs */}
      <div className="atmos-blob" style={{
        width: '46vw', height: '46vw', left: '-8vw', top: '-6vw',
        background: 'radial-gradient(circle, rgba(234,215,155,0.5), transparent 65%)',
        animation: 'drift1 26s ease-in-out infinite',
      }} />
      <div className="atmos-blob" style={{
        width: '50vw', height: '50vw', right: '-12vw', top: '8vh',
        background: 'radial-gradient(circle, rgba(46,138,92,0.55), transparent 65%)',
        animation: 'drift2 32s ease-in-out infinite',
      }} />
      <div className="atmos-blob" style={{
        width: '40vw', height: '40vw', left: '20vw', bottom: '-12vh',
        background: 'radial-gradient(circle, rgba(215,182,90,0.5), transparent 65%)',
        animation: 'drift3 38s ease-in-out infinite',
      }} />

      {/* Faint grid */}
      <div className="absolute inset-0" style={{
        backgroundImage: [
          'linear-gradient(rgba(205,212,175,0.045) 1px, transparent 1px)',
          'linear-gradient(90deg, rgba(205,212,175,0.045) 1px, transparent 1px)',
        ].join(', '),
        backgroundSize: G,
        maskImage: 'radial-gradient(120% 100% at 50% 0%, black, transparent 80%)',
        WebkitMaskImage: 'radial-gradient(120% 100% at 50% 0%, black, transparent 80%)',
      }} />

      {/* Cursor glow (desktop) */}
      <div ref={spotRef} className="absolute inset-0" />

      {/* Edge vignette toward the page bg */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 100% 60% at 50% 0%, transparent 45%, var(--bg) 100%)',
      }} />
    </div>
  );
}
