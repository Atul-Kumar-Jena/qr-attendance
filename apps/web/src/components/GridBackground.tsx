'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { initGSAP } from '@/lib/gsap-init';

/**
 * Natural light-spread background.
 *  - A faint, theme-aware hairline grid + intersection dots (static, cheap).
 *  - Two large, slowly drifting ambient glows (CSS transform → compositor).
 *  - A cursor halo + grid-reveal that follow the pointer using ONLY GPU
 *    transforms (no per-frame mask/background-gradient recompute), driven by
 *    GSAP's single ticker and short-circuited when the pointer is idle.
 * All colours come from CSS tokens so it adapts to light / dark automatically.
 */
const TILE = 560;          // size of the moving reveal/halo tiles
const HALF = TILE / 2;

export function GridBackground() {
  const revealRef = useRef<HTMLDivElement>(null);
  const haloRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(pointer: coarse)').matches) return; // no tracking on touch
    initGSAP();

    const reveal = revealRef.current;
    const halo = haloRef.current;
    const grid = revealRef.current?.firstElementChild as HTMLElement | null;
    if (!reveal || !halo) return;

    let mx = -9999, my = -9999, cx = mx, cy = my;
    let active = false;        // only does work while settling toward the cursor

    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      if (cx < -9000) { cx = mx; cy = my; } // first move: snap (no fly-in)
      active = true;
    };

    const tick = () => {
      if (!active) return;
      cx += (mx - cx) * 0.16;
      cy += (my - cy) * 0.16;
      const x = cx - HALF, y = cy - HALF;
      const t = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      halo.style.transform = t;
      reveal.style.transform = t;
      // keep the revealed grid pattern aligned to the viewport (not the tile)
      if (grid) grid.style.backgroundPosition = `${(-x).toFixed(1)}px ${(-y).toFixed(1)}px`;
      // settle → stop doing per-frame work until the pointer moves again
      if (Math.abs(mx - cx) < 0.4 && Math.abs(my - cy) < 0.4) active = false;
    };

    gsap.ticker.add(tick);
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  const G = '64px 64px';

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden>
      {/* Soft drifting ambient glows — the "light spread" (compositor transforms) */}
      <div className="absolute" style={{
        width: '70vw', height: '70vw', left: '-15vw', top: '-20vh',
        background: 'radial-gradient(circle at 50% 50%, var(--glow) 0%, transparent 70%)',
        animation: 'glowDrift1 26s ease-in-out infinite',
      }} />
      <div className="absolute" style={{
        width: '60vw', height: '60vw', right: '-12vw', bottom: '-18vh',
        background: 'radial-gradient(circle at 50% 50%, var(--glow-2) 0%, transparent 72%)',
        animation: 'glowDrift2 32s ease-in-out infinite',
      }} />

      {/* Faint hairline grid + intersection dots (static) */}
      <div ref={gridRef} className="absolute inset-0" style={{
        backgroundImage: [
          'linear-gradient(var(--grid-line) 1px, transparent 1px)',
          'linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)',
          'radial-gradient(circle, var(--grid-dot) 1px, transparent 1px)',
        ].join(', '),
        backgroundSize: `${G}, ${G}, ${G}`,
        maskImage: 'radial-gradient(ellipse 90% 70% at 50% 35%, black 30%, transparent 92%)',
        WebkitMaskImage: 'radial-gradient(ellipse 90% 70% at 50% 35%, black 30%, transparent 92%)',
      }} />

      {/* Cursor-revealed accent grid — a fixed-size tile MOVED by transform
          (no per-frame mask recompute). Grid stays viewport-aligned via
          background-position; the soft radial mask is baked + static. */}
      <div
        ref={revealRef}
        data-grid-reveal
        className="absolute top-0 left-0"
        style={{
          width: TILE, height: TILE,
          transform: 'translate3d(-9999px, -9999px, 0)',
          willChange: 'transform',
          WebkitMaskImage: 'radial-gradient(circle at center, #000 0%, #000 16%, transparent 60%)',
          maskImage: 'radial-gradient(circle at center, #000 0%, #000 16%, transparent 60%)',
        }}
      >
        <div className="absolute inset-0" style={{
          backgroundImage: [
            'linear-gradient(rgba(var(--ink-mute-rgb) / 0.55) 1px, transparent 1px)',
            'linear-gradient(90deg, rgba(var(--ink-mute-rgb) / 0.55) 1px, transparent 1px)',
            'radial-gradient(circle, rgba(var(--ink-rgb) / 0.85) 1.1px, transparent 1.1px)',
          ].join(', '),
          backgroundSize: `${G}, ${G}, ${G}`,
        }} />
      </div>

      {/* Ambient halo following the cursor (single static radial, moved by transform) */}
      <div
        ref={haloRef}
        className="absolute top-0 left-0"
        style={{
          width: TILE, height: TILE,
          transform: 'translate3d(-9999px, -9999px, 0)',
          willChange: 'transform',
          background: 'radial-gradient(circle at center, var(--glow) 0%, transparent 68%)',
        }}
      />

      {/* Edge vignette → blends into page bg (neutralised in dark mode so the
          global aurora shows through — see .grid-bg-vignette in globals.css) */}
      <div className="grid-bg-vignette absolute inset-0" style={{
        background: 'radial-gradient(ellipse 100% 60% at 50% 0%, transparent 45%, var(--bg) 100%)',
      }} />
    </div>
  );
}
