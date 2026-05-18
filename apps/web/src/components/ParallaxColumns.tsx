'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initGSAP } from '@/lib/gsap-init';
import { useSiteConfig } from '@/context/SiteConfigContext';

if (typeof window !== 'undefined') initGSAP();

export interface StatItem {
  tag: string;
  value: string;
  sub: string;
}

export const DEFAULT_STATS: StatItem[] = [
  { tag: 'Live scan validation', value: '99.7%', sub: 'scan success rate' },
  { tag: 'QR token lifetime',    value: '7s',    sub: 'rotated & signed' },
  { tag: 'Device binding',       value: '1:1',   sub: 'student to device' },
  { tag: 'Institutions',         value: '40+',   sub: 'in private beta' },
  { tag: 'Fraud blocked',        value: '132k',  sub: 'spoofed scans stopped' },
  { tag: 'Cross-tenant leaks',   value: '0',     sub: 'fully isolated' },
  { tag: 'Geofence radius',      value: '50m',   sub: 'server-side Haversine' },
  { tag: 'Avg attendance',       value: '88%',   sub: 'vs 62% paper' },
];

function parseValue(val: string): { num: number | null; suffix: string } {
  if (!val || val.includes(':')) return { num: null, suffix: val };
  const m = val.match(/^(\d+\.?\d*)(.*)$/);
  if (!m) return { num: null, suffix: val };
  return { num: parseFloat(m[1]), suffix: m[2] || '' };
}

function StatCard({ tag, value, sub, delay }: StatItem & { delay: number }) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const { num, suffix } = parseValue(value);

  useEffect(() => {
    if (num === null || !spanRef.current) return;
    const span = spanRef.current;
    const isDecimal = value.includes('.');
    const obj = { v: 0 };
    try {
      ScrollTrigger.create({
        trigger: span,
        start: 'top 90%',
        once: true,
        onEnter: () => {
          gsap.to(obj, {
            v: num,
            duration: 2,
            ease: 'power3.out',
            delay,
            onUpdate: () => {
              span.textContent = (isDecimal ? obj.v.toFixed(1) : Math.round(obj.v).toString()) + suffix;
            },
            onComplete: () => { span.textContent = value; },
          });
        },
      });
    } catch { span.textContent = value; }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="pcol-item glass rounded-2xl p-5 md:p-6 mb-3 md:mb-4 select-none will-change-transform border border-ink/8 dark:border-white/8">
      <div className="text-[10px] tracking-[0.2em] uppercase text-ink-mute mb-2 md:mb-3 font-medium leading-tight">{tag}</div>
      <div className="font-display text-[2.2rem] md:text-[3.2rem] leading-none tracking-tightest text-ink dark:text-[#F0EDE6] mb-1.5 md:mb-2">
        {num !== null
          ? <span ref={spanRef}>{value}</span>
          : <span>{value}</span>
        }
      </div>
      <div className="text-[11px] md:text-[12px] text-ink-mute leading-snug">{sub}</div>
    </div>
  );
}

export function ParallaxColumns() {
  const root = useRef<HTMLDivElement>(null);
  const { config } = useSiteConfig();

  const raw = config.siteStats;
  const stats: StatItem[] = (Array.isArray(raw) && raw.length >= 8 && raw.some(s => s.tag || s.value))
    ? raw
    : DEFAULT_STATS;
  const leftItems  = stats.slice(0, 4);
  const rightItems = stats.slice(4, 8);

  useEffect(() => {
    if (!root.current || typeof window === 'undefined') return;
    let ctx: ReturnType<typeof gsap.context> | null = null;
    try {
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        gsap.to('.pcol-left .pcol-item', {
          yPercent: -20,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: 1.2 },
        });
        gsap.to('.pcol-right .pcol-item', {
          yPercent: 20,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: 1.2 },
        });
        gsap.fromTo('.pcol-left .pcol-item',
          { opacity: 0, x: -28 },
          { opacity: 1, x: 0, duration: 0.75, ease: 'power3.out', stagger: 0.09,
            scrollTrigger: { trigger: root.current, start: 'top 82%' } }
        );
        gsap.fromTo('.pcol-right .pcol-item',
          { opacity: 0, x: 28 },
          { opacity: 1, x: 0, duration: 0.75, ease: 'power3.out', stagger: 0.09,
            scrollTrigger: { trigger: root.current, start: 'top 82%' } }
        );
      }, root);
    } catch { /* noop */ }

    return () => { try { ctx?.revert(); } catch {} };
  }, []);

  return (
    <section ref={root} className="relative py-20 md:py-28 overflow-hidden" aria-label="By the numbers">
      <div className="container mb-10 md:mb-16">
        <div className="text-[10.5px] tracking-[0.22em] uppercase text-ink-mute mb-4">
          [ 01.5 — by the numbers ]
        </div>
        <h2 className="font-display text-[2.2rem] md:text-[4rem] leading-[1.02] text-ink dark:text-[#F0EDE6] max-w-xl">
          Numbers that<br />
          <span className="italic text-accent">speak for</span> themselves.
        </h2>
      </div>

      <div className="container">
        <div className="grid grid-cols-2 gap-3 md:gap-8 max-w-2xl mx-auto">
          <div className="pcol-left">
            {leftItems.map((item, i) => (
              <StatCard key={item.tag || i} {...item} delay={i * 0.08} />
            ))}
          </div>
          <div className="pcol-right pt-8 md:pt-12">
            {rightItems.map((item, i) => (
              <StatCard key={item.tag || i} {...item} delay={i * 0.08} />
            ))}
          </div>
        </div>
      </div>

      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 font-display text-[18vw] leading-none text-ink/[0.025] select-none pointer-events-none tabular-nums hidden md:block"
        aria-hidden
      >
        01.5
      </div>
    </section>
  );
}
