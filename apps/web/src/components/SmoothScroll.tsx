'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initGSAP } from '@/lib/gsap-init';

/**
 * Lenis smooth scroll — the canonical GSAP integration (no scrollerProxy).
 *
 * Lenis v1 scrolls the real window, so ScrollTrigger stays on the native
 * scroller and we just (a) drive lenis.raf from GSAP's single ticker and
 * (b) call ScrollTrigger.update on every Lenis scroll. This keeps every
 * scrubbed/pinned animation perfectly synced to scroll with ZERO extra rAF.
 *
 * Smoothing is desktop-only: touch devices keep native momentum scroll, which
 * is faster, battery-friendly, and never desyncs from JS-driven scrolling.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(pointer: coarse)').matches) return; // native scroll on touch

    initGSAP();

    let lenis: import('lenis').default | null = null;
    let tickerFn: ((time: number) => void) | null = null;
    let cancelled = false;

    import('lenis').then(({ default: Lenis }) => {
      if (cancelled) return;
      lenis = new Lenis({
        duration: 1.0,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        wheelMultiplier: 1,
      });

      lenis.on('scroll', ScrollTrigger.update);

      tickerFn = (time: number) => { lenis?.raf(time * 1000); };
      gsap.ticker.add(tickerFn);
      gsap.ticker.lagSmoothing(0);
    }).catch(() => { /* native scroll fallback */ });

    return () => {
      cancelled = true;
      if (tickerFn) { try { gsap.ticker.remove(tickerFn); } catch {} }
      try { lenis?.destroy(); } catch {}
    };
  }, []);

  return null;
}
