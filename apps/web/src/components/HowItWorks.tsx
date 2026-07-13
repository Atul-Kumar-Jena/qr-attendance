'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initGSAP } from '@/lib/gsap-init';
import { SplitText } from './SplitText';

const STEPS = [
  {
    n: '01',
    t: 'Start the class',
    d: 'Pick your class and begin. A one-of-a-kind code appears on screen and quietly refreshes every few seconds.',
    Icon: () => (
      <svg viewBox="0 0 48 48" fill="none" aria-hidden className="w-full h-full">
        <rect x="9" y="7" width="30" height="34" rx="4" stroke="var(--accent)" strokeWidth="1.6" />
        <rect x="16" y="15" width="16" height="16" rx="2" fill="var(--accent)" fillOpacity="0.12" stroke="var(--accent)" strokeWidth="1.2" />
        {[19, 24, 29].map((x) => [19, 24, 29].map((y) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="2.4" height="2.4" rx="0.5" fill="var(--accent)" fillOpacity={(x + y) % 3 ? 0.85 : 0.3} />
        )))}
        <line x1="16" y1="36" x2="32" y2="36" stroke="var(--accent)" strokeWidth="1.4" strokeLinecap="round" strokeOpacity="0.5" />
      </svg>
    ),
  },
  {
    n: '02',
    t: 'Students scan',
    d: 'One tap in the app. In a blink, we confirm it’s really them, on their own phone, actually in the room.',
    Icon: () => (
      <svg viewBox="0 0 48 48" fill="none" aria-hidden className="w-full h-full">
        <path d="M10 16v-4a2 2 0 0 1 2-2h4M38 16v-4a2 2 0 0 0-2-2h-4M10 32v4a2 2 0 0 0 2 2h4M38 32v4a2 2 0 0 1-2 2h-4" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" />
        <line x1="14" y1="24" x2="34" y2="24" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round">
          <animate attributeName="y1" values="18;30;18" dur="2.4s" repeatCount="indefinite" />
          <animate attributeName="y2" values="18;30;18" dur="2.4s" repeatCount="indefinite" />
        </line>
      </svg>
    ),
  },
  {
    n: '03',
    t: 'Attendance, locked',
    d: 'The record is saved the instant they scan — accurate, permanent, and impossible to fake or quietly change later.',
    Icon: () => (
      <svg viewBox="0 0 48 48" fill="none" aria-hidden className="w-full h-full">
        <rect x="13" y="22" width="22" height="17" rx="3" stroke="var(--accent)" strokeWidth="1.6" fill="var(--accent)" fillOpacity="0.08" />
        <path d="M18 22v-4a6 6 0 0 1 12 0v4" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M20 30.5l3 3 5.5-6" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export function HowItWorks() {
  const root = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGLineElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !root.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    initGSAP();
    const desktop = window.matchMedia('(min-width: 768px)').matches;
    let ctx: ReturnType<typeof gsap.context> | undefined;
    try {
      ctx = gsap.context(() => {
        gsap.from('.hiw-step', {
          y: 40, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.14,
          immediateRender: false,
          scrollTrigger: { trigger: root.current, start: 'top 78%' },
        });
        // Connector line draws across the steps as you scroll (real DrawSVG).
        if (desktop && lineRef.current) {
          gsap.fromTo(lineRef.current,
            { drawSVG: '0%' },
            {
              drawSVG: '100%', ease: 'none',
              scrollTrigger: { trigger: root.current, start: 'top 70%', end: 'center 60%', scrub: 1, invalidateOnRefresh: true },
            },
          );
        }
      }, root);
    } catch { /* never crash */ }
    return () => { try { ctx?.revert(); } catch {} };
  }, []);

  return (
    <section id="how" ref={root} className="py-24 lg:py-36">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span data-reveal className="text-[10px] tracking-[0.28em] text-ink-mute uppercase">[ how it works ]</span>
          <SplitText as="h2" className="mt-4 font-display text-[2.4rem] lg:text-[3.6rem] leading-[1.04] tracking-tightish block text-ink">
            Live in three steps.
          </SplitText>
          <p data-reveal className="mt-5 text-[14px] leading-relaxed text-ink-mute">
            From the first scan to a locked record — attendance becomes a non-event.
          </p>
        </div>

        <div className="relative">
          {/* connector line (desktop) */}
          <svg aria-hidden className="hidden md:block absolute left-0 right-0 top-[46px] w-full h-[2px] z-0 overflow-visible">
            <line x1="0" y1="1" x2="100%" y2="1" ref={lineRef} stroke="var(--accent)" strokeWidth="2" strokeOpacity="0.3" strokeLinecap="round" />
          </svg>

          <div className="relative z-10 grid md:grid-cols-3 gap-8 lg:gap-12">
            {STEPS.map((s) => (
              <div key={s.n} className="hiw-step group text-center md:text-left">
                <div className="flex items-center gap-4 justify-center md:justify-start">
                  <div className="relative w-[92px] h-[92px] flex-shrink-0 rounded-2xl glass border border-ink/10 dark:border-white/10 flex items-center justify-center p-5 transition-transform duration-300 group-hover:-translate-y-1">
                    <s.Icon />
                  </div>
                  <span className="font-display text-[3.2rem] leading-none text-ink/[0.08] dark:text-white/[0.08] tabular-nums select-none">{s.n}</span>
                </div>
                <h3 className="mt-6 font-display text-[1.5rem] tracking-tight text-ink">{s.t}</h3>
                <p className="mt-2.5 text-[13.5px] leading-[1.6] text-ink-mute max-w-[300px] mx-auto md:mx-0">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
