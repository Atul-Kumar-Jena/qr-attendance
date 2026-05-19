'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initGSAP } from '@/lib/gsap-init';
import { Magnetic } from './Magnetic';
import { useSiteConfig, type PricingTier } from '@/context/SiteConfigContext';

if (typeof window !== 'undefined') initGSAP();

const BASE_TIERS: PricingTier[] = [
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
  const { config } = useSiteConfig();
  const isLimitedOffer = config.pricingMode === 'LIMITED_OFFER';
  const discountMultiplier = 1 - config.limitedOfferDiscountPct / 100;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let ctx: ReturnType<typeof gsap.context> | undefined;
    try {
      ctx = gsap.context(() => {
        // Cards default visible in CSS. GSAP applies the "from" state only
        // when the trigger fires (immediateRender: false) so a missed
        // ScrollTrigger never strands them at opacity 0.
        gsap.from('.tier', {
          opacity: 0, y: 40, rotateX: -8,
          stagger: 0.12, duration: 1, ease: 'power3.out',
          immediateRender: false,
          scrollTrigger: { trigger: root.current, start: 'top 95%' },
        });
        gsap.utils.toArray<HTMLElement>('.price-counter').forEach((el) => {
          const v = Number(el.dataset.v);
          if (!Number.isFinite(v)) return;
          const o = { x: 0 };
          ScrollTrigger.create({
            trigger: el, start: 'top 95%',
            onEnter: () => gsap.to(o, {
              x: v, duration: 1.6, ease: 'expo.out',
              onUpdate: () => (el.textContent = '$' + Math.floor(o.x)),
            }),
          });
        });
      }, root);
    } catch { /* GSAP failure must not crash the page */ }
    return () => { try { ctx?.revert(); } catch {} };
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
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          {/* Devs can override tiers globally via SiteConfig → pricingTiers.
              If they leave it empty the built-in BASE_TIERS render — so the
              section is never blank. */}
          {(config.pricingTiers && config.pricingTiers.length > 0 ? config.pricingTiers : BASE_TIERS).map((t) => {
            const displayPrice = (isLimitedOffer && t.price !== null && t.price > 0)
              ? Math.round(t.price * discountMultiplier)
              : t.price;

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
                  {t.price === null ? (
                    <span className="font-display text-[3rem] leading-none">Custom</span>
                  ) : (
                    <div className="flex flex-col gap-0.5">
                      {isLimitedOffer && t.price > 0 && (
                        <span className={`text-[13px] line-through ${t.highlight ? 'text-cream-50/40' : 'text-ink/30'}`}>
                          ${t.price}/mo
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
                          {t.unit}
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
                      href="#demo"
                      className={`inline-flex w-full justify-center items-center rounded-full px-5 py-3 text-[13px] font-medium ${
                        t.highlight ? 'bg-accent text-cream-50' : 'bg-ink dark:bg-[#1A2236] dark:border dark:border-white/10 text-cream-50'
                      }`}
                    >
                      {isLimitedOffer && t.price !== null && t.price > 0
                        ? `${t.cta} — limited offer`
                        : t.cta}
                    </a>
                  </Magnetic>
                </div>
              </div>
            );
          })}
        </div>

        {!isLimitedOffer && (
          <p className="mt-8 text-center text-[12px] text-ink-mute">
            Early-access pricing has ended. All plans billed at full rate.
          </p>
        )}
      </div>
    </section>
  );
}
