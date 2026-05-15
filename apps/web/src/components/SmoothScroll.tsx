'use client';

import { useEffect } from 'react';

/**
 * Lightweight inertia-based smooth scroll. We avoid ScrollSmoother (paid)
 * and Lenis to keep deps minimal; this gives a sub-frame-eased follow that
 * pairs beautifully with ScrollTrigger.
 */
export function SmoothScroll() {
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    let target = window.scrollY;
    let current = window.scrollY;
    let rafId = 0;
    let active = true;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const onScroll = () => {
      target = window.scrollY;
    };

    const tick = () => {
      current = lerp(current, target, 0.12);
      if (Math.abs(target - current) < 0.4) current = target;
      document.documentElement.style.setProperty(
        '--scroll-velocity',
        String((target - current) * 0.08),
      );
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    rafId = requestAnimationFrame(tick);
    return () => {
      active = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      void active;
    };
  }, []);
  return null;
}
