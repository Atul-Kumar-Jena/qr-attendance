'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initGSAP } from '@/lib/gsap-init';

if (typeof window !== 'undefined') initGSAP();

const ITEMS = [
  'DTU · Delhi Technological University',
  'NIT Trichy',
  'BITS Pilani',
  'Chitkara University',
  'St. Stephen\'s College',
  'IIIT Hyderabad',
  'Manipal Academy',
  'Symbiosis Pune',
];

/**
 * Velocity-based marquee: skews + speeds up on scroll, returns to baseline
 * on rest. Uncommon, very tactile.
 */
export function Marquee() {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !root.current || !track.current) return;
    let ctx: ReturnType<typeof gsap.context> | undefined;
    let tickerFn: (() => void) | null = null;
    let baseTween: gsap.core.Tween | null = null;
    try {
      ctx = gsap.context(() => {
        const t = track.current;
        const r = root.current;
        if (!t || !r) return;
        const skewSetter = gsap.quickSetter(t, 'skewX', 'deg');
        const speedSetter = gsap.quickSetter(t, 'x', 'px');
        let baseX = 0;
        baseTween = gsap.to({}, {
          duration: 40, repeat: -1, ease: 'none',
          onUpdate() {
            const el = track.current;
            if (!el) return;
            baseX -= (el.offsetWidth / 2) / (40 * 60);
          },
        });

        ScrollTrigger.create({
          trigger: r,
          start: 'top bottom',
          end: 'bottom top',
          onUpdate: (self) => {
            const el = track.current;
            if (!el) return;
            const v = self.getVelocity() / 400;
            skewSetter(gsap.utils.clamp(-12, 12, v));
            gsap.to(el, {
              skewX: 0,
              duration: 0.8,
              ease: 'power3.out',
              overwrite: true,
            });
          },
        });

        // RAF loop — must guard against null ref or removal during unmount
        tickerFn = () => {
          const el = track.current;
          if (!el) return;
          speedSetter(baseX % (el.offsetWidth / 2));
        };
        gsap.ticker.add(tickerFn);
      }, root);
    } catch { /* GSAP failure must not crash the page */ }

    return () => {
      try { if (tickerFn) gsap.ticker.remove(tickerFn); } catch {}
      try { baseTween?.kill(); } catch {}
      try { ctx?.revert(); } catch {}
    };
  }, []);

  return (
    <section ref={root} className="border-y border-ink/8 py-7 bg-cream-100/60 overflow-hidden">
      <div ref={track} className="flex whitespace-nowrap will-change-transform">
        {[...ITEMS, ...ITEMS].map((t, i) => (
          <span
            key={i}
            className="px-8 text-[13px] uppercase tracking-[0.28em] text-ink-mute flex items-center gap-8"
          >
            {t}
            <span className="text-accent">◆</span>
          </span>
        ))}
      </div>
    </section>
  );
}
