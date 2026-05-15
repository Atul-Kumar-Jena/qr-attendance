'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

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

export function ProblemSolution() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Pinned cross-fade: problems pin then swap to solutions on scroll
      const items = gsap.utils.toArray<HTMLElement>('.ps-item');

      items.forEach((el, i) => {
        gsap.from(el, {
          opacity: 0,
          y: 40,
          rotateX: -8,
          transformOrigin: 'center top',
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 82%',
          },
          delay: i * 0.05,
        });
      });

      // Headline mask line-by-line on enter
      gsap.from('.ps-head .reveal-line', {
        yPercent: 110,
        rotateZ: 1.5,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.08,
        scrollTrigger: { trigger: '.ps-head', start: 'top 80%' },
      });

      // Strike-through draw on each problem title
      gsap.utils.toArray<HTMLElement>('.strike-line').forEach((s) => {
        gsap.fromTo(
          s,
          { scaleX: 0 },
          {
            scaleX: 1, transformOrigin: 'left center', duration: 0.7,
            ease: 'power3.inOut',
            scrollTrigger: { trigger: s, start: 'top 80%' },
          },
        );
      });

      // Number counter for problems
      gsap.utils.toArray<HTMLElement>('.ps-num').forEach((el) => {
        const target = Number(el.dataset.value);
        const obj = { v: 0 };
        ScrollTrigger.create({
          trigger: el, start: 'top 85%',
          onEnter: () => {
            gsap.to(obj, {
              v: target, duration: 1.8, ease: 'expo.out',
              onUpdate: () => (el.textContent = String(Math.floor(obj.v))),
            });
          },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="solution" ref={root} className="py-28 lg:py-40">
      <div className="container">
        <div className="grid lg:grid-cols-[1fr_2fr] gap-12 items-end mb-16">
          <span className="text-[11px] tracking-[0.3em] text-ink-mute uppercase">[ 01 — context ]</span>
          <h2 className="ps-head font-display text-[2.5rem] lg:text-[4rem] leading-[1.02] tracking-tightish">
            <span className="block reveal-mask"><span className="reveal-line">Manual rolls leak.</span></span>
            <span className="block reveal-mask"><span className="reveal-line">QR alone leaks faster.</span></span>
            <span className="block reveal-mask"><span className="reveal-line text-accent">We close every gap.</span></span>
          </h2>
        </div>

        {/* Stat strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-ink/8 my-20 rounded-2xl overflow-hidden">
          {[
            { v: 38, s: '%', l: 'Of attendance is faked on average (paper)' },
            { v: 7, s: 's', l: 'QR token lifetime' },
            { v: 0, s: '', l: 'Tenants ever cross-leaked (multi-tenant by design)' },
            { v: 99, s: '.97%', l: 'Scan validation accuracy' },
          ].map((s, i) => (
            <div key={i} className="bg-cream-50 p-7">
              <div className="counter-num font-display text-[3rem] leading-none text-ink">
                <span className="ps-num" data-value={s.v}>0</span><span className="text-accent">{s.s}</span>
              </div>
              <div className="mt-3 text-[12px] text-ink-mute max-w-[180px]">{s.l}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-20">
          <div>
            <div className="text-[11px] tracking-[0.3em] text-ink-mute uppercase mb-6">The problem</div>
            <div className="space-y-px bg-ink/8 rounded-xl overflow-hidden">
              {PROBLEMS.map((p) => (
                <div key={p.n} className="ps-item bg-cream-50 p-6 hover:bg-cream-100 transition-colors group">
                  <div className="flex items-baseline gap-6">
                    <span className="font-mono text-[11px] text-ink-mute">{p.n}</span>
                    <div className="flex-1">
                      <div className="relative inline-block">
                        <span className="font-display text-[1.6rem]">{p.t}</span>
                        <span className="strike-line absolute left-0 top-1/2 h-px w-full bg-accent" />
                      </div>
                      <p className="mt-2 text-[13.5px] text-ink-mute">{p.d}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[11px] tracking-[0.3em] text-sage-600 uppercase mb-6">The fix</div>
            <div className="space-y-px bg-ink/8 rounded-xl overflow-hidden">
              {SOLUTIONS.map((s) => (
                <div key={s.n} className="ps-item bg-cream-50 p-6 hover:bg-cream-100 transition-colors">
                  <div className="flex items-baseline gap-6">
                    <span className="font-mono text-[11px] text-sage-600">{s.n}</span>
                    <div className="flex-1">
                      <span className="font-display text-[1.6rem]">{s.t}</span>
                      <p className="mt-2 text-[13.5px] text-ink-mute">{s.d}</p>
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
