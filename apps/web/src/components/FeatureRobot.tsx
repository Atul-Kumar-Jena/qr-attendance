'use client';

import { useEffect, useRef } from 'react';

/**
 * The Tiny Guardian — one small robot grounded on the front layer that treats
 * feature cards as physical platforms:
 *   • Idle   — stands at home (bottom-centre), gentle breathing.
 *   • Hover  — WALKS (legs stride, body bobs, shrinks as it heads "down" into
 *              the scene) over to the hovered card, then stops and LOOKS UP at
 *              you, curious, head tilted.
 *   • Click  — leaps in a parabolic arc onto the card and perches as it opens.
 * Pure SVG + a light rAF loop; fixed + pointer-events-none; one robot only.
 */
const RW = 86;
const RH = 112;
const JUMP_MS = 430;

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

    let mx = innerWidth * 0.5;
    const homeX = () => innerWidth * 0.5 - RW / 2;
    const homeY = () => innerHeight - RH - 14;
    let rx = homeX(), ry = homeY(), prevX = rx, prevY = ry;
    let walkPhase = 0, scale = 1, py = 0, headY = 0, hr = 0, lean = 0, aL = 4, aR = 8;
    let mode: 'idle' | 'travel' | 'jump' | 'perch' = 'idle';
    let card: HTMLElement | null = null;
    let jt0 = 0, jx0 = 0, jy0 = 0, jx1 = 0, jy1 = 0, perchUntil = 0;
    let raf = 0;

    const beside = (r: DOMRect) => ({
      x: clamp(r.left + r.width / 2 - RW / 2 + (mx > r.left + r.width / 2 ? -r.width * 0.34 : r.width * 0.34), 6, innerWidth - RW - 6),
      y: clamp(r.bottom - RH + 14, 6, innerHeight - RH - 4),
    });
    const onTop = (r: DOMRect) => ({
      x: clamp(r.left + r.width / 2 - RW / 2, 6, innerWidth - RW - 6),
      y: clamp(r.top - RH * 0.52, 6, innerHeight - RH - 4),
    });

    const onMove = (e: MouseEvent) => { mx = e.clientX; };
    const onOver = (e: Event) => {
      const c = (e.target as Element).closest?.('.sp-card') as HTMLElement | null;
      if (c && mode !== 'jump' && mode !== 'perch') { card = c; mode = 'travel'; }
    };
    const onOut = (e: Event) => {
      const to = (e as MouseEvent).relatedTarget as Node | null;
      if (mode === 'travel' && card && (!to || !card.contains(to))) { card = null; mode = 'idle'; }
    };
    const onClick = (e: Event) => {
      const c = (e.target as Element).closest?.('.sp-card') as HTMLElement | null;
      if (!c) return;
      card = c;
      const p = onTop(c.getBoundingClientRect());
      jx0 = rx; jy0 = ry; jx1 = p.x; jy1 = p.y; jt0 = performance.now(); mode = 'jump';
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver, true);
    document.addEventListener('mouseout', onOut, true);
    document.addEventListener('click', onClick, true);

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);

      let curious = 0, side = 0, dist = 999;
      if (mode === 'jump') {
        const p = clamp((now - jt0) / JUMP_MS, 0, 1);
        rx = lerp(jx0, jx1, p);
        ry = lerp(jy0, jy1, p) - Math.sin(p * Math.PI) * 130;
        if (p >= 1) { mode = 'perch'; perchUntil = now + 1300; }
      } else {
        let tx = homeX(), ty = homeY() + Math.sin(now * 0.002) * 3;
        if (mode === 'travel' && card) { const b = beside(card.getBoundingClientRect()); tx = b.x; ty = b.y; }
        else if (mode === 'perch' && card) { const o = onTop(card.getBoundingClientRect()); tx = o.x; ty = o.y; if (now > perchUntil) { mode = 'idle'; card = null; } }
        dist = Math.hypot(tx - rx, ty - ry);
        rx = lerp(rx, tx, 0.1);
        ry = lerp(ry, ty, 0.1);
        side = tx + RW / 2 < innerWidth / 2 ? -1 : 1;
      }

      const moved = Math.hypot(rx - prevX, ry - prevY); prevX = rx; prevY = ry;
      const walking = mode === 'travel' && moved > 0.35;
      if (walking) walkPhase += 0.34;
      const arrived = (mode === 'travel' && dist < 12) || mode === 'perch';
      if (arrived || mode === 'travel') curious = 1;

      // legs stride while walking, settle otherwise
      const swing = walking ? Math.sin(walkPhase) * 26 : 0;
      legL.current?.setAttribute('transform', `rotate(${swing.toFixed(1)} 53 116)`);
      legR.current?.setAttribute('transform', `rotate(${(-swing).toFixed(1)} 67 116)`);
      const bob = walking ? -Math.abs(Math.sin(walkPhase)) * 3 : 0;

      // shrink as it heads to an element ("becomes small, walks down")
      scale = lerp(scale, mode === 'idle' ? 1 : (arrived ? 0.8 : 0.88), 0.1);
      el.style.transform = `translate(${rx.toFixed(1)}px, ${(ry + bob).toFixed(1)}px) scale(${scale.toFixed(3)})`;

      // LOOK UP at the user when arrived/perched (not cursor-staring)
      const upTarget = arrived ? -3.4 : (walking ? 1.6 : -0.6);
      py = lerp(py, upTarget, 0.14);
      pupils.current?.setAttribute('transform', `translate(0 ${py.toFixed(2)})`);
      headY = lerp(headY, arrived ? -3.5 : 0, 0.12);
      hr = lerp(hr, arrived ? side * 7 : 0, 0.1);
      head.current?.setAttribute('transform', `translate(0 ${headY.toFixed(2)}) rotate(${hr.toFixed(2)} 60 50)`);
      lean = lerp(lean, curious ? side * 7 : 0, 0.1);
      bodyG.current?.setAttribute('transform', `rotate(${lean.toFixed(2)} 60 126)`);

      // arms: swing opposite legs while walking, right arm lifts curiously on arrival
      aR = lerp(aR, walking ? Math.sin(walkPhase + Math.PI) * 20 : (arrived ? -62 : 8), 0.18);
      aL = lerp(aL, walking ? Math.sin(walkPhase) * 20 : (arrived ? 10 : 4), 0.18);
      armR.current?.setAttribute('transform', `rotate(${aR.toFixed(1)} 84 84)`);
      armL.current?.setAttribute('transform', `rotate(${aL.toFixed(1)} 40 84)`);
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
      document.removeEventListener('mouseover', onOver, true);
      document.removeEventListener('mouseout', onOut, true);
      document.removeEventListener('click', onClick, true);
      clearTimeout(bt);
    };
  }, []);

  return (
    <div ref={root} className="feature-robot" aria-hidden>
      <svg viewBox="0 0 120 150" width={RW} height={RH}>
        <defs>
          <radialGradient id="fr-head-g" cx="0.4" cy="0.3" r="0.9">
            <stop offset="0" stopColor="#1f232d" /><stop offset="0.6" stopColor="#111319" /><stop offset="1" stopColor="#0c0d12" />
          </radialGradient>
          <radialGradient id="fr-eye-g" cx="0.35" cy="0.3" r="0.85">
            <stop offset="0" stopColor="#ffffff" /><stop offset="0.3" stopColor="#80efff" /><stop offset="0.7" stopColor="#00b4d8" /><stop offset="1" stopColor="#023e8a" />
          </radialGradient>
          <filter id="fr-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="2.2" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <g ref={bodyG}>
          <ellipse cx="60" cy="140" rx="24" ry="4" fill="#000" opacity="0.26" />
          {/* legs */}
          <g ref={legL}><rect x="48" y="116" width="10" height="18" rx="5" fill="#0f1117" stroke="rgba(255,255,255,0.1)" strokeWidth="1" /></g>
          <g ref={legR}><rect x="62" y="116" width="10" height="18" rx="5" fill="#0f1117" stroke="rgba(255,255,255,0.1)" strokeWidth="1" /></g>
          {/* arms */}
          <g ref={armL}><rect x="14" y="80" width="28" height="9" rx="4.5" fill="#14161d" stroke="rgba(255,255,255,0.14)" strokeWidth="1" /><circle cx="15" cy="84.5" r="6" fill="#1a1d25" stroke="rgba(0,212,255,0.5)" strokeWidth="1" /></g>
          <g ref={armR}><rect x="82" y="79" width="30" height="9" rx="4.5" fill="#14161d" stroke="rgba(255,255,255,0.14)" strokeWidth="1" /><circle cx="110" cy="84" r="5.5" fill="#00d4ff" filter="url(#fr-glow)" /></g>
          {/* torso */}
          <rect x="40" y="74" width="40" height="46" rx="14" fill="#0f1117" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
          <circle cx="60" cy="96" r="4.5" fill="#00d4ff" opacity="0.7" filter="url(#fr-glow)" />
          <rect x="50" y="108" width="20" height="4" rx="2" fill="rgba(0,212,255,0.25)" />
          {/* head */}
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
        </g>
      </svg>
    </div>
  );
}
