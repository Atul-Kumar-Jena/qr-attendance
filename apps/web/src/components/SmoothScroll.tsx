'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Lenis smooth scroll, registered as a GSAP ScrollTrigger proxy so pinned /
 * scrubbed sections stay in sync.
 *
 * Anti-hang notes:
 *  - Desktop uses a short `lerp` (not a long `duration`) so the view tracks the
 *    wheel tightly and never feels like it "hangs" behind a fast flick.
 *  - Touch is left on native momentum (`syncTouch: false`) — smoothing touch is
 *    the usual cause of janky/stuck mobile scrolling.
 *  - `prefers-reduced-motion` disables Lenis entirely.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let lenis: import('lenis').default | null = null;
    let ticker: ((t: number) => void) | null = null;

    import('lenis').then(({ default: Lenis }) => {
      lenis = new Lenis({
        lerp: 0.1,
        wheelMultiplier: 1,
        smoothWheel: true,
        syncTouch: false,       // native momentum on touch → no mobile hang
        touchMultiplier: 1.5,
      });

      window.scrollTo(0, 0);
      lenis.on('scroll', ScrollTrigger.update);

      ticker = (time: number) => { lenis?.raf(time * 1000); };
      gsap.ticker.add(ticker);
      gsap.ticker.lagSmoothing(0);

      ScrollTrigger.scrollerProxy(document.documentElement, {
        scrollTop(value?: number) {
          if (arguments.length && value != null) {
            lenis?.scrollTo(value, { immediate: true });
          }
          return lenis?.scroll ?? window.scrollY;
        },
        getBoundingClientRect() {
          return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
        },
      });

      // Expose velocity to CSS so velocity-reactive bits (marquee etc.) can read it.
      lenis.on('scroll', ({ velocity }: { velocity: number }) => {
        document.documentElement.style.setProperty('--scroll-velocity', String(velocity * 0.04));
      });

      ScrollTrigger.refresh();
    }).catch(() => {
      // Lenis unavailable — native scroll still works; ScrollTrigger is fine.
    });

    return () => {
      if (ticker) gsap.ticker.remove(ticker);
      try { ScrollTrigger.scrollerProxy(document.documentElement, {} as never); } catch {}
      lenis?.destroy();
    };
  }, []);

  return null;
}
