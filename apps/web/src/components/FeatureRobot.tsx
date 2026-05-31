'use client';

import { useEffect, useRef } from 'react';
import { SplineScene } from './ui/splite';

/**
 * The Tiny Guardian, powered by the real Spline 3D robot.
 *
 * The Spline scene lives in a FIXED, movable layer (not its hero box), so the
 * one robot:
 *   • Idle/boot — appears inside the hero "window" (#guardian-pod), full size.
 *   • Exit      — after a beat (or first scroll) it glides OUT of the window and
 *                 SHRINKS down onto the page.
 *   • Hover     — travels to the feature card under the cursor.
 *   • Click     — arcs/leaps onto the clicked card, then perches as it opens.
 *
 * A 3D Spline model's skeleton can't be driven from the DOM, so it glides
 * (smooth lerp) rather than leg-walking — but it IS the real robot, roaming the
 * page. Fixed + pointer-events-none so it never blocks the UI; off on
 * touch / reduced-motion.
 */
const W = 340;
const H = 340;

export function FeatureRobot() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const el = root.current!;
    const clamp = (v: number, lo: number, hi: number) => (v < lo ? lo : v > hi ? hi : v);
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const homeC = () => ({ x: innerWidth * 0.5, y: innerHeight - 96 });
    const podCenter = () => {
      const p = document.getElementById('guardian-pod');
      if (!p) return null;
      const r = p.getBoundingClientRect();
      if (!r.width) return null;
      return { x: r.left + r.width / 2, y: r.top + r.height * 0.5 };
    };

    let mode: 'intro' | 'exit' | 'idle' | 'travel' | 'jump' | 'perch' = 'idle';
    const pc = podCenter();
    let cx = pc ? pc.x : homeC().x;
    let cy = pc ? pc.y : homeC().y;
    let s = pc ? 1 : 0.42;
    if (pc) mode = 'intro';
    let card: HTMLElement | null = null;
    let jt0 = 0, jcx0 = 0, jcy0 = 0, jcx1 = 0, jcy1 = 0, perchUntil = 0;
    let raf = 0;

    const leave = () => { if (mode === 'intro') mode = 'exit'; };
    const exitT = setTimeout(leave, 2000);

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
      jcx0 = cx; jcy0 = cy; jcx1 = r.left + r.width / 2; jcy1 = r.top + r.height * 0.4;
      jt0 = performance.now(); mode = 'jump';
    };

    window.addEventListener('scroll', leave, { passive: true });
    document.addEventListener('mouseover', onOver, true);
    document.addEventListener('mouseout', onOut, true);
    document.addEventListener('click', onClick, true);

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      let ts = 0.42;

      if (mode === 'jump') {
        const p = clamp((now - jt0) / 520, 0, 1);
        cx = lerp(jcx0, jcx1, p);
        cy = lerp(jcy0, jcy1, p) - Math.sin(p * Math.PI) * 95;
        ts = 0.4 + Math.sin(p * Math.PI) * 0.14;
        if (p >= 1) { mode = 'perch'; perchUntil = now + 1200; }
      } else {
        let tx = homeC().x, ty = homeC().y + Math.sin(now * 0.002) * 5;
        if (mode === 'intro') { const p = podCenter(); if (p) { tx = p.x; ty = p.y; ts = 1; } else mode = 'idle'; }
        else if (mode === 'travel' && card) { const r = card.getBoundingClientRect(); tx = r.left + r.width / 2; ty = r.top + r.height / 2; ts = 0.34; }
        else if (mode === 'perch' && card) { const r = card.getBoundingClientRect(); tx = r.left + r.width / 2; ty = r.top + r.height * 0.4; ts = 0.34; if (now > perchUntil) { mode = 'idle'; card = null; } }
        const e = mode === 'intro' ? 0.2 : 0.09;
        cx = lerp(cx, tx, e); cy = lerp(cy, ty, e);
        if (mode === 'exit' && Math.hypot(tx - cx, ty - cy) < 16) mode = 'idle';
      }

      s = lerp(s, ts, 0.09);
      el.style.transform = `translate(${(cx - W / 2).toFixed(1)}px, ${(cy - H / 2).toFixed(1)}px) scale(${s.toFixed(3)})`;
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', leave);
      document.removeEventListener('mouseover', onOver, true);
      document.removeEventListener('mouseout', onOut, true);
      document.removeEventListener('click', onClick, true);
      clearTimeout(exitT);
    };
  }, []);

  return (
    <div ref={root} className="feature-robot" aria-hidden>
      <SplineScene
        scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
        className="w-full h-full"
      />
    </div>
  );
}
