'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initGSAP } from '@/lib/gsap-init';

if (typeof window !== 'undefined') initGSAP();

const Q = [
  { q: 'Can a student forward the QR to a friend?',
    a: 'The token expires in seconds and the nonce is single-use. Even if forwarded, the friend\'s device fingerprint will not match the bound student\'s, and the request will fail.' },
  { q: 'What about a fake-GPS app?',
    a: 'Each scan carries a mock-location flag and accuracy reading. Mock = instant reject + suspicious log. Geofence is checked server-side via Haversine.' },
  { q: 'What if a student gets a new phone?',
    a: 'They request a device reset from inside the app. An admin approves it, which bumps the binding generation and invalidates the old refresh tokens.' },
  { q: 'Will it work offline?',
    a: 'The scan is online by design — that\'s how we verify session state. The app caches the student\'s own attendance history offline.' },
  { q: 'Does the QR contain personal data?',
    a: 'No. The QR is a short-lived signed token: institution id, class id, session id, issued-at, expiry, nonce, signature. Nothing about the student is in it.' },
  { q: 'How are tenants isolated?',
    a: 'Every tenant-scoped query is forced through a Prisma extension that injects the institutionId filter. Cross-tenant reads are physically impossible at the data-access layer.' },
];

export function Faq() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let ctx: ReturnType<typeof gsap.context> | undefined;
    try {
      ctx = gsap.context(() => {
        gsap.from('.faq-row', {
          opacity: 0, y: 30, stagger: 0.06, ease: 'power3.out', duration: 0.8,
          immediateRender: false,
          scrollTrigger: { trigger: root.current, start: 'top 85%' },
        });
        // Section heading wipe
        gsap.from('.faq-head', {
          opacity: 0, y: 24, duration: 1, ease: 'power3.out',
          immediateRender: false,
          scrollTrigger: { trigger: root.current, start: 'top 85%' },
        });
      }, root);
    } catch { /* GSAP failure must not crash the page */ }
    return () => { try { ctx?.revert(); } catch {} };
  }, []);

  return (
    <section ref={root} className="py-28 lg:py-40">
      <div className="container grid lg:grid-cols-[1fr_2fr] gap-12">
        <div className="faq-head">
          <span className="text-[11px] tracking-[0.3em] text-ink-mute uppercase">[ 07 — faq ]</span>
          <h2 className="mt-4 font-display text-[2.5rem] lg:text-[3.4rem] leading-[1.02] tracking-tightish">
            Asked often.
          </h2>
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
  const plus = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!body.current) return;
    try {
      gsap.to(body.current, {
        height: open ? body.current.scrollHeight : 0,
        opacity: open ? 1 : 0,
        duration: 0.6,
        ease: 'expo.inOut',
      });
      // Plus icon bounces into × with elastic feel
      if (plus.current) {
        gsap.to(plus.current, {
          rotate: open ? 135 : 0,
          scale: open ? 1.15 : 1,
          duration: 0.55,
          ease: open ? 'back.out(2.4)' : 'power3.out',
        });
      }
    } catch {}
  }, [open]);
  return (
    <li className="faq-row py-5 group">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between text-left gap-6 cursor-pointer"
        data-magnetic
      >
        <span className="font-display text-[1.35rem] leading-tight group-hover:text-accent transition-colors duration-300">{q}</span>
        <span ref={plus} className="text-2xl text-accent inline-block">+</span>
      </button>
      <div ref={body} className="overflow-hidden h-0 opacity-0 text-[14px] text-ink-mute max-w-2xl">
        <p className="pt-3">{a}</p>
      </div>
    </li>
  );
}
