'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initGSAP } from '@/lib/gsap-init';

if (typeof window !== 'undefined') initGSAP();

const FEATS = [
  { t: 'Multi-tenant SaaS', d: 'One platform, fully isolated workspaces per institution.', i: '◇' },
  { t: 'Dynamic signed QR', d: '7-second rotation, HMAC-signed, single-use nonce.', i: '◈' },
  { t: 'Geofencing', d: 'Server-side Haversine + accuracy thresholds.', i: '◎' },
  { t: 'Device binding', d: 'One device per student. Reset is admin-only.', i: '◐' },
  { t: 'App attestation', d: 'Play Integrity + DeviceCheck/App Attest.', i: '◉' },
  { t: 'Fraud detection', d: 'Weighted signals, suspicious queue, admin review.', i: '◌' },
  { t: 'PDF / Excel reports', d: 'Branded, async, signed download URLs.', i: '☱' },
  { t: 'Audit trail', d: 'Append-only logs for every sensitive action.', i: '⌬' },
];

/**
 * Pinned horizontal-scroll showcase — uncommon, fits the premium feel.
 * Falls back to a vertical grid on small screens.
 */
export function Features() {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(max-width: 900px)').matches) return;
    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray<HTMLElement>('.feat-card');
      const total = (sections.length - 1) * 360;
      gsap.to(track.current, {
        x: () => `-${total}px`,
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          pin: true,
          start: 'top top',
          end: () => `+=${total + 200}`,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
      sections.forEach((card, i) => {
        gsap.from(card, {
          opacity: 0.4, scale: 0.94, y: 30,
          duration: 0.9,
          ease: 'power2.out',
          delay: i * 0.04,
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="features" ref={root} className="py-28">
      <div className="container mb-16">
        <span className="text-[11px] tracking-[0.3em] text-ink-mute uppercase">[ 02 — features ]</span>
        <h2 className="mt-4 font-display text-[2.5rem] lg:text-[4rem] leading-[1.02] tracking-tightish max-w-3xl">
          Eight building blocks. <em className="not-italic text-accent">One verdict.</em>
        </h2>
      </div>

      <div className="hidden md:block overflow-hidden">
        <div ref={track} className="flex gap-6 pl-[10vw] will-change-transform">
          {FEATS.map((f, i) => (
            <article
              key={f.t}
              className="feat-card relative shrink-0 w-[340px] aspect-[3/4] rounded-3xl glass p-8 flex flex-col justify-between hover:bg-cream-100/70 transition-colors"
            >
              <div className="text-[2.2rem] text-accent">{f.i}</div>
              <div>
                <div className="font-mono text-[10.5px] text-ink-mute tracking-wider">
                  {String(i + 1).padStart(2, '0')} / {FEATS.length}
                </div>
                <h3 className="mt-2 font-display text-[1.85rem] leading-tight">{f.t}</h3>
                <p className="mt-2 text-[13px] text-ink-mute">{f.d}</p>
              </div>
              <div className="absolute inset-x-8 bottom-7 h-px bg-ink/10" />
            </article>
          ))}
        </div>
      </div>

      {/* Mobile grid fallback */}
      <div className="container grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
        {FEATS.map((f) => (
          <div key={f.t} className="rounded-2xl glass p-6">
            <div className="text-[1.6rem] text-accent">{f.i}</div>
            <h3 className="mt-3 font-display text-[1.4rem]">{f.t}</h3>
            <p className="mt-1.5 text-[13px] text-ink-mute">{f.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
