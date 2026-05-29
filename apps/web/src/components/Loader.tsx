'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Smooth one-time preloader. Renders during the initial paint (SSR markup so it
 * covers hydration), then lifts away. CSS animation is the no-JS safety net.
 */
export function Loader() {
  const ref = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { setGone(true); return; }

    const el = ref.current;
    const lift = setTimeout(() => {
      if (el) {
        el.style.transition = 'opacity .5s ease, transform .6s cubic-bezier(.7,0,.2,1)';
        el.style.opacity = '0';
        el.style.transform = 'translateY(-100%)';
      }
      setTimeout(() => setGone(true), 560);
    }, 1050);

    return () => clearTimeout(lift);
  }, []);

  if (gone) return null;

  return (
    <div ref={ref} className="preloader" aria-hidden>
      <div className="flex flex-col items-center gap-6">
        <svg width="42" height="42" viewBox="0 0 22 22" aria-hidden className="text-white" style={{ animation: 'iconPulse 1.4s ease-in-out infinite' }}>
          <rect x="0" y="0" width="9" height="9" rx="2" fill="currentColor" />
          <rect x="13" y="0" width="9" height="9" rx="2" fill="currentColor" />
          <rect x="0" y="13" width="9" height="9" rx="2" fill="currentColor" />
          <rect x="15" y="15" width="7" height="7" rx="2" fill="#F4F2EE" fillOpacity="0.55" />
        </svg>
        <div className="font-display text-[1.5rem] tracking-tight text-white">Attendly</div>
        <div className="w-40 h-px bg-white/15 overflow-hidden rounded-full">
          <div className="h-full bg-[#F4F2EE]" style={{ animation: 'loadFill 1.05s cubic-bezier(.6,0,.2,1) forwards' }} />
        </div>
      </div>
    </div>
  );
}
