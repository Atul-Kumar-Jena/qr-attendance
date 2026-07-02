'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initGSAP } from '@/lib/gsap-init';
import { Magnetic } from './Magnetic';
import { useSiteConfig } from '@/context/SiteConfigContext';

if (typeof window !== 'undefined') initGSAP();

const BASE_TIERS = [
  {
    name: 'Starter', fullPrice: 0, unit: '/ month',
    pitch: 'For coaching centers up to 200 students.',
    feats: ['1 institution', '200 students', 'Dynamic QR', 'Email reports', 'Community support'],
    cta: 'Start free',
  },
  {
    name: 'Pro', fullPrice: 99, unit: '/ month',
    pitch: 'Most schools and small colleges.',
    feats: ['Up to 5000 students', 'Geofence + device binding', 'PDF / Excel reports', 'Fraud queue', 'Priority support'],
    cta: 'Choose Pro', highlight: true,
  },
  {
    name: 'Enterprise', fullPrice: null, unit: 'custom',
    pitch: 'Universities, multi-campus, SSO.',
    feats: ['Unlimited students', 'Custom geofence policies', 'SAML SSO + audit export', 'Webhooks', 'Dedicated SLA'],
    cta: 'Talk to sales',
  },
];

export function Pricing() {
  const root = useRef<HTMLDivElement>(null);
  const { config } = useSiteConfig();
  const isLimitedOffer = config.pricingMode === 'LIMITED_OFFER';
  const isFree = config.pricingMode === 'FREE';
  const isPaid = config.pricingMode === 'PAID';
  const discountMultiplier = 1 - config.limitedOfferDiscountPct / 100;

  const paymentHref = config.paymentUrl || '#demo';  // placeholder until payment API is configured

  useEffect(() => {
    const ctx = gsap.context(() => {
      // fromTo + immediateRender:false + once — cards stay visible by default and
      // only animate when the trigger actually fires. The previous gsap.from()
      // pattern could leave all three tiers stuck at opacity 0 (invisible pricing).
      gsap.fromTo('.tier',
        { opacity: 0, y: 50, rotateX: -8 },
        {
          opacity: 1, y: 0, rotateX: 0,
          stagger: 0.12, duration: 1, ease: 'power3.out',
          immediateRender: false,
          scrollTrigger: { trigger: root.current, start: 'top 85%', once: true },
        });
      gsap.utils.toArray<HTMLElement>('.price-counter').forEach((el) => {
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
  }, [isLimitedOffer]);

  return (
    <section id="pricing" ref={root} className="py-28 lg:py-40">
      <div className="container">
        <div className="mb-16 text-center">
          <span className="text-[11px] tracking-[0.3em] text-ink-mute uppercase">[ 06 — pricing ]</span>
          <h2 className="mt-4 font-display text-[2.5rem] lg:text-[4rem] leading-[1.02] tracking-tightish">
            Honest pricing. <em className="not-italic text-accent">No per-scan tax.</em>
          </h2>
          {isLimitedOffer && (
            <div className="mt-4 inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-1.5">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-[12px] text-accent font-medium">{config.limitedOfferLabel}</span>
            </div>
          )}
          {isFree && (
            <div className="mt-4 inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[12px] text-green-600 dark:text-green-400 font-medium">All plans free — no credit card needed</span>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          {BASE_TIERS.map((t) => {
            let displayPrice: number | null = t.fullPrice;
            if (isFree) displayPrice = 0;
            else if (isPaid && config.customPrice !== null && t.fullPrice !== null && t.fullPrice > 0)
              displayPrice = config.customPrice;
            else if (isLimitedOffer && t.fullPrice !== null && t.fullPrice > 0)
              displayPrice = Math.round(t.fullPrice * discountMultiplier);

            return (
              <div
                key={t.name}
                className={`tier rounded-2xl p-8 border transition-all ${
                  t.highlight
                    ? 'bg-ink dark:bg-[#1A2236] text-cream-50 border-ink dark:border-white/10 shadow-[0_30px_80px_-20px_rgba(11,18,32,0.4)]'
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
                  {t.fullPrice === null ? (
                    <span className="font-display text-[3rem] leading-none">Custom</span>
                  ) : isFree ? (
                    <div className="flex items-baseline gap-2">
                      <span className="font-display text-[3.4rem] leading-none text-green-500">Free</span>
                      <span className={`text-[12px] ${t.highlight ? 'text-cream-50/60' : 'text-ink-mute'}`}>forever</span>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-0.5">
                      {(isLimitedOffer || (isPaid && config.customPrice !== null)) && t.fullPrice > 0 && (
                        <span className={`text-[13px] line-through ${t.highlight ? 'text-cream-50/40' : 'text-ink/30'}`}>
                          ${t.fullPrice}/mo
                        </span>
                      )}
                      <div className="flex items-baseline gap-2">
                        <span
                          className="price-counter font-display text-[3.4rem] leading-none"
                          data-v={displayPrice ?? 0}
                        >
                          ${displayPrice ?? 0}
                        </span>
                        <span className={`text-[12px] ${t.highlight ? 'text-cream-50/60' : 'text-ink-mute'}`}>
                          {isPaid && config.customPrice !== null && t.fullPrice !== null && t.fullPrice > 0
                            ? config.customPriceLabel
                            : t.unit}
                        </span>
                      </div>
                    </div>
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
                      href={
                        isFree || t.fullPrice === 0 || t.fullPrice === null
                          ? '#demo'
                          : paymentHref
                      }
                      className={`inline-flex w-full justify-center items-center gap-1.5 rounded-full px-5 py-3 text-[13px] font-medium ${
                        t.highlight ? 'bg-accent text-cream-50' : 'bg-ink dark:bg-[#1A2236] dark:border dark:border-white/10 text-cream-50'
                      }`}
                    >
                      {isFree
                        ? t.fullPrice === 0 ? 'Start for free' : 'Get started free'
                        : isPaid && t.fullPrice !== null && t.fullPrice > 0
                          ? config.paymentUrl
                            ? `${t.cta} →`
                            : `${t.cta} — coming soon`
                          : isLimitedOffer && t.fullPrice !== null && t.fullPrice > 0
                            ? `${t.cta} — limited offer`
                            : t.cta}
                    </a>
                  </Magnetic>
                  {isPaid && t.fullPrice !== null && t.fullPrice > 0 && !config.paymentUrl && (
                    <p className={`mt-2 text-center text-[10.5px] ${t.highlight ? 'text-cream-50/40' : 'text-ink/30'}`}>
                      Payment setup in progress
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {isPaid && !config.paymentUrl && (
          <div className="mt-8 text-center">
            <p className="text-[12px] text-ink-mute">Payment gateway coming soon. <a href="#demo" className="text-accent hover:underline">Request early access</a> in the meantime.</p>
          </div>
        )}
        {isPaid && config.paymentUrl && (
          <p className="mt-8 text-center text-[12px] text-ink-mute">
            Secure payment powered by our payment partner. All plans billed monthly.
          </p>
        )}
      </div>
    </section>
  );
}
