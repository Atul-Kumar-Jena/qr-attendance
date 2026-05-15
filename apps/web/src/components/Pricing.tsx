'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initGSAP } from '@/lib/gsap-init';
import { Magnetic } from './Magnetic';

if (typeof window !== 'undefined') initGSAP();

const TIERS = [
  {
    name: 'Starter', price: 0, unit: '/ month',
    pitch: 'For coaching centers up to 200 students.',
    feats: ['1 institution', '200 students', 'Dynamic QR', 'Email reports', 'Community support'],
    cta: 'Start free',
  },
  {
    name: 'Pro', price: 99, unit: '/ month',
    pitch: 'Most schools and small colleges.',
    feats: ['Up to 5000 students', 'Geofence + device binding', 'PDF / Excel reports', 'Fraud queue', 'Priority support'],
    cta: 'Choose Pro', highlight: true,
  },
  {
    name: 'Enterprise', price: null, unit: 'custom',
    pitch: 'Universities, multi-campus, SSO.',
    feats: ['Unlimited students', 'Custom geofence policies', 'SAML SSO + audit export', 'Webhooks', 'Dedicated SLA'],
    cta: 'Talk to sales',
  },
];

export function Pricing() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.tier', {
        opacity: 0, y: 50, rotateX: -8,
        stagger: 0.12, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: root.current, start: 'top 75%' },
      });
      // Price flip-in
      gsap.utils.toArray<HTMLElement>('.price').forEach((el) => {
        const v = Number(el.dataset.v);
        if (!Number.isFinite(v)) return;
        const o = { x: 0 };
        ScrollTrigger.create({
          trigger: el, start: 'top 85%',
          onEnter: () => gsap.to(o, {
            x: v, duration: 1.6, ease: 'expo.out',
            onUpdate: () => (el.textContent = '$' + Math.floor(o.x)),
          }),
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="pricing" ref={root} className="py-28 lg:py-40">
      <div className="container">
        <div className="mb-16 text-center">
          <span className="text-[11px] tracking-[0.3em] text-ink-mute uppercase">[ 06 — pricing ]</span>
          <h2 className="mt-4 font-display text-[2.5rem] lg:text-[4rem] leading-[1.02] tracking-tightish">
            Honest pricing. <em className="not-italic text-accent">No per-scan tax.</em>
          </h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          {TIERS.map((t) => (
            <div
              key={t.name}
              className={`tier rounded-2xl p-8 border transition-all ${
                t.highlight
                  ? 'bg-ink text-cream-50 border-ink shadow-[0_30px_80px_-20px_rgba(11,18,32,0.4)]'
                  : 'bg-cream-50 border-ink/10'
              }`}
            >
              <div className="flex items-baseline justify-between">
                <h3 className="font-display text-[1.6rem]">{t.name}</h3>
                {t.highlight && <span className="text-[10px] tracking-widest text-accent uppercase">Most picked</span>}
              </div>
              <p className={`mt-1 text-[13px] ${t.highlight ? 'text-cream-50/60' : 'text-ink-mute'}`}>
                {t.pitch}
              </p>
              <div className="mt-6 flex items-baseline gap-2">
                {t.price === null ? (
                  <span className="font-display text-[3rem] leading-none">Custom</span>
                ) : (
                  <>
                    <span className="price counter-num font-display text-[3.4rem] leading-none" data-v={t.price}>
                      $0
                    </span>
                    <span className={`text-[12px] ${t.highlight ? 'text-cream-50/60' : 'text-ink-mute'}`}>{t.unit}</span>
                  </>
                )}
              </div>
              <ul className="mt-6 space-y-2 text-[13.5px]">
                {t.feats.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className={t.highlight ? 'text-accent' : 'text-sage-600'}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Magnetic strength={0.2}>
                  <a
                    href="#demo"
                    className={`inline-flex w-full justify-center items-center rounded-full px-5 py-3 text-[13px] font-medium ${
                      t.highlight ? 'bg-accent text-cream-50' : 'bg-ink text-cream-50'
                    }`}
                  >
                    {t.cta}
                  </a>
                </Magnetic>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
