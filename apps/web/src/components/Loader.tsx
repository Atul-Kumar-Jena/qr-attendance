'use client';

import { useEffect, useRef, useState } from 'react';

const SEEN_KEY = 'attendly-loaded';

/**
 * Brand intro — shown ONCE per session, then never again (so it never gates
 * LCP on repeat navigations). Lifts quickly. Reduced-motion + repeat visits
 * skip it entirely. The CSS `.preloader` keyframe is the no-JS safety net.
 */
export function Loader() {
  const ref = useRef<HTMLDivElement>(null);
  // IMPORTANT: start `false` on BOTH server and first client render so hydration
  // always matches (deciding from sessionStorage in the initializer caused a
  // hydration mismatch on repeat visits). On repeat visits the boot script has
  // already added `html.loaded`, whose CSS hides `.preloader` instantly — so
  // there's no flash before this effect unmounts it.
  const [gone, setGone] = useState(false);

  useEffect(() => {
    let seen = false, reduced = false;
    try { seen = !!sessionStorage.getItem(SEEN_KEY); } catch {}
    try { reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch {}
    if (seen || reduced) { setGone(true); return; }

    try { sessionStorage.setItem(SEEN_KEY, '1'); } catch {}
    document.documentElement.classList.add('loaded');

    const el = ref.current;
    const lift = setTimeout(() => {
      if (el) {
        el.style.transition = 'opacity .45s ease, transform .55s cubic-bezier(.7,0,.2,1)';
        el.style.opacity = '0';
        el.style.transform = 'translateY(-100%)';
      }
      setTimeout(() => setGone(true), 520);
    }, 700);

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
          <div className="h-full bg-[#F4F2EE]" style={{ animation: 'loadFill 0.7s cubic-bezier(.6,0,.2,1) forwards' }} />
        </div>
      </div>
    </div>
  );
}
