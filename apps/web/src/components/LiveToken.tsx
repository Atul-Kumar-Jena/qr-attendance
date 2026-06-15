'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { initGSAP } from '@/lib/gsap-init';
import { LiveQrShowcase } from '@/components/LiveQrShowcase';
import { DemoModal } from '@/components/DemoModal';
import { Magnetic } from '@/components/Magnetic';
import { useSiteConfig } from '@/context/SiteConfigContext';

if (typeof window !== 'undefined') initGSAP();

/**
 * The signature live, rotating, signed QR — given its own stage right after the
 * hero. It's the clearest proof the product is real, so it leads the page.
 */
export function LiveToken() {
  const root = useRef<HTMLDivElement>(null);
  const [demoOpen, setDemoOpen] = useState(false);
  const { config } = useSiteConfig();
  const ttl = Math.min(5, Math.max(0.8, Number(config.defaultQrRotationSec) || 1.5));

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.lt-reveal', {
        y: 28, autoAlpha: 0, duration: 0.9, ease: 'power3.out', stagger: 0.09,
        scrollTrigger: { trigger: root.current, start: 'top 78%' },
      });
      gsap.from('.lt-stage', {
        y: 40, autoAlpha: 0, scale: 0.94, duration: 1.1, ease: 'expo.out',
        scrollTrigger: { trigger: root.current, start: 'top 75%' },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const bullets = [
    ['ECDSA-P256', 'Asymmetric signature on every token — verifiable, unforgeable.'],
    ['Single-use nonce', 'Consumed atomically. A replayed screenshot is already dead.'],
    [`Rotates every ${ttl}s`, 'The window to cheat closes before it opens.'],
  ];

  return (
    <section id="live" ref={root} className="relative py-24 md:py-32 overflow-hidden">
      <div className="container grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
        {/* Copy */}
        <div>
          <span className="lt-reveal inline-block text-[11px] tracking-[0.3em] text-ink-mute uppercase">[ 01 — the token ]</span>
          <h2 className="lt-reveal mt-4 font-display text-[2.5rem] lg:text-[4.2rem] leading-[1.02] tracking-tightish">
            The token <em className="not-italic iri-text">is the product.</em>
          </h2>
          <p className="lt-reveal mt-5 max-w-md text-[14px] leading-relaxed text-ink-mute">
            This is live. A real keypair signs a fresh claim set on the client every
            cycle — the same primitive that runs in production. Watch it breathe.
          </p>

          <ul className="lt-reveal mt-8 space-y-4 max-w-md">
            {bullets.map(([k, d]) => (
              <li key={k} className="flex gap-3.5">
                <span className="mt-1 h-4 w-4 flex-none rounded-full bg-accent/15 border border-accent/40 grid place-items-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                </span>
                <div>
                  <div className="text-[14px] font-medium text-ink">{k}</div>
                  <div className="text-[12.5px] text-ink-mute leading-snug">{d}</div>
                </div>
              </li>
            ))}
          </ul>

          <div className="lt-reveal mt-9 flex flex-wrap items-center gap-3.5">
            <Magnetic strength={0.2}>
              <button
                onClick={() => setDemoOpen(true)}
                className="btn-glass inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-[13px] font-medium text-white shadow-[0_14px_40px_-12px_rgba(46,138,92,0.7)] hover:scale-[1.03] active:scale-[0.97] transition-transform"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path d="M4 2l10 6-10 6V2z" fill="currentColor" />
                </svg>
                Watch it work
              </button>
            </Magnetic>
            <a href="#security" className="inline-flex items-center gap-1.5 rounded-full glass px-7 py-3.5 text-[13px] text-ink hover:bg-white/10 transition-colors">
              Inspect the 8 checks
            </a>
          </div>
        </div>

        {/* Stage */}
        <div className="lt-stage flex justify-center">
          <div className="iri-border rounded-[30px] glass p-7 md:p-9 shadow-[0_40px_120px_-40px_rgba(46,138,92,0.45)]">
            <LiveQrShowcase size={290} rounded showMeta />
          </div>
        </div>
      </div>

      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
    </section>
  );
}
