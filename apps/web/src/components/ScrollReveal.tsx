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

    const ctx = gsap.context(() => {
      gsap.set(els, { opacity: 0, y: 28 });
      ScrollTrigger.batch('[data-reveal]', {
        start: 'top 88%',
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
            stagger: 0.08, overwrite: true,
          }),
      });
      ScrollTrigger.refresh();
    });

    return () => ctx.revert();
  }, []);

  return null;
}
