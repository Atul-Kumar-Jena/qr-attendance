'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initGSAP } from '@/lib/gsap-init';
import { SplitText } from './SplitText';

if (typeof window !== 'undefined') initGSAP();

const Q = [
  { q: 'Can a student forward the code to a friend?',
    a: 'The code expires in seconds and only works once. Even if a friend gets it, it won’t work on their phone — so forwarding it is pointless.' },
  { q: 'What about a fake-GPS app?',
    a: 'We can tell when a location is being faked, and we check the student is genuinely inside the classroom. Fake-GPS attempts are turned away and flagged for review.' },
  { q: 'What if a student gets a new phone?',
    a: 'They ask for a device reset right inside the app. An admin approves it in a tap, and the old phone immediately stops working.' },
  { q: 'Will it work offline?',
    a: 'Scanning needs a connection so we can verify everything as it happens. A student’s own attendance history stays available offline.' },
  { q: 'Does the code contain personal data?',
    a: 'No. The code holds nothing about the student — only enough to identify the class and session — and it expires within seconds.' },
  { q: 'Can one institution see another’s data?',
    a: 'Never. Each institution’s data lives in its own completely separate space. It’s simply not possible for one school to see another’s.' },
];

export function Faq() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      gsap.from('.faq-row', {
        opacity: 0, y: 30, stagger: 0.06, ease: 'power3.out', duration: 0.8,
        immediateRender: false,
        scrollTrigger: { trigger: root.current, start: 'top 92%' },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="py-28 lg:py-40">
      <div className="container grid lg:grid-cols-[1fr_2fr] gap-12">
        <div>
          <span className="text-[11px] tracking-[0.3em] text-ink-mute uppercase">[ 07 — faq ]</span>
          <SplitText as="h2" className="mt-4 font-display text-[2.5rem] lg:text-[3.4rem] leading-[1.02] tracking-tightish block">
            Asked often.
          </SplitText>
        </div>
        <ul className="divide-y divide-ink/10">
          {Q.map((row, i) => (
            <Row key={i} q={row.q} a={row.a} />
          ))}
        </ul>
      </div>
    </section>
  );
}

function Row({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  const body = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!body.current) return;
    gsap.to(body.current, {
      height: open ? body.current.scrollHeight : 0,
      opacity: open ? 1 : 0,
      duration: 0.6,
      ease: 'expo.inOut',
    });
  }, [open]);
  return (
    <li className="faq-row group py-5">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between text-left gap-6 active:scale-[0.995] transition-transform"
        data-magnetic
      >
        <span className={`font-display text-[1.35rem] leading-tight transition-colors duration-300 ${open ? 'text-accent' : 'group-hover:text-accent'}`}>{q}</span>
        <span className={`text-2xl text-accent transition-transform duration-300 ${open ? 'rotate-45' : 'group-hover:rotate-90'}`}>+</span>
      </button>
      <div ref={body} className="overflow-hidden h-0 opacity-0 text-[14px] text-ink-mute max-w-2xl">
        <p className="pt-3">{a}</p>
      </div>
    </li>
  );
}
