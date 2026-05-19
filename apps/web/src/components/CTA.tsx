'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { initGSAP } from '@/lib/gsap-init';
import { Magnetic } from './Magnetic';

if (typeof window !== 'undefined') initGSAP();

export function CTA() {
  const root = useRef<HTMLDivElement>(null);
  const path = useRef<SVGPathElement>(null);

  useEffect(() => {
    let ctx: ReturnType<typeof gsap.context> | undefined;
    try {
      ctx = gsap.context(() => {
        // Only the SVG line draws in — "attend." text stays constant
        const p = path.current;
        if (!p) return;
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(p, {
          strokeDashoffset: 0, ease: 'none',
          immediateRender: false,
          scrollTrigger: { trigger: root.current, start: 'top 75%', end: 'bottom 55%', scrub: 1 },
        });
      }, root);
    } catch { /* GSAP failure must not crash the page */ }
    return () => { try { ctx?.revert(); } catch {} };
  }, []);

  return (
    <section id="demo" ref={root} className="relative py-40 overflow-hidden">
      <svg aria-hidden viewBox="0 0 1200 400" className="absolute inset-0 w-full h-full text-accent opacity-50">
        <path
          ref={path}
          d="M -50 350 C 200 100, 500 380, 700 200 S 1100 50, 1250 220"
          stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"
        />
      </svg>
      <div className="relative text-center">
        <div className="font-display text-[16vw] leading-none tracking-tightest text-ink">
          attend.
        </div>
        <p className="mt-6 max-w-md mx-auto text-[14px] text-ink-mute">
          Demo on your real classroom in under 20 minutes. We bring the QR,
          you bring the students.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Magnetic strength={0.25}>
            <a href="mailto:hello@attendly.app"
               className="rounded-full bg-ink dark:bg-[#1A2236] dark:border dark:border-white/10 text-cream-50 px-7 py-3.5 text-[13.5px] font-medium">
              Request demo
            </a>
          </Magnetic>
          <Magnetic strength={0.2}>
            <a href="#features"
               className="rounded-full border border-ink/15 px-7 py-3.5 text-[13.5px]">
              See features
            </a>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
