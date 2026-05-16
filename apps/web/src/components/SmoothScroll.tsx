'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Lenis smooth scroll, registered as GSAP ScrollTrigger proxy for compatibility
 * with all pinned/scrubbed sections. Respects prefers-reduced-motion.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let lenis: import('lenis').default | null = null;

    import('lenis').then(({ default: Lenis }) => {
      lenis = new Lenis({
        duration: 1.15,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        touchMultiplier: 2,
      });

      lenis.on('scroll', ScrollTrigger.update);

      const ticker = gsap.ticker.add((time: number) => {
        lenis?.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);

      // Expose to GSAP ScrollTrigger as the scroll proxy
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

      // Propagate velocity to CSS var so Marquee skew still works
      lenis.on('scroll', ({ velocity }: { velocity: number }) => {
        document.documentElement.style.setProperty('--scroll-velocity', String(velocity * 0.04));
      });

      return () => {
        gsap.ticker.remove(ticker);
        ScrollTrigger.scrollerProxy(document.documentElement, {} as any);
        lenis?.destroy();
      };
    }).catch(() => {
      // Lenis unavailable — fall back to native scroll, keep ScrollTrigger working
    });

    return () => {
      lenis?.destroy();
    };
  }, []);

  return null;
}
