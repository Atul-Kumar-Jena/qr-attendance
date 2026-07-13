'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initGSAP } from '@/lib/gsap-init';

/**
 * Top scroll-progress bar. Driven by a single ScrollTrigger (no extra scroll
 * listener, no scrollHeight reflow, no per-event tween) writing a GPU-only
 * scaleX via quickSetter — stays perfectly in sync at any scroll speed.
 */
export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (typeof window === 'undefined' || !bar.current) return;
    initGSAP();
    const el = bar.current;
    gsap.set(el, { scaleX: 0, transformOrigin: 'left center' });
    const setX = gsap.quickSetter(el, 'scaleX');
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => setX(self.progress),
    });
    return () => st.kill();
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-px bg-transparent pointer-events-none">
      <div ref={bar} className="origin-left h-full w-full bg-accent" style={{ transform: 'scaleX(0)' }} />
    </div>
  );
}
