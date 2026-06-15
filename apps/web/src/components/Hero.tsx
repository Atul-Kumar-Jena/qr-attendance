'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Magnetic } from './Magnetic';
import { initGSAP } from '@/lib/gsap-init';
import { DemoModal } from '@/components/DemoModal';
import { useSiteConfig } from '@/context/SiteConfigContext';

if (typeof window !== 'undefined') {
  initGSAP();
}

const HEADLINE = ['Attendance,', 'unforgeable.'];
const SUB =
  'Dynamic signed QR, device binding, geofencing and app attestation — the proxy-attendance problem, solved at the protocol layer.';

export function Hero() {
  const root = useRef<HTMLDivElement>(null);
  const [demoOpen, setDemoOpen] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Soft blur-in entrance (no curtain wipe). All transform/opacity → 60fps.
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
      tl.fromTo('.hero-badge', { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8 }, 0.1)
        .fromTo('.hero-word',
          { y: 40, autoAlpha: 0, filter: 'blur(14px)' },
          { y: 0, autoAlpha: 1, filter: 'blur(0px)', duration: 1.1, stagger: 0.12 }, 0.15)
        .fromTo('.hero-sub', { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9 }, 0.5)
        .fromTo('.hero-cta', { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.08 }, 0.65)
        .fromTo('.hero-stat', { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.08 }, 0.85);
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <>
      <section
        ref={root}
        className="relative min-h-[100svh] flex items-center justify-center overflow-hidden pt-24 pb-28"
      >
        {/* Matte aurora backdrop */}
        <div className="hero-aurora" aria-hidden>
          <div className="aurora-base" />
          <div className="aurora-core" />
          <div className="aurora-read" />
          <div className="aurora-vignette" />
          <div className="matte-grain" />
        </div>

        <div className="container relative z-10 text-center flex flex-col items-center">
          {/* Badge */}
          <div className="hero-badge inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/5 backdrop-blur-md px-4 py-1.5 text-[11px] tracking-[0.18em] text-white/70 uppercase">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-accent animate-ping opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            Private beta · 40 institutions
          </div>

          {/* Statement headline — clean serif; colour comes from the glow */}
          <h1 className="mt-7 font-display font-light leading-[0.9] tracking-tightish text-white"
            style={{ fontSize: 'clamp(3rem, 11vw, 9.5rem)', textShadow: '0 2px 40px rgba(2,4,12,0.5)' }}>
            <span className="hero-word block">{HEADLINE[0]}</span>
            <span className="hero-word block text-white/95">{HEADLINE[1]}</span>
          </h1>

          {/* Subhead */}
          <p className="hero-sub mt-7 max-w-2xl text-[14.5px] md:text-[16px] leading-relaxed text-white/80">
            {SUB}
          </p>

          {/* CTAs */}
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3.5">
            <Magnetic strength={0.24}>
              <a
                href="#pricing"
                className="hero-cta btn-glass group inline-flex items-center gap-2.5 rounded-full bg-accent px-8 py-4 text-[14px] font-medium text-white shadow-[0_18px_50px_-12px_rgba(46,138,92,0.8)] transition-transform hover:scale-[1.04] active:scale-[0.97]"
              >
                Request a demo
                <svg width="14" height="14" viewBox="0 0 14 14" className="transition-transform group-hover:translate-x-1">
                  <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </Magnetic>
            <Magnetic strength={0.18}>
              <button
                onClick={() => setDemoOpen(true)}
                className="hero-cta inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 backdrop-blur-md px-8 py-4 text-[14px] tracking-wide text-white hover:bg-white/12 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path d="M4 2l10 6-10 6V2z" fill="currentColor" />
                </svg>
                Watch 90-sec demo
              </button>
            </Magnetic>
          </div>

          {/* Stats */}
          <div className="mt-14 flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
            <Stat label="Scan success" value={99.7} suffix="%" decimals={1} />
            <Divider />
            <Stat label="Spoofed scans blocked" value={132984} format />
            <Divider />
            <RotationStat />
          </div>
        </div>

        {/* Scroll cue */}
        <div className="pointer-events-none absolute bottom-24 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-white/40">
          scroll
          <span className="relative h-9 w-px overflow-hidden bg-white/15">
            <span className="absolute inset-x-0 top-0 h-3 bg-accent animate-[scrollCue_1.8s_ease-in-out_infinite]" />
          </span>
        </div>
      </section>
      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
    </>
  );
}

function RotationStat() {
  const { config } = useSiteConfig();
  const ttl = Math.min(5, Math.max(0.8, Number(config.defaultQrRotationSec) || 1.5));
  return <Stat label="QR rotation" value={ttl} suffix="s" decimals={ttl % 1 ? 1 : 0} />;
}

function Divider() {
  return <span className="hidden sm:block h-9 w-px bg-white/15" />;
}

function Stat({
  label, value, suffix, decimals = 0, format,
}: { label: string; value: number; suffix?: string; decimals?: number; format?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current!;
    const obj = { v: 0 };
    gsap.to(obj, {
      v: value, duration: 2.4, ease: 'expo.out', delay: 0.7,
      onUpdate: () => {
        el.textContent = format ? Math.floor(obj.v).toLocaleString() : obj.v.toFixed(decimals);
      },
    });
  }, [value, decimals, format]);

  return (
    <div className="hero-stat text-center">
      <div className="counter-num text-[2rem] md:text-[2.3rem] font-display text-white leading-none flex items-baseline justify-center gap-1">
        <span ref={ref}>0</span>
        {suffix && <span className="text-[1.3rem] iri-text">{suffix}</span>}
      </div>
      <div className="mt-2 text-[10px] tracking-[0.16em] uppercase text-white/55">{label}</div>
    </div>
  );
}
