'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initGSAP } from '@/lib/gsap-init';
import { SplitText } from './SplitText';

const QUOTES = [
  {
    q: 'Roll call used to eat ten minutes of every lecture. Now the room is marked before I’ve opened my slides.',
    name: 'Dr. Anjali Rao',
    role: 'HOD, Computer Science · NIT Trichy',
    big: true,
  },
  {
    q: 'We tried three apps. This is the first one students couldn’t beat with a screenshot in the class group.',
    name: 'Vikram Mehta',
    role: 'Registrar · Chitkara University',
  },
  {
    q: 'Proxy attendance basically vanished. The fraud queue catches the handful who still try.',
    name: 'Sana Iqbal',
    role: 'Dean of Academics · Symbiosis Pune',
  },
  {
    q: 'Setup took an afternoon. Knowing no record can be quietly changed later made our compliance team happy.',
    name: 'Rahul Nair',
    role: 'IT Director · Manipal Academy',
  },
];

function initials(name: string) {
  return name.replace(/^Dr\.\s*/, '').split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
}

export function Testimonials() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !root.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    initGSAP();
    let ctx: ReturnType<typeof gsap.context> | undefined;
    try {
      ctx = gsap.context(() => {
        gsap.from('.tst-card', {
          y: 44, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.1,
          immediateRender: false,
          scrollTrigger: { trigger: root.current, start: 'top 80%' },
        });
      }, root);
    } catch { /* never crash */ }
    return () => { try { ctx?.revert(); } catch {} };
  }, []);

  return (
    <section id="testimonials" ref={root} className="py-24 lg:py-36">
      <div className="container">
        <div className="max-w-2xl mb-14">
          <span data-reveal className="text-[10px] tracking-[0.28em] text-ink-mute uppercase">[ proof ]</span>
          <SplitText as="h2" className="mt-4 font-display text-[2.4rem] lg:text-[3.6rem] leading-[1.04] tracking-tightish block text-ink">
            Trusted where it counts.
          </SplitText>
          <p data-reveal className="mt-5 text-[14px] leading-relaxed text-ink-mute max-w-md">
            Registrars, deans and IT teams across 40+ institutions run attendance on Attendly.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {QUOTES.map((t, i) => (
            <figure
              key={t.name}
              className={`tst-card card-lift rounded-3xl border border-ink/10 dark:border-white/10 glass p-7 flex flex-col ${t.big ? 'lg:col-span-2 lg:row-span-1' : ''}`}
            >
              <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor" aria-hidden className="text-accent/25 mb-4">
                <path d="M9.5 6C6.5 7.5 5 10 5 13v5h6v-6H8c0-2 .8-3.4 2.5-4.3L9.5 6zm9 0C15.5 7.5 14 10 14 13v5h6v-6h-3c0-2 .8-3.4 2.5-4.3L18.5 6z" />
              </svg>
              <blockquote className={`flex-1 text-ink-soft dark:text-white/85 leading-[1.55] ${t.big ? 'text-[1.35rem] lg:text-[1.7rem] font-display tracking-tight' : 'text-[15px]'}`}>
                {t.q}
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-accent/15 text-accent grid place-items-center text-[13px] font-semibold flex-shrink-0">
                  {initials(t.name)}
                </span>
                <span className="min-w-0">
                  <span className="block text-[13.5px] font-medium text-ink dark:text-white truncate">{t.name}</span>
                  <span className="block text-[11.5px] text-ink-mute truncate">{t.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
