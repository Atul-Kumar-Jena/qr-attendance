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
 * Velocity-reactive marquee. The endless scroll is a pure CSS transform
 * animation (compositor-only — zero JS, zero reflow). JS only adds a subtle
 * skew driven by scroll velocity, applied with a quickSetter and decayed in the
 * ticker; it short-circuits to a no-op when idle. No per-frame layout reads.
 */
export function Marquee() {
  const root = useRef<HTMLDivElement>(null);
  const skewEl = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !root.current || !skewEl.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const setSkew = gsap.quickSetter(skewEl.current, 'skewX', 'deg');
    let skew = 0, target = 0, active = false;

    const st = ScrollTrigger.create({
      trigger: root.current,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        target = gsap.utils.clamp(-10, 10, self.getVelocity() / -240);
        active = true;
      },
    });

    const tick = () => {
      if (!active) return;
      skew += (target - skew) * 0.12;
      target *= 0.9;
      setSkew(skew);
      if (Math.abs(skew) < 0.01 && Math.abs(target) < 0.01) { skew = 0; setSkew(0); active = false; }
    };
    gsap.ticker.add(tick);

    return () => { gsap.ticker.remove(tick); st.kill(); };
  }, []);

  return (
    <section ref={root} className="border-y border-ink/8 py-7 bg-cream-100/60 overflow-hidden">
      <div ref={skewEl} className="will-change-transform">
        <div className="marquee-track">
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
      </div>
    </section>
  );
}
