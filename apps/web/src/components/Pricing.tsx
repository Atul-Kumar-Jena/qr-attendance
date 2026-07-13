'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initGSAP } from '@/lib/gsap-init';
import { Magnetic } from './Magnetic';
import { TiltCard } from './TiltCard';
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
    // Reduced motion: prices/cards are already in the markup — skip the
    // count-up + card choreography so nothing is hidden.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
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
          <span data-reveal className="inline-block text-[10px] tracking-[0.28em] text-ink-mute uppercase mb-4 px-3 py-1 rounded-full border border-ink/10 dark:border-white/10">
            06 — Pricing
          </span>
          <h2 data-reveal className="font-display text-[2.4rem] lg:text-[4rem] leading-[1.02] tracking-tightish">
            Honest pricing. <em className="not-italic text-accent">No per-scan tax.</em>
          </h2>
          {isLimitedOffer && (
            <div className="mt-4 inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-1.5">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-[12px] text-accent font-medium">{config.limitedOfferLabel}</span>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-5 lg:items-start">
          {(config.pricingTiers && config.pricingTiers.length > 0 ? config.pricingTiers : BASE_TIERS).map((t) => {
            const displayPrice = (isLimitedOffer && t.price !== null && t.price > 0)
              ? Math.round(t.price * discountMultiplier)
              : t.price;

            return (
              <TiltCard key={t.name} max={5} className="h-full">
              <div
                className={`tier h-full rounded-[28px] p-8 border flex flex-col transition-all duration-300 ${
                  t.highlight
                    ? 'text-cream-50 border-white/12 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.55),0_1px_0_rgba(255,255,255,0.07)_inset] lg:-translate-y-4'
                    : 'glass border-ink/10 dark:border-white/10'
                }`}
                style={t.highlight ? { background: 'linear-gradient(160deg, #18181b, #0a0a0b)' } : undefined}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-display text-[1.5rem] tracking-tight">{t.name}</h3>
                  {t.highlight && (
                    <span className="text-[10px] tracking-[0.15em] uppercase font-mono px-2.5 py-1 rounded-full bg-white/12 text-white/70 border border-white/14">
                      Most picked
                    </span>
                  )}
                </div>
                <p className={`text-[13px] leading-relaxed ${t.highlight ? 'text-white/55' : 'text-ink-mute'}`}>
                  {t.pitch}
                </p>

                {/* Price */}
                <div className="mt-8 mb-8">
                  {t.price === null ? (
                    <span className="font-display text-[3.2rem] leading-none tracking-tight">Custom</span>
                  ) : (
                    <div className="flex flex-col gap-0.5">
                      {isLimitedOffer && t.price > 0 && (
                        <span className={`text-[13px] line-through ${t.highlight ? 'text-white/35' : 'text-ink-mute/60'}`}>
                          ${t.price}/mo
                        </span>
                      )}
                      <div className="flex items-end gap-2">
                        <span
                          className="price-counter font-display text-[3.6rem] leading-none tracking-tighter"
                          data-v={displayPrice ?? 0}
                        >
                          ${displayPrice ?? 0}
                        </span>
                        <span className={`text-[12px] mb-2 ${t.highlight ? 'text-white/50' : 'text-ink-mute'}`}>
                          {t.unit}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div className={`h-px mb-6 ${t.highlight ? 'bg-white/10' : 'bg-ink/8 dark:bg-white/8'}`} />

                {/* Features */}
                <ul className="space-y-3 text-[13.5px] flex-1">
                  {t.feats.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                        stroke={t.highlight ? 'rgba(255,255,255,0.8)' : 'var(--accent)'}
                        strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                        className="mt-0.5 flex-shrink-0"
                      >
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      <span className={t.highlight ? 'text-white/80' : 'text-ink-soft dark:text-white/80'}>{f}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <div className="mt-8">
                  <Magnetic strength={0.2}>
                    <a
                      href="#demo"
                      className={`inline-flex w-full justify-center items-center rounded-full px-5 py-3.5 text-[13.5px] font-semibold transition-all duration-200 ${
                        t.highlight
                          ? 'bg-white text-black hover:bg-white/90 shadow-[0_4px_16px_-4px_rgba(255,255,255,0.3)]'
                          : 'bg-ink text-cream-50 dark:bg-white dark:text-black hover:opacity-90 shadow-[0_4px_16px_-4px_rgba(0,0,0,0.25)]'
                      }`}
                    >
                      {isLimitedOffer && t.price !== null && t.price > 0
                        ? `${t.cta} — limited offer`
                        : t.cta}
                    </a>
                  </Magnetic>
                </div>
              </div>
              </TiltCard>
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
