'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initGSAP } from '@/lib/gsap-init';

if (typeof window !== 'undefined') initGSAP();

const STATS = [
  { value: '99.7%', tag: 'Scan success',     sub: 'live validation' },
  { value: '132k',  tag: 'Fraud blocked',    sub: 'spoofed scans stopped' },
  { value: '7s',    tag: 'QR lifetime',      sub: 'rotated & signed' },
  { value: '1:1',   tag: 'Device binding',   sub: 'student to device' },
  { value: '0',     tag: 'Tenant leaks',     sub: 'fully isolated' },
  { value: '50m',   tag: 'Geofence radius',  sub: 'server-side Haversine' },
  { value: '88%',   tag: 'Avg attendance',   sub: 'vs 62% on paper' },
  { value: '40+',   tag: 'Institutions',     sub: 'in private beta' },
];

export function ParallaxColumns() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !root.current) return;
    // Cards are visible by default (CSS). GSAP only adds an enter flourish, and
    // never strands content — immediateRender:false + a reduced-motion guard.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let ctx: ReturnType<typeof gsap.context> | undefined;
    try {
      ctx = gsap.context(() => {
        gsap.from('.pcol-item', {
          y: 28, opacity: 0, filter: 'blur(6px)',
          stagger: { each: 0.06, grid: 'auto', from: 'start' },
          ease: 'power3.out', duration: 0.85, immediateRender: false,
          scrollTrigger: { trigger: root.current, start: 'top 85%' },
        });
        // Subtle depth — gentle counter-parallax on the big background numeral.
        if (!window.matchMedia('(max-width: 900px)').matches) {
          gsap.to('.pcol-ghost', {
            yPercent: -14, ease: 'none',
            scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: 1 },
          });
        }
      }, root);
    } catch { /* GSAP failure must not crash the page */ }
    return () => { try { ctx?.revert(); } catch {} };
  }, []);

  return (
    <section ref={root} className="relative py-24 lg:py-32 overflow-hidden" aria-label="By the numbers">
      {/* Decorative numeral — sits behind, never creates empty space. */}
      <div className="pcol-ghost absolute -right-4 top-8 font-display text-[16vw] leading-none text-ink/[0.03] dark:text-white/[0.03] select-none pointer-events-none tabular-nums hidden md:block" aria-hidden>
        01.5
      </div>

      <div className="container relative">
        <div className="mb-12 max-w-xl">
          <div className="text-[10.5px] tracking-[0.22em] uppercase text-ink-mute mb-4">
            [ 01.5 — by the numbers ]
          </div>
          <h2 className="font-display text-[2.6rem] md:text-[3.6rem] leading-[1.04] text-ink dark:text-[#F0EDE6]">
            Numbers that <span className="italic text-accent">speak for</span> themselves.
          </h2>
        </div>

        {/* Compact, always-visible 4×2 grid (2 cols on mobile). */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px rounded-[24px] overflow-hidden border border-ink/10 dark:border-white/10 bg-ink/10 dark:bg-white/10">
          {STATS.map((s) => (
            <div
              key={s.tag}
              className="pcol-item group relative bg-cream-50 dark:bg-[#0A0A0A] p-6 lg:p-7 transition-colors duration-300 hover:bg-cream-100 dark:hover:bg-[#101010]"
            >
              <div className="text-[10px] tracking-[0.2em] uppercase text-ink-mute mb-3 font-medium">{s.tag}</div>
              <div className="font-display text-[2.6rem] lg:text-[3rem] leading-none tracking-tightest text-ink dark:text-[#F0EDE6] counter-num mb-1.5">
                {s.value}
              </div>
              <div className="text-[11.5px] text-ink-mute">{s.sub}</div>
              {/* hairline accent that grows on hover */}
              <span className="absolute left-0 bottom-0 h-px w-0 bg-accent transition-all duration-500 group-hover:w-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
