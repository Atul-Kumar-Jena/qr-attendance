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
    const trackEl = track.current;
    if (!trackEl) return;

    const ctx = gsap.context(() => {
      const skewSetter = gsap.quickSetter(trackEl, 'skewX', 'deg');
      const speedSetter = gsap.quickSetter(trackEl, 'x', 'px');
      let baseX = 0;
      const baseTween = gsap.to({}, {
        duration: 40, repeat: -1, ease: 'none',
        onUpdate() { baseX -= (trackEl.offsetWidth / 2) / (40 * 60); },
      });

      ScrollTrigger.create({
        trigger: root.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          const v = self.getVelocity() / 400;
          skewSetter(gsap.utils.clamp(-12, 12, v));
          gsap.to(trackEl, {
            skewX: 0,
            duration: 0.8,
            ease: 'power3.out',
            overwrite: true,
          });
        },
      });

      // RAF loop for steady horizontal motion. gsap.ticker callbacks are global
      // and not tracked by gsap.context, so remove it on cleanup — otherwise it
      // leaks and dereferences a detached node (null offsetWidth crash).
      const tick = () => speedSetter(baseX % (trackEl.offsetWidth / 2));
      gsap.ticker.add(tick);
      return () => {
        baseTween.kill();
        gsap.ticker.remove(tick);
      };
    }, root);
    return () => ctx.revert();
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
