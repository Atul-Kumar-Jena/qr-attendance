'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initGSAP } from '@/lib/gsap-init';
import { useTheme } from '@/context/ThemeContext';

if (typeof window !== 'undefined') initGSAP();

/**
 * 3D-tilted dashboard mockup that scrubs its rotation as you scroll past.
 * Inside: animated bar chart, counters, live scan ticker.
 */
export function DashboardPreview() {
  const root = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const barBg = theme === 'dark' ? 'rgba(240, 237, 230, 0.65)' : 'rgba(11,18,32,0.85)';

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        card.current,
        { rotateX: 28, rotateY: -8, scale: 0.92, y: 80 },
        {
          rotateX: 0, rotateY: 0, scale: 1, y: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top 80%',
            end: 'center 55%',
            scrub: 1,
          },
        },
      );

      // animate bar columns
      gsap.from('.bar', {
        scaleY: 0,
        transformOrigin: 'bottom',
        stagger: 0.04,
        duration: 1.1,
        ease: 'expo.out',
        scrollTrigger: { trigger: card.current, start: 'top 75%' },
      });

      // live scan ticker — cycle items
      const ticker = gsap.utils.toArray<HTMLElement>('.tick-row');
      ticker.forEach((row, i) => {
        gsap.from(row, {
          opacity: 0, x: -16,
          duration: 0.6, delay: 0.5 + i * 0.12, ease: 'power2.out',
          scrollTrigger: { trigger: card.current, start: 'top 75%' },
        });
      });

      // counters
      gsap.utils.toArray<HTMLElement>('[data-counter]').forEach((el) => {
        const target = Number(el.dataset.counter);
        const obj = { v: 0 };
        ScrollTrigger.create({
          trigger: el, start: 'top 90%',
          onEnter: () => gsap.to(obj, {
            v: target, duration: 1.8, ease: 'expo.out',
            onUpdate: () => (el.textContent = Math.floor(obj.v).toLocaleString()),
          }),
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="dashboard" ref={root} className="py-28 lg:py-40">
      <div className="container mb-12 text-center">
        <span data-reveal className="text-[11px] tracking-[0.3em] text-ink-mute uppercase">[ 04 — dashboard ]</span>
        <h2 data-reveal className="mt-4 font-display text-[2.5rem] lg:text-[4rem] leading-[1.02] tracking-tightish max-w-3xl mx-auto">
          A dashboard you'd actually want to open.
        </h2>
      </div>

      <div className="container" style={{ perspective: '1600px' }}>
        <div
          ref={card}
          className="relative will-change-transform rounded-2xl border border-ink/10 bg-cream-50 shadow-[0_50px_120px_-30px_rgba(11,18,32,0.25)] overflow-hidden"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Title bar */}
          <div className="flex items-center gap-2 border-b border-ink/8 px-5 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-accent/80" />
            <span className="ml-4 text-[11.5px] font-mono text-ink-mute">
              attendly.app/admin/sessions/CS-301 · OPEN
            </span>
            <span className="ml-auto text-[11px] text-sage-600 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-sage-500 animate-pulse" /> live
            </span>
          </div>

          <div className="grid grid-cols-12 gap-px bg-ink/8">
            {/* Sidebar */}
            <aside className="col-span-2 bg-cream-50 p-4 text-[12px] hidden md:block">
              <div className="font-mono text-[10px] tracking-wider text-ink-mute mb-3">MENU</div>
              {['Overview', 'Sessions', 'QR Live', 'Students', 'Reports', 'Audit'].map((m, i) => (
                <div key={m} className={`px-2 py-2 rounded-md ${i === 2 ? 'bg-ink text-cream-50' : 'text-ink-mute'}`}>
                  {m}
                </div>
              ))}
            </aside>

            {/* Main */}
            <main className="col-span-12 md:col-span-10 bg-cream-50 p-6">
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { l: 'Marked', v: 187 },
                  { l: 'Pending', v: 14 },
                  { l: 'Suspicious', v: 2 },
                ].map((s) => (
                  <div key={s.l} className="rounded-xl border border-ink/8 p-4">
                    <div className="text-[10.5px] tracking-[0.18em] text-ink-mute uppercase">{s.l}</div>
                    <div className="counter-num font-display text-[2.2rem] leading-none mt-2">
                      <span data-counter={s.v}>0</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-4">
                {/* Bar chart */}
                <div className="rounded-xl border border-ink/8 p-5">
                  <div className="flex items-baseline justify-between mb-4">
                    <div>
                      <div className="text-[10.5px] tracking-[0.18em] text-ink-mute uppercase">Last 14 sessions</div>
                      <div className="font-display text-[1.4rem]">Attendance pulse</div>
                    </div>
                    <span className="text-[11px] text-sage-600">+4.2% wk/wk</span>
                  </div>
                  <div className="h-40 grid grid-cols-14 items-end gap-1.5">
                    {[68, 74, 82, 60, 88, 90, 72, 86, 94, 80, 91, 85, 96, 92].map((h, i) => (
                      <div
                        key={i}
                        className="bar rounded-t-sm"
                        style={{
                          height: `${h}%`,
                          background: i === 12 ? '#FF6B3D' : barBg,
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Live ticker */}
                <div className="rounded-xl border border-ink/8 p-5">
                  <div className="text-[10.5px] tracking-[0.18em] text-ink-mute uppercase mb-3">Live scans</div>
                  <ul className="space-y-2.5">
                    {[
                      { n: 'Aanya R.', t: '09:31:02', d: '28m in', ok: true },
                      { n: 'Karan V.', t: '09:31:00', d: '31m in', ok: true },
                      { n: 'Ishita G.', t: '09:30:58', d: 'geo miss', ok: false },
                      { n: 'Rahul T.',  t: '09:30:55', d: '12m in', ok: true },
                      { n: 'Nikhil S.', t: '09:30:51', d: 'device mismatch', ok: false },
                    ].map((r, i) => (
                      <li key={i} className="tick-row flex items-center justify-between text-[12.5px]">
                        <div className="flex items-center gap-2.5">
                          <span className={`h-1.5 w-1.5 rounded-full ${r.ok ? 'bg-sage-500' : 'bg-accent'}`} />
                          <span>{r.n}</span>
                        </div>
                        <div className="font-mono text-[11px] text-ink-mute">{r.d}</div>
                        <div className="font-mono text-[11px] text-ink-mute">{r.t}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </section>
  );
}
