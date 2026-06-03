'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initGSAP } from '@/lib/gsap-init';

if (typeof window !== 'undefined') {
  initGSAP();
}

const PROBLEMS = [
  { n: '01', t: 'Proxy attendance', d: 'A roommate marks them present.' },
  { n: '02', t: 'Forwarded QR', d: 'A screenshot in the class group does the rest.' },
  { n: '03', t: 'Paper registers', d: 'Hours of data entry, signatures faked.' },
  { n: '04', t: 'Fake GPS', d: 'One mock-location app and "I was there."' },
];

const SOLUTIONS = [
  { n: '01', t: 'Dynamic signed QR', d: 'Rotated every 7 seconds, single-use, signed server-side.' },
  { n: '02', t: 'Device binding', d: 'One student, one device — only admins can reset.' },
  { n: '03', t: 'Geofence + accuracy', d: 'Haversine on the server; mock-location instantly flagged.' },
  { n: '04', t: 'Play Integrity / App Attest', d: 'Requests outside the genuine app don\'t validate.' },
];

const STATS = [
  { v: 38, s: '%', l: 'Of attendance is faked on average (paper)' },
  { v: 7,  s: 's', l: 'QR token lifetime' },
  { v: 0,  s: '',  l: 'Tenants ever cross-leaked (multi-tenant by design)' },
  { v: 99, s: '.97%', l: 'Scan validation accuracy' },
];

export function ProblemSolution() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Reduced motion: the final numbers are in the markup, content is visible —
    // skip the reveal + count-up choreography entirely.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let ctx: ReturnType<typeof gsap.context> | undefined;
    try {
      ctx = gsap.context(() => {
        // Cards stagger in — immediateRender:false so missed ScrollTriggers
        // don't strand the cards at opacity:0
        gsap.utils.toArray<HTMLElement>('.ps-item').forEach((el, i) => {
          gsap.fromTo(el,
            { opacity: 0, y: 32, rotateX: -6 },
            {
              opacity: 1, y: 0, rotateX: 0,
              transformOrigin: 'center top',
              duration: 0.9, ease: 'power3.out',
              immediateRender: false,
              scrollTrigger: { trigger: el, start: 'top 92%' },
              delay: i * 0.05,
            },
          );
        });

        // Headline reveal — start visible, animate up from below on trigger
        gsap.fromTo('.ps-head .reveal-line',
          { yPercent: 110, rotateZ: 1.5 },
          {
            yPercent: 0, rotateZ: 0, duration: 1.1, ease: 'expo.out', stagger: 0.09,
            immediateRender: false,
            scrollTrigger: { trigger: '.ps-head', start: 'top 95%' },
          },
        );

        // Strike-through draw
        gsap.utils.toArray<HTMLElement>('.strike-line').forEach((s) => {
          gsap.fromTo(s,
            { scaleX: 0 },
            { scaleX: 1, transformOrigin: 'left center', duration: 0.65, ease: 'power3.inOut',
              immediateRender: false,
              scrollTrigger: { trigger: s, start: 'top 92%' } },
          );
        });

        // Stat counters
        gsap.utils.toArray<HTMLElement>('.ps-num').forEach((el) => {
          const target = Number(el.dataset.value);
          if (!Number.isFinite(target)) return;
          const obj = { v: 0 };
          ScrollTrigger.create({
            trigger: el, start: 'top 95%',
            onEnter: () => {
              gsap.to(obj, {
                v: target, duration: 1.8, ease: 'expo.out',
                onUpdate: () => (el.textContent = String(Math.floor(obj.v))),
              });
            },
          });
        });

        // Stat block entrance
        gsap.utils.toArray<HTMLElement>('.ps-stat-block').forEach((el, i) => {
          gsap.fromTo(el,
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out',
              immediateRender: false,
              scrollTrigger: { trigger: el, start: 'top 92%' },
              delay: i * 0.07 },
          );
        });

        // NEW — solution-icon spin-in on each fix card
        gsap.utils.toArray<HTMLElement>('.sol-icon').forEach((el, i) => {
          gsap.fromTo(el,
            { rotate: -90, scale: 0, opacity: 0 },
            {
              rotate: 0, scale: 1, opacity: 1,
              duration: 0.8, ease: 'back.out(2)',
              immediateRender: false,
              scrollTrigger: { trigger: el, start: 'top 95%' },
              delay: i * 0.08,
            },
          );
        });

        // NEW — gradient sweep on the "We close every gap." line
        gsap.fromTo('.ps-head .text-accent',
          { backgroundPosition: '200% 0' },
          {
            backgroundPosition: '0% 0', duration: 1.5, ease: 'power2.out',
            immediateRender: false,
            scrollTrigger: { trigger: '.ps-head', start: 'top 75%' },
          },
        );
      }, root);
    } catch { /* GSAP failure must not crash the page */ }
    return () => { try { ctx?.revert(); } catch {} };
  }, []);

  return (
    <section id="solution" ref={root} className="py-28 lg:py-44">
      <div className="container">
        {/* Header */}
        <div className="grid lg:grid-cols-[1fr_2fr] gap-12 items-end mb-16">
          <span className="text-[11px] tracking-[0.3em] text-ink-mute uppercase">[ 01 — context ]</span>
          <h2 className="ps-head font-display text-[2.6rem] lg:text-[4.2rem] leading-[1.02] tracking-tightish">
            <span className="block reveal-mask"><span className="reveal-line">Manual rolls leak.</span></span>
            <span className="block reveal-mask"><span className="reveal-line">QR alone leaks faster.</span></span>
            <span className="block reveal-mask"><span className="reveal-line text-accent">We close every gap.</span></span>
          </h2>
        </div>

        {/* Stat strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-ink/6 my-20 rounded-2xl overflow-hidden">
          {STATS.map((s, i) => (
            <div key={i} className="ps-stat-block bg-cream-50 p-7 hover:bg-cream-100 transition-colors">
              <div className="counter-num font-display text-[3.2rem] leading-none text-ink flex items-baseline gap-1.5">
                <span className="ps-num" data-value={s.v}>{s.v}</span>
                {s.s && <span className="text-accent text-[1.6rem]">{s.s}</span>}
              </div>
              <div className="mt-3 text-[12px] leading-[1.5] text-ink-mute max-w-[180px]">{s.l}</div>
            </div>
          ))}
        </div>

        {/* Problem / Fix grid */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-20">
          {/* Problems */}
          <div>
            <div className="text-[11px] tracking-[0.3em] text-ink-mute uppercase mb-7">The problem</div>
            <div className="space-y-px bg-ink/6 rounded-2xl overflow-hidden">
              {PROBLEMS.map((p) => (
                <div key={p.n} className="ps-item bg-cream-50 px-6 py-5 hover:bg-cream-100 transition-colors group">
                  <div className="flex items-start gap-6">
                    <span className="font-mono text-[11px] text-ink-mute pt-1">{p.n}</span>
                    <div className="flex-1">
                      <div className="relative inline-block">
                        <span className="font-display text-[1.55rem] leading-tight">{p.t}</span>
                        <span className="strike-line absolute left-0 top-[54%] h-px w-full bg-accent" />
                      </div>
                      <p className="mt-2 text-[13px] leading-[1.6] text-ink-mute">{p.d}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Solutions */}
          <div>
            <div className="text-[11px] tracking-[0.3em] text-sage-600 uppercase mb-7">The fix</div>
            <div className="space-y-px bg-ink/6 rounded-2xl overflow-hidden">
              {SOLUTIONS.map((s, i) => (
                <div key={s.n} className="ps-item bg-cream-50 px-6 py-5 hover:bg-cream-100 transition-colors">
                  <div className="flex items-start gap-6">
                    <span className="font-mono text-[11px] text-sage-600 pt-1">{s.n}</span>
                    <div className="flex-1">
                      <SolutionIcon index={i} />
                      <span className="font-display text-[1.55rem] leading-tight">{s.t}</span>
                      <p className="mt-2 text-[13px] leading-[1.6] text-ink-mute">{s.d}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const SOLUTION_ICONS = [
  // Dynamic QR — rotating square
  <svg key="qr" width="28" height="28" viewBox="0 0 28 28" className="mb-2 icon-spin-slow text-accent" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="4" y="4" width="8" height="8" rx="1.5" />
    <rect x="16" y="4" width="8" height="8" rx="1.5" />
    <rect x="4" y="16" width="8" height="8" rx="1.5" />
    <path d="M16 16h2v2h-2zM20 16h4v2h-4zM22 20v4h-4v-2h2v-2z" strokeWidth="0" fill="currentColor" />
  </svg>,
  // Device binding — phone + lock
  <svg key="device" width="28" height="28" viewBox="0 0 28 28" className="mb-2 icon-pulse text-accent" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="7" y="3" width="14" height="22" rx="2.5" />
    <circle cx="14" cy="21" r="1" fill="currentColor" stroke="none" />
    <rect x="11" y="10" width="6" height="5" rx="1" />
    <path d="M12 10V8a2 2 0 0 1 4 0v2" />
  </svg>,
  // Geofence — concentric rings
  <svg key="geo" width="28" height="28" viewBox="0 0 28 28" className="mb-2 icon-float text-accent" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="14" cy="14" r="3" />
    <circle cx="14" cy="14" r="7" strokeDasharray="3 2" />
    <circle cx="14" cy="14" r="11" strokeDasharray="2 3" opacity="0.5" />
    <line x1="14" y1="3" x2="14" y2="6" strokeLinecap="round" />
    <line x1="14" y1="22" x2="14" y2="25" strokeLinecap="round" />
    <line x1="3" y1="14" x2="6" y2="14" strokeLinecap="round" />
    <line x1="22" y1="14" x2="25" y2="14" strokeLinecap="round" />
  </svg>,
  // App attestation — shield + check
  <svg key="shield" width="28" height="28" viewBox="0 0 28 28" className="mb-2 icon-pulse delay-300 text-accent" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M14 3L5 7v7c0 5 4 9 9 11 5-2 9-6 9-11V7L14 3z" />
    <path d="M10 14l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
];

function SolutionIcon({ index }: { index: number }) {
  return <div className="sol-icon text-accent inline-block">{SOLUTION_ICONS[index]}</div>;
}
