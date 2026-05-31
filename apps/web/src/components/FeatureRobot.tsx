'use client';

import { useEffect, useRef } from 'react';

/**
 * The Tiny Guardian — my own fully-controlled glossy robot (no external Spline,
 * so nothing is off-limits). One robot that treats feature cards as platforms:
 *   • Boot   — powers up inside the hero "window" (#guardian-pod), full size,
 *              eyes already finding your cursor.
 *   • Exit   — after a beat (or first scroll) it WALKS out of the window (legs
 *              striding) and SHRINKS down onto the page.
 *   • Idle   — head + eyes lock onto the cursor anywhere on screen.
 *   • Hover  — WALKS over to the hovered card, shrinks in, stops beside it and
 *              LOOKS UP at you, head tilted, one arm raised — curious.
 *   • Click  — parabolic LEAP onto the card, perches as it opens (open delayed
 *              ~430ms so the leap reads first).
 * Pure SVG + a light rAF loop; fixed + pointer-events-none; off on touch /
 * reduced-motion.
 */
const RW = 96;
const RH = 120;
const JUMP_MS = 440;

export function FeatureRobot() {
  const root   = useRef<HTMLDivElement>(null);
  const bodyG  = useRef<SVGGElement>(null);
  const head   = useRef<SVGGElement>(null);
  const eyes   = useRef<SVGGElement>(null);
  const pupils = useRef<SVGGElement>(null);
  const legL   = useRef<SVGGElement>(null);
  const legR   = useRef<SVGGElement>(null);
  const armL   = useRef<SVGGElement>(null);
  const armR   = useRef<SVGGElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const el = root.current!;
    const clamp = (v: number, lo: number, hi: number) => (v < lo ? lo : v > hi ? hi : v);
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    // feet anchor → top-left (transform-origin is bottom-centre, so feet stay put)
    const place = (fx: number, fy: number) => ({ x: fx - RW / 2, y: fy - RH });
    const homeFeet = () => ({ x: innerWidth * 0.5, y: innerHeight - 10 });
    const podFeet = () => {
      const p = document.getElementById('guardian-pod');
      if (!p) return null;
      const r = p.getBoundingClientRect();
      if (!r.width) return null;
      return { x: r.left + r.width / 2, y: r.top + r.height * 0.84 };
    };

    let mx = innerWidth * 0.5, my = innerHeight * 0.4;
    let mode: 'intro' | 'exit' | 'idle' | 'travel' | 'jump' | 'perch' = 'idle';
    const pf = podFeet();
    const startTL = pf ? place(pf.x, pf.y) : place(homeFeet().x, homeFeet().y);
    let rx = startTL.x, ry = startTL.y, prevX = rx, prevY = ry;
    if (pf) mode = 'intro';
    let walkPhase = 0, scale = pf ? 1.7 : 1, px = 0, py = 0, headY = 0, hr = 0, lean = 0, aL = 4, aR = 8;
    let card: HTMLElement | null = null;
    let jt0 = 0, jx0 = 0, jy0 = 0, jx1 = 0, jy1 = 0, perchUntil = 0;
    let raf = 0;

    const leave = () => { if (mode === 'intro') mode = 'exit'; };
    const exitT = setTimeout(leave, 2000);

    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
    const onOver = (e: Event) => {
      const c = (e.target as Element).closest?.('.sp-card') as HTMLElement | null;
      if (c && mode !== 'jump' && mode !== 'perch' && mode !== 'intro') { card = c; mode = 'travel'; }
    };
    const onOut = (e: Event) => {
      const to = (e as MouseEvent).relatedTarget as Node | null;
      if (mode === 'travel' && card && (!to || !card.contains(to))) { card = null; mode = 'idle'; }
    };
    const onClick = (e: Event) => {
      const c = (e.target as Element).closest?.('.sp-card') as HTMLElement | null;
      if (!c || mode === 'intro') return;
      card = c;
      const r = c.getBoundingClientRect();
      const tl = place(r.left + r.width / 2, r.top + RH * 0.5);
      jx0 = rx; jy0 = ry; jx1 = tl.x; jy1 = tl.y; jt0 = performance.now(); mode = 'jump';
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('scroll', leave, { passive: true });
    document.addEventListener('mouseover', onOver, true);
    document.addEventListener('mouseout', onOut, true);
    document.addEventListener('click', onClick, true);

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);

      let side = 1, dist = 999;
      if (mode === 'jump') {
        const p = clamp((now - jt0) / JUMP_MS, 0, 1);
        rx = lerp(jx0, jx1, p);
        ry = lerp(jy0, jy1, p) - Math.sin(p * Math.PI) * 135;
        if (p >= 1) { mode = 'perch'; perchUntil = now + 1300; }
      } else {
        let tl = place(homeFeet().x, homeFeet().y + Math.sin(now * 0.002) * 3);
        if (mode === 'intro') { const p = podFeet(); if (p) tl = place(p.x, p.y); else mode = 'idle'; }
        else if (mode === 'travel' && card) { const r = card.getBoundingClientRect(); tl = place(clamp(mx, r.left + 20, r.right - 20), clamp(r.bottom - 6, 60, innerHeight - 6)); }
        else if (mode === 'perch' && card) { const r = card.getBoundingClientRect(); tl = place(r.left + r.width / 2, r.top + 16); if (now > perchUntil) { mode = 'idle'; card = null; } }
        dist = Math.hypot(tl.x - rx, tl.y - ry);
        const ease = mode === 'intro' ? 0.18 : 0.09;
        rx = lerp(rx, tl.x, ease); ry = lerp(ry, tl.y, ease);
        side = tl.x + RW / 2 < innerWidth / 2 ? -1 : 1;
        if (mode === 'exit' && dist < 16) mode = 'idle';
      }

      const moved = Math.hypot(rx - prevX, ry - prevY); prevX = rx; prevY = ry;
      const walking = (mode === 'travel' || mode === 'exit') && moved > 0.4;
      if (walking) walkPhase += 0.34;
      const arrived = (mode === 'travel' && dist < 14) || mode === 'perch';
      const curious = arrived || mode === 'travel' ? 1 : 0;

      // legs stride / settle
      const swing = walking ? Math.sin(walkPhase) * 26 : 0;
      legL.current?.setAttribute('transform', `rotate(${swing.toFixed(1)} 52 112)`);
      legR.current?.setAttribute('transform', `rotate(${(-swing).toFixed(1)} 68 112)`);
      const bob = walking ? -Math.abs(Math.sin(walkPhase)) * 3 : 0;

      // boots big in the window, shrinks as it walks out and roams
      let tScale = 1;
      if (mode === 'intro') tScale = 1.7;
      else if (mode === 'travel') tScale = arrived ? 0.78 : 0.86;
      else if (mode === 'perch') tScale = 0.78;
      scale = lerp(scale, tScale, 0.09);
      el.style.transform = `translate(${rx.toFixed(1)}px, ${(ry + bob).toFixed(1)}px) scale(${scale.toFixed(3)})`;

      // eyes/head lock onto cursor; gaze lifts UP to the user on arrival
      const ecx = rx + RW / 2, ecy = ry + RH * 0.30;
      const ddx = mx - ecx, ddy = my - ecy, dd = Math.hypot(ddx, ddy) || 1;
      px = lerp(px, arrived ? 0 : clamp((ddx / dd) * 3.4, -3.4, 3.4), 0.18);
      py = lerp(py, arrived ? -3.3 : clamp((ddy / dd) * 2.8, -2.6, 3.0), 0.16);
      pupils.current?.setAttribute('transform', `translate(${px.toFixed(2)} ${py.toFixed(2)})`);
      headY = lerp(headY, arrived ? -3.5 : 0, 0.12);
      hr = lerp(hr, arrived ? side * 6 : clamp(ddx * 0.035, -14, 14), 0.12);
      head.current?.setAttribute('transform', `translate(0 ${headY.toFixed(2)}) rotate(${hr.toFixed(2)} 60 50)`);
      lean = lerp(lean, curious ? side * 7 : 0, 0.1);
      bodyG.current?.setAttribute('transform', `rotate(${lean.toFixed(2)} 60 126)`);

      // arms swing opposite legs walking; right arm lifts curiously on arrival
      aR = lerp(aR, walking ? Math.sin(walkPhase + Math.PI) * 20 : (arrived ? -62 : 8), 0.18);
      aL = lerp(aL, walking ? Math.sin(walkPhase) * 20 : (arrived ? 12 : 4), 0.18);
      armR.current?.setAttribute('transform', `rotate(${aR.toFixed(1)} 84 82)`);
      armL.current?.setAttribute('transform', `rotate(${aL.toFixed(1)} 40 82)`);
    };
    raf = requestAnimationFrame(tick);

    let bt: ReturnType<typeof setTimeout>;
    const blink = () => {
      const e = eyes.current;
      if (e) { e.style.transform = 'scaleY(0.12)'; setTimeout(() => { if (e) e.style.transform = 'scaleY(1)'; }, 120); }
      bt = setTimeout(blink, 2600 + Math.random() * 3200);
    };
    bt = setTimeout(blink, 1700);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('scroll', leave);
      document.removeEventListener('mouseover', onOver, true);
      document.removeEventListener('mouseout', onOut, true);
      document.removeEventListener('click', onClick, true);
      clearTimeout(bt); clearTimeout(exitT);
    };
  }, []);

  return (
    <div ref={root} className="feature-robot" aria-hidden>
      <svg viewBox="0 0 120 150" width={RW} height={RH}>
        <defs>
          <radialGradient id="frg-head" cx="0.36" cy="0.26" r="0.95">
            <stop offset="0" stopColor="#3a4150" /><stop offset="0.45" stopColor="#1a1e27" /><stop offset="1" stopColor="#0a0c11" />
          </radialGradient>
          <linearGradient id="frg-body" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#262b36" /><stop offset="0.5" stopColor="#14171f" /><stop offset="1" stopColor="#0b0d12" />
          </linearGradient>
          <linearGradient id="frg-metal" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#2b303b" /><stop offset="1" stopColor="#0e1016" />
          </linearGradient>
          <radialGradient id="frg-eye" cx="0.35" cy="0.3" r="0.85">
            <stop offset="0" stopColor="#ffffff" /><stop offset="0.28" stopColor="#9bf4ff" /><stop offset="0.65" stopColor="#00c2e8" /><stop offset="1" stopColor="#013a73" />
          </radialGradient>
          <filter id="frg-glow" x="-90%" y="-90%" width="280%" height="280%">
            <feGaussianBlur stdDeviation="2.4" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <g ref={bodyG}>
          <ellipse cx="60" cy="142" rx="26" ry="4.5" fill="#000" opacity="0.3" />

          {/* legs */}
          <g ref={legL}><rect x="47" y="112" width="11" height="22" rx="5.5" fill="url(#frg-metal)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" /><rect x="45" y="130" width="15" height="6" rx="3" fill="#0c0e13" /></g>
          <g ref={legR}><rect x="62" y="112" width="11" height="22" rx="5.5" fill="url(#frg-metal)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" /><rect x="60" y="130" width="15" height="6" rx="3" fill="#0c0e13" /></g>

          {/* arms (jointed look: upper + hand) */}
          <g ref={armL}>
            <rect x="13" y="77" width="29" height="10" rx="5" fill="url(#frg-metal)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            <circle cx="40" cy="82" r="5" fill="#171a22" stroke="rgba(0,200,232,0.4)" strokeWidth="1" />
            <circle cx="14" cy="82" r="7" fill="#1a1e27" stroke="rgba(0,200,232,0.55)" strokeWidth="1.2" />
          </g>
          <g ref={armR}>
            <rect x="82" y="77" width="29" height="10" rx="5" fill="url(#frg-metal)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            <circle cx="84" cy="82" r="5" fill="#171a22" stroke="rgba(0,200,232,0.4)" strokeWidth="1" />
            <circle cx="110" cy="82" r="7" fill="#00cfee" filter="url(#frg-glow)" />
          </g>

          {/* torso */}
          <rect x="38" y="70" width="44" height="50" rx="16" fill="url(#frg-body)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          <ellipse cx="52" cy="80" rx="12" ry="7" fill="#ffffff" opacity="0.06" />
          <circle cx="60" cy="94" r="6.5" fill="#021018" stroke="rgba(0,207,238,0.5)" strokeWidth="1" />
          <circle cx="60" cy="94" r="3.4" fill="#00cfee" filter="url(#frg-glow)" />
          <rect x="49" y="108" width="22" height="4" rx="2" fill="rgba(0,207,238,0.22)" />

          {/* head */}
          <g ref={head}>
            <line x1="60" y1="16" x2="60" y2="7" stroke="rgba(0,207,238,0.7)" strokeWidth="2" strokeLinecap="round" />
            <circle cx="60" cy="5" r="4.2" fill="#00cfee" filter="url(#frg-glow)" />
            <ellipse cx="60" cy="46" rx="35" ry="31" fill="url(#frg-head)" stroke="rgba(255,255,255,0.12)" strokeWidth="1.2" />
            <ellipse cx="48" cy="33" rx="15" ry="9" fill="#ffffff" opacity="0.10" />
            <path d="M27 46a33 31 0 0 1 66 0" fill="none" stroke="rgba(0,207,238,0.35)" strokeWidth="1.2" />
            <g ref={eyes} className="fr-eyes">
              <ellipse cx="47" cy="46" rx="12" ry="10" fill="#05080e" />
              <ellipse cx="73" cy="46" rx="12" ry="10" fill="#05080e" />
              <ellipse cx="47" cy="46" rx="10" ry="12" fill="#00b4d8" opacity="0.28" filter="url(#frg-glow)" />
              <ellipse cx="73" cy="46" rx="10" ry="12" fill="#00b4d8" opacity="0.28" filter="url(#frg-glow)" />
              <g ref={pupils}>
                <circle cx="47" cy="46" r="5.4" fill="url(#frg-eye)" />
                <circle cx="73" cy="46" r="5.4" fill="url(#frg-eye)" />
                <circle cx="44.8" cy="43.8" r="1.7" fill="#fff" />
                <circle cx="70.8" cy="43.8" r="1.7" fill="#fff" />
              </g>
            </g>
            <rect x="49" y="63" width="22" height="3.2" rx="1.6" fill="rgba(0,207,238,0.45)" />
          </g>
        </g>
      </svg>
    </div>
  );
}
