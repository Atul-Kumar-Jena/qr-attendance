'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initGSAP } from '@/lib/gsap-init';

/**
 * Global cinematic reveal. Any element marked `data-reveal` fades + rises as it
 * scrolls into frame, in staggered batches (like shots cutting in). Elements
 * are visible by default (no CSS opacity:0) so a JS failure never hides
 * content — JS sets the from-state, then animates to visible.
 */
export function ScrollReveal() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    initGSAP();

    const els = gsap.utils.toArray<HTMLElement>('[data-reveal]');
    if (els.length === 0) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(els, { opacity: 1, y: 0 });
      return;
    }

    const desktop = !window.matchMedia('(max-width: 900px)').matches;

    const ctx = gsap.context(() => {
      // Fade + rise only. (A per-element blur filter here was left behind as
      // `filter: blur(0px)` on every revealed element, each one an extra
      // compositor layer for the rest of the session.)
      gsap.set(els, { opacity: 0, y: 36 });
      ScrollTrigger.batch('[data-reveal]', {
        start: 'top 86%',
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1, y: 0, duration: 1.0, ease: 'expo.out',
            stagger: 0.1, overwrite: true, clearProps: 'transform',
          }),
      });

      // Multi-speed parallax for [data-speed] (desktop only — cheap transforms).
      if (desktop) {
        gsap.utils.toArray<HTMLElement>('[data-speed]').forEach((el) => {
          const speed = parseFloat(el.dataset.speed || '0');
          if (!speed) return;
          gsap.to(el, {
            yPercent: speed * -12,
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
          });
        });
      }

      ScrollTrigger.refresh();
    });

    return () => ctx.revert();
  }, []);

  return null;
}
