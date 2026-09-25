'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initGSAP } from '@/lib/gsap-init';
import { Magnetic } from './Magnetic';
import { Aurora } from './Aurora';
import { InteractiveSpotlight } from './ui/interactive-spotlight';

if (typeof window !== 'undefined') initGSAP();

/**
 * Huge text reveal — a giant word that scales and wipes in as you scroll.
 * Plus a curving SVG path that draws on with scrub.
 */
export function CTA() {
  const root = useRef<HTMLDivElement>(null);
  const big = useRef<HTMLDivElement>(null);
  const path = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const desktop = window.matchMedia('(min-width: 768px) and (pointer: fine)').matches;
    const ctx = gsap.context(() => {
      // Transform + opacity on the word only. Tweening letterSpacing on the
      // wrapper forced a full re-layout every scroll frame and leaked its
      // tight tracking into the subtitle ("Demoonyourrealclassroom…").
      const p = path.current!;
      const len = p.getTotalLength();
      gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });

      if (desktop) {
        gsap.fromTo(big.current,
          { scale: 0.72, yPercent: 24, opacity: 0 },
          {
            scale: 1, yPercent: 0, opacity: 1, ease: 'expo.out',
            scrollTrigger: { trigger: root.current, start: 'top 70%', end: 'center center', scrub: 1 },
          });
        gsap.to(p, {
          strokeDashoffset: 0, ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top 70%', end: 'bottom 60%', scrub: 1 },
        });
      } else {
        const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top 80%', once: true } });
        tl.fromTo(big.current, { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, duration: 1, ease: 'expo.out' })
          .to(p, { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut' }, 0.1);
      }
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="demo" ref={root} className="cta-section section-dark relative py-40 overflow-hidden">
      <Aurora variant="soft" />
      <InteractiveSpotlight size={440} />
      <svg aria-hidden viewBox="0 0 1200 400" className="absolute inset-0 w-full h-full text-accent opacity-40 z-[1]">
        <path
          ref={path}
          d="M -50 350 C 200 100, 500 380, 700 200 S 1100 50, 1250 220"
          stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"
        />
      </svg>
      <div className="relative z-10 text-center">
        <div ref={big} className="font-display text-[16vw] leading-none tracking-tightest text-ink will-change-transform">
          attend.
        </div>
        <p className="mt-6 max-w-md mx-auto text-[14px] text-ink-mute">
          Demo on your real classroom in under 20 minutes. We bring the QR,
          you bring the students.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Magnetic strength={0.25}>
            <a href="mailto:hello@attendly.app" data-magnetic
               className="rounded-full bg-accent text-[#0A0A0B] px-7 py-3.5 text-[13.5px] font-semibold shadow-[0_8px_30px_-6px_rgba(244,242,238,0.35)] hover:bg-accent/90 transition-all">
              Request demo
            </a>
          </Magnetic>
          <Magnetic strength={0.2}>
            <a href="#features" data-magnetic
               className="rounded-full border border-white/20 text-white px-7 py-3.5 text-[13.5px] hover:bg-white/5 transition-all">
              See features
            </a>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
