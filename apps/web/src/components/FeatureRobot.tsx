'use client';

import { useEffect, useRef } from 'react';

/**
 * A friendly mascot that watches your cursor anywhere on the page and gestures
 * with its arms — the left arm waves continuously, the right arm points toward
 * wherever the cursor is, the eyes follow you and the head tilts. Pure SVG + a
 * light rAF loop (no deps); fixed + pointer-events-none so it never blocks the
 * UI. Hidden on touch / reduced-motion.
 */
export function FeatureRobot() {
  const root   = useRef<HTMLDivElement>(null);
  const head   = useRef<SVGGElement>(null);
  const eyes   = useRef<SVGGElement>(null);
  const pupils = useRef<SVGGElement>(null);
  const rArm   = useRef<SVGGElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let mx = window.innerWidth * 0.5;
    let my = window.innerHeight * 0.4;
    let px = 0, py = 0, hr = 0, ar = 55; // smoothed pupil / head / right-arm
    let raf = 0;

    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
    window.addEventListener('mousemove', onMove, { passive: true });

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const clamp = (v: number, lo: number, hi: number) => (v < lo ? lo : v > hi ? hi : v);

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const el = root.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width * 0.5;
      const cy = r.top + r.height * 0.40;
      const dx = mx - cx, dy = my - cy;
      const dist = Math.hypot(dx, dy) || 1;

      // eyes follow the cursor (whole page)
      px = lerp(px, clamp((dx / dist) * 3.2, -3.2, 3.2), 0.15);
      py = lerp(py, clamp((dy / dist) * 2.6, -2.4, 2.8), 0.15);
      pupils.current?.setAttribute('transform', `translate(${px.toFixed(2)} ${py.toFixed(2)})`);

      // head tilts toward the cursor
      hr = lerp(hr, clamp((dx / window.innerWidth) * 36, -11, 11), 0.08);
      head.current?.setAttribute('transform', `rotate(${hr.toFixed(2)} 60 50)`);

      // right arm points at the cursor (shoulder ≈ 84,84 in the viewBox)
      const sx = r.left + r.width * (84 / 120);
      const sy = r.top + r.height * (84 / 150);
      const target = clamp(Math.atan2(my - sy, mx - sx) * 180 / Math.PI, -35, 125);
      ar = lerp(ar, target, 0.13);
      rArm.current?.setAttribute('transform', `rotate(${ar.toFixed(2)} 84 84)`);
    };
    raf = requestAnimationFrame(tick);

    // occasional blink
    let blinkT: ReturnType<typeof setTimeout>;
    const blink = () => {
      const e = eyes.current;
      if (e) {
        e.style.transform = 'scaleY(0.12)';
        setTimeout(() => { if (e) e.style.transform = 'scaleY(1)'; }, 120);
      }
      blinkT = setTimeout(blink, 2400 + Math.random() * 3400);
    };
    blinkT = setTimeout(blink, 1800);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      clearTimeout(blinkT);
    };
  }, []);

  return (
    <div ref={root} className="feature-robot" aria-hidden>
      <svg viewBox="0 0 120 150" width="120" height="150">
        <defs>
          <radialGradient id="fr-head-g" cx="0.4" cy="0.3" r="0.9">
            <stop offset="0" stopColor="#1f232d" />
            <stop offset="0.6" stopColor="#111319" />
            <stop offset="1" stopColor="#0c0d12" />
          </radialGradient>
          <radialGradient id="fr-eye-g" cx="0.35" cy="0.3" r="0.85">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="0.3" stopColor="#80efff" />
            <stop offset="0.7" stopColor="#00b4d8" />
            <stop offset="1" stopColor="#023e8a" />
          </radialGradient>
          <filter id="fr-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="2.4" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* LEFT arm — continuous friendly wave */}
        <g className="fr-arm-left">
          <rect x="12" y="80" width="30" height="10" rx="5" fill="#14161d" stroke="rgba(255,255,255,0.14)" strokeWidth="1" />
          <circle cx="13" cy="85" r="6.5" fill="#1a1d25" stroke="rgba(0,212,255,0.5)" strokeWidth="1" />
        </g>

        {/* RIGHT arm — points toward the cursor */}
        <g ref={rArm}>
          <rect x="82" y="79" width="32" height="10" rx="5" fill="#14161d" stroke="rgba(255,255,255,0.14)" strokeWidth="1" />
          <circle cx="112" cy="84" r="6" fill="#00d4ff" filter="url(#fr-glow)" />
        </g>

        {/* BODY */}
        <rect x="40" y="74" width="40" height="46" rx="14" fill="#0f1117" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
        <circle cx="60" cy="96" r="4.5" fill="#00d4ff" opacity="0.7" filter="url(#fr-glow)" />
        <rect x="50" y="108" width="20" height="4" rx="2" fill="rgba(0,212,255,0.25)" />

        {/* HEAD */}
        <g ref={head}>
          <line x1="60" y1="18" x2="60" y2="8" stroke="rgba(0,212,255,0.6)" strokeWidth="2" strokeLinecap="round" />
          <circle cx="60" cy="6" r="4" fill="#00d4ff" filter="url(#fr-glow)" />
          <ellipse cx="60" cy="46" rx="34" ry="30" fill="url(#fr-head-g)" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
          <g ref={eyes} className="fr-eyes">
            <ellipse cx="47" cy="46" rx="11" ry="9" fill="#070a10" />
            <ellipse cx="73" cy="46" rx="11" ry="9" fill="#070a10" />
            <ellipse cx="47" cy="46" rx="9" ry="11" fill="#00b4d8" opacity="0.3" filter="url(#fr-glow)" />
            <ellipse cx="73" cy="46" rx="9" ry="11" fill="#00b4d8" opacity="0.3" filter="url(#fr-glow)" />
            <g ref={pupils}>
              <circle cx="47" cy="46" r="5" fill="url(#fr-eye-g)" />
              <circle cx="73" cy="46" r="5" fill="url(#fr-eye-g)" />
              <circle cx="45" cy="44" r="1.6" fill="#fff" opacity="0.85" />
              <circle cx="71" cy="44" r="1.6" fill="#fff" opacity="0.85" />
            </g>
          </g>
          <rect x="50" y="64" width="20" height="3" rx="1.5" fill="rgba(0,212,255,0.4)" />
        </g>
      </svg>
    </div>
  );
}
