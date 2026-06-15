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
        `radial-gradient(560px circle at ${cx}px ${cy}px, rgb(var(--accent-rgb) / 0.13) 0%, rgb(var(--accent-rgb) / 0.04) 42%, transparent 70%)`;
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
        background: 'radial-gradient(120% 90% at 50% -10%, var(--atmos-wash), transparent 60%)',
      }} />

      {/* Drifting aurora blobs (colours driven by Palette Studio) */}
      <div className="atmos-blob" style={{
        width: '46vw', height: '46vw', left: '-8vw', top: '-6vw',
        background: 'radial-gradient(circle, var(--atmos-1), transparent 65%)',
        animation: 'drift1 26s ease-in-out infinite',
      }} />
      <div className="atmos-blob" style={{
        width: '50vw', height: '50vw', right: '-12vw', top: '8vh',
        background: 'radial-gradient(circle, var(--atmos-2), transparent 65%)',
        animation: 'drift2 32s ease-in-out infinite',
      }} />
      <div className="atmos-blob" style={{
        width: '40vw', height: '40vw', left: '20vw', bottom: '-12vh',
        background: 'radial-gradient(circle, var(--atmos-3), transparent 65%)',
        animation: 'drift3 38s ease-in-out infinite',
      }} />

      {/* Faint grid */}
      <div className="absolute inset-0" style={{
        backgroundImage: [
          'linear-gradient(var(--atmos-grid) 1px, transparent 1px)',
          'linear-gradient(90deg, var(--atmos-grid) 1px, transparent 1px)',
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
