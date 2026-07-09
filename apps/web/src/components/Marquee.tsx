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
      const speedSetter = gsap.quickSetter(trackEl, 'x', 'px');
      // One reusable tween instead of allocating a fresh gsap.to() on every
      // scroll frame. quickTo eases skewX toward the current scroll velocity and
      // relaxes back to 0 as the scroll settles — same effect, no per-frame GC.
      const skewTo = gsap.quickTo(trackEl, 'skewX', { duration: 0.5, ease: 'power3.out' });
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
          skewTo(gsap.utils.clamp(-12, 12, self.getVelocity() / 400));
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
