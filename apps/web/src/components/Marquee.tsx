'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

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
    const ctx = gsap.context(() => {
      const skewSetter = gsap.quickSetter(track.current!, 'skewX', 'deg');
      const speedSetter = gsap.quickSetter(track.current!, 'x', 'px');
      let baseX = 0;
      const baseTween = gsap.to({}, {
        duration: 40, repeat: -1, ease: 'none',
        onUpdate() { baseX -= (track.current!.offsetWidth / 2) / (40 * 60); },
      });

      ScrollTrigger.create({
        trigger: root.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          const v = self.getVelocity() / 400;
          skewSetter(gsap.utils.clamp(-12, 12, v));
          gsap.to(track.current, {
            skewX: 0,
            duration: 0.8,
            ease: 'power3.out',
            overwrite: true,
          });
        },
      });

      // RAF loop for steady horizontal motion
      gsap.ticker.add(() => speedSetter(baseX % (track.current!.offsetWidth / 2)));
      return () => baseTween.kill();
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
