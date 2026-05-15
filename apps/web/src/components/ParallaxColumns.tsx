'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initGSAP } from '@/lib/gsap-init';

if (typeof window !== 'undefined') initGSAP();

const LEFT_ITEMS = [
  { tag: 'Live scan validation', value: '99.7%', sub: 'scan success rate' },
  { tag: 'QR token lifetime',    value: '7s',    sub: 'rotated & signed' },
  { tag: 'Device binding',       value: '1:1',   sub: 'student to device' },
  { tag: 'Institutions',         value: '40+',   sub: 'in private beta' },
];

const RIGHT_ITEMS = [
  { tag: 'Fraud blocked',      value: '132k', sub: 'spoofed scans stopped' },
  { tag: 'Cross-tenant leaks', value: '0',    sub: 'fully isolated' },
  { tag: 'Geofence radius',    value: '50m',  sub: 'server-side Haversine' },
  { tag: 'Avg attendance',     value: '88%',  sub: 'vs 62% paper' },
];

function StatCard({ tag, value, sub }: { tag: string; value: string; sub: string }) {
  return (
    <div className="pcol-item glass rounded-2xl p-6 mb-4 select-none will-change-transform border border-ink/8 dark:border-white/8">
      <div className="text-[10px] tracking-[0.2em] uppercase text-ink-mute mb-3 font-medium">{tag}</div>
      <div className="font-display text-[3.2rem] leading-none tracking-tightest text-ink dark:text-[#F0EDE6] counter-num mb-2">
        {value}
      </div>
      <div className="text-[12px] text-ink-mute">{sub}</div>
    </div>
  );
}

export function ParallaxColumns() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!root.current) return;
    if (typeof window === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Left column scrolls up
      gsap.to('.pcol-left .pcol-item', {
        yPercent: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });

      // Right column scrolls down
      gsap.to('.pcol-right .pcol-item', {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });

      // Fade cards in on entrance
      gsap.fromTo(
        '.pcol-left .pcol-item',
        { opacity: 0, x: -40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: {
            trigger: root.current,
            start: 'top 85%',
          },
        }
      );

      gsap.fromTo(
        '.pcol-right .pcol-item',
        { opacity: 0, x: 40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: {
            trigger: root.current,
            start: 'top 85%',
          },
        }
      );

      // Velocity-based jiggle
      let lastVel = 0;
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          const vel = self.getVelocity() / 1000;
          if (Math.abs(vel - lastVel) > 0.01) {
            gsap.to('.pcol-left .pcol-item', {
              rotation: vel * -4,
              skewY: vel * -1.5,
              duration: 0.5,
              ease: 'power2.out',
              overwrite: 'auto',
            });
            gsap.to('.pcol-right .pcol-item', {
              rotation: vel * 4,
              skewY: vel * 1.5,
              duration: 0.5,
              ease: 'power2.out',
              overwrite: 'auto',
            });
            lastVel = vel;
          }
        },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative py-28 overflow-hidden" aria-label="By the numbers">
      {/* Section label */}
      <div className="container mb-16">
        <div className="text-[10.5px] tracking-[0.22em] uppercase text-ink-mute mb-4">
          [ 01.5 — by the numbers ]
        </div>
        <h2 className="font-display text-[3rem] md:text-[4rem] leading-[1.02] text-ink dark:text-[#F0EDE6] max-w-xl">
          Numbers that<br />
          <span className="italic text-accent">speak for</span> themselves.
        </h2>
      </div>

      {/* Two columns */}
      <div className="container">
        <div className="grid grid-cols-2 gap-5 md:gap-8 max-w-2xl mx-auto md:mx-0 md:ml-auto md:mr-auto">
          {/* Left column */}
          <div className="pcol-left">
            {LEFT_ITEMS.map((item) => (
              <StatCard key={item.tag} {...item} />
            ))}
          </div>

          {/* Right column — offset down */}
          <div className="pcol-right pt-12">
            {RIGHT_ITEMS.map((item) => (
              <StatCard key={item.tag} {...item} />
            ))}
          </div>
        </div>
      </div>

      {/* Decorative large number background */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 font-display text-[18vw] leading-none text-ink/[0.025] select-none pointer-events-none tabular-nums hidden md:block"
        aria-hidden
      >
        01.5
      </div>
    </section>
  );
}
