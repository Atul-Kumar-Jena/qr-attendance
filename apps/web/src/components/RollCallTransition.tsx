'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { initGSAP } from '@/lib/gsap-init';

if (typeof window !== 'undefined') {
  initGSAP();
}

const ROSTER = [
  { initials: 'AR', name: 'Aarav Reddy',  roll: '21CS1108' },
  { initials: 'PS', name: 'Priya Sharma', roll: '21CS1109' },
  { initials: 'RK', name: 'Rohan Kapoor', roll: '21CS1110' },
  { initials: 'AV', name: 'Aanya Verma',  roll: '21CS1111' },
  { initials: 'VS', name: 'Vikram Singh', roll: '21CS1112' },
  { initials: 'IP', name: 'Ishita Patel', roll: '21CS1113' },
];

export function RollCallTransition() {
  const root = useRef<HTMLDivElement>(null);
  const rowsRef = useRef<HTMLDivElement[]>([]);
  const checksRef = useRef<HTMLSpanElement[]>([]);
  const modeRef = useRef<HTMLSpanElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const timerRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLSpanElement>(null);
  const beamRef = useRef<HTMLDivElement>(null);
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !root.current) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    let ctx: ReturnType<typeof gsap.context> | undefined;

    const fmt = (s: number) => {
      const m = Math.floor(s / 60);
      const ss = Math.floor(s % 60);
      return `${m}:${ss.toString().padStart(2, '0')}`;
    };

    try {
      ctx = gsap.context(() => {
        const rows = rowsRef.current.filter(Boolean);
        const checks = checksRef.current.filter(Boolean);
        if (rows.length === 0) return;

        // The "automatic" end-state — also our static fallback.
        const setAutoState = () => {
          gsap.set(checks, { scale: 1, opacity: 1, color: '#22c55e' });
          rows.forEach((r) => gsap.set(r, { backgroundColor: 'rgba(34,197,94,0.06)' }));
          if (modeRef.current) modeRef.current.textContent = 'Attendly · live QR';
          if (captionRef.current) captionRef.current.textContent = 'whole class, marked';
          if (timerRef.current) timerRef.current.textContent = '0:07';
          if (dotRef.current) gsap.set(dotRef.current, { backgroundColor: '#22c55e' });
        };

        if (reduced) { setAutoState(); return; }

        const timerObj = { v: 0 };
        const writeTimer = () => { if (timerRef.current) timerRef.current.textContent = fmt(timerObj.v); };

        // Headline mask-reveal — matches the site's reveal-line pattern.
        gsap.fromTo('.rc-head .reveal-line',
          { yPercent: 110, rotateZ: 1.5 },
          {
            yPercent: 0, rotateZ: 0, duration: 1.1, ease: 'expo.out', stagger: 0.09,
            immediateRender: false,
            scrollTrigger: { trigger: '.rc-head', start: 'top 92%' },
          },
        );

        const tl = gsap.timeline({
          repeat: isMobile ? 0 : -1,
          repeatDelay: 1.4,
          scrollTrigger: { trigger: root.current, start: 'top 68%' },
        });

        // ── Reset to the manual starting point ──────────────────────────────
        tl.add(() => {
          if (modeRef.current) modeRef.current.textContent = 'Manual roll call';
          if (captionRef.current) captionRef.current.textContent = 'time lost calling names';
        })
          .set(dotRef.current, { backgroundColor: '#FF6B3D' })
          .set(checks, { scale: 0, opacity: 0, color: 'var(--ink-mute)' })
          .set(rows, { backgroundColor: 'rgba(0,0,0,0)' })
          .set(qrRef.current, { opacity: 0, scale: 0.8 })
          .set(beamRef.current, { opacity: 0, yPercent: -120 })
          .set(timerObj, { v: 0, onComplete: writeTimer });

        // ── Manual phase: one name at a time, slowly ────────────────────────
        const step = 0.55;
        rows.forEach((row, i) => {
          const at = i * step;
          tl.to(row, { backgroundColor: 'rgba(255,107,61,0.08)', duration: 0.18 }, at)
            .to(checks[i], { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(2)' }, at + 0.22)
            .to(row, { backgroundColor: 'rgba(0,0,0,0)', duration: 0.3 }, at + 0.42);
        });
        // Clock climbs across the whole manual phase (~3:42 wasted).
        tl.to(timerObj, { v: 222, duration: rows.length * step, ease: 'none', onUpdate: writeTimer }, 0);

        // Hold a beat on the slow result.
        tl.to({}, { duration: 0.55 });

        // ── The switch: Attendly marks everyone at once ─────────────────────
        tl.add(() => {
          if (modeRef.current) modeRef.current.textContent = 'Attendly · live QR';
          if (captionRef.current) captionRef.current.textContent = 'whole class, marked';
        })
          .to(dotRef.current, { backgroundColor: '#22c55e', duration: 0.3 }, '<')
          .to(qrRef.current, { opacity: 1, scale: 1, duration: 0.35, ease: 'back.out(1.6)' }, '<')
          .set(checks, { scale: 0, opacity: 0, color: '#22c55e' })
          .set(rows, { backgroundColor: 'rgba(34,197,94,0.06)' })
          // scan beam sweeps top → bottom
          .fromTo(beamRef.current,
            { opacity: 0.9, yPercent: -120 },
            { yPercent: 120, duration: 0.5, ease: 'power1.inOut' }, '<')
          .to(beamRef.current, { opacity: 0, duration: 0.2 }, '>-0.1')
          // everyone checks in, near-instantly (tight stagger)
          .to(checks, { scale: 1, opacity: 1, duration: 0.28, ease: 'back.out(2)', stagger: 0.05 }, '<0.05')
          // timer collapses to a 7-second QR window
          .to(timerObj, { v: 7, duration: 0.45, ease: 'power2.out', onUpdate: writeTimer }, '<');

        // If mobile (one-shot), leave it resting on the automatic state.
      }, root);
    } catch { /* GSAP failure must not crash the page */ }
    return () => { try { ctx?.revert(); } catch {} };
  }, []);

  return (
    <section id="the-shift" ref={root} className="py-24 lg:py-36 overflow-hidden">
      <div className="container">
        <div className="grid lg:grid-cols-[1fr_1.05fr] gap-14 lg:gap-20 items-center">

          {/* Copy */}
          <div>
            <span className="text-[11px] tracking-[0.3em] text-ink-mute uppercase">[ the shift ]</span>
            <h2 className="rc-head font-display text-[2.6rem] lg:text-[4.2rem] leading-[1.02] tracking-tightish mt-6">
              <span className="block reveal-mask"><span className="reveal-line">Goodbye,</span></span>
              <span className="block reveal-mask"><span className="reveal-line text-accent">manual roll call.</span></span>
            </h2>
            <p className="mt-7 max-w-[440px] text-[14px] leading-[1.75] text-ink-mute">
              Calling sixty names burns the first ten minutes of every class — and a roommate
              can still answer for someone who never showed. Attendly marks the whole room the
              instant they scan. No list. No shouting. No proxies.
            </p>

            {/* Mini stats */}
            <div className="mt-9 flex items-stretch gap-8">
              <div>
                <div className="counter-num font-display text-[2.4rem] leading-none text-ink flex items-baseline gap-1">
                  ~6<span className="text-accent text-[1.2rem]">min</span>
                </div>
                <div className="mt-2 text-[11px] tracking-[0.14em] uppercase text-ink-mute">saved / class</div>
              </div>
              <span className="w-px bg-ink/12" />
              <div>
                <div className="counter-num font-display text-[2.4rem] leading-none text-ink flex items-baseline gap-1">
                  156<span className="text-accent text-[1.2rem]">hrs</span>
                </div>
                <div className="mt-2 text-[11px] tracking-[0.14em] uppercase text-ink-mute">back / year</div>
              </div>
            </div>
          </div>

          {/* Animated roster card */}
          <div className="relative mx-auto w-full max-w-[440px]">
            <div className="relative rounded-[26px] glass shadow-[0_40px_100px_-24px_rgba(11,18,32,0.22)] overflow-hidden">

              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-ink/8 dark:border-white/8">
                <div className="flex items-center gap-2.5">
                  <span ref={dotRef} className="w-1.5 h-1.5 rounded-full bg-accent" />
                  <span ref={modeRef} className="text-[12px] font-medium text-ink dark:text-white tracking-wide">
                    Attendly · live QR
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  {/* QR glyph (fades in on the switch) */}
                  <div ref={qrRef} className="opacity-0">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.6" aria-hidden>
                      <rect x="3" y="3" width="7" height="7" rx="1" />
                      <rect x="14" y="3" width="7" height="7" rx="1" />
                      <rect x="3" y="14" width="7" height="7" rx="1" />
                      <path d="M14 14h3v3h-3zM20 14v3M17 20h4" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div className="text-right">
                    <div ref={timerRef} className="font-mono text-[13px] tabular-nums text-accent leading-none">0:07</div>
                    <span ref={captionRef} className="text-[9px] tracking-[0.12em] uppercase text-ink-mute">whole class, marked</span>
                  </div>
                </div>
              </div>

              {/* Roster */}
              <div className="relative">
                {ROSTER.map((s, i) => (
                  <div
                    key={s.roll}
                    ref={(el) => { if (el) rowsRef.current[i] = el; }}
                    className="flex items-center gap-3 px-5 py-3 border-b border-ink/5 dark:border-white/5 last:border-0"
                    style={{ backgroundColor: 'rgba(34,197,94,0.06)' }}
                  >
                    <span className="w-8 h-8 rounded-full bg-accent/15 flex items-center justify-center text-accent text-[11px] font-semibold flex-shrink-0">
                      {s.initials}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] text-ink dark:text-white truncate leading-tight">{s.name}</div>
                      <div className="font-mono text-[10.5px] text-ink-mute truncate">{s.roll}</div>
                    </div>
                    <span
                      ref={(el) => { if (el) checksRef.current[i] = el; }}
                      className="flex-shrink-0"
                      style={{ color: '#22c55e' }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d="M4 12.5l5 5L20 6" />
                      </svg>
                    </span>
                  </div>
                ))}

                {/* Scan beam overlay */}
                <div
                  ref={beamRef}
                  className="pointer-events-none absolute inset-x-0 top-0 h-10 opacity-0"
                  style={{ background: 'linear-gradient(to bottom, rgba(255,107,61,0) 0%, rgba(255,107,61,0.28) 50%, rgba(255,107,61,0) 100%)' }}
                />
              </div>
            </div>

            {/* Caption under card */}
            <p className="mt-4 text-center text-[11px] text-ink-mute font-mono tracking-wide">
              one tap to start · everyone marked before the bell
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
