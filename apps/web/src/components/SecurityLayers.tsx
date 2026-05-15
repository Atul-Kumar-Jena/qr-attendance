'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

const LAYERS = [
  { k: 'Signature', d: 'HMAC-SHA256 over header.payload.' },
  { k: 'Expiry', d: 'Server time. ≤10s window, no exceptions.' },
  { k: 'Nonce', d: 'Single-use, atomically consumed in Redis.' },
  { k: 'Session', d: 'Must be OPEN; status checked on every scan.' },
  { k: 'Device', d: 'Fingerprint + generation match the bound device.' },
  { k: 'Attestation', d: 'Play Integrity / App Attest verified upstream.' },
  { k: 'Geofence', d: 'Haversine ≤ radius; mock-location flag = reject.' },
  { k: 'Duplicate', d: 'DB-level (sessionId, studentId) uniqueness.' },
];

/**
 * Pin + scrub: SVG circle "rings" expand layer-by-layer, the right column
 * scroll-locks to each layer. Plus a draw-on connector path.
 */
export function SecurityLayers() {
  const root = useRef<HTMLDivElement>(null);
  const rings = useRef<SVGGElement>(null);
  const path = useRef<SVGPathElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Draw the connector path
      const p = path.current!;
      const len = p.getTotalLength();
      gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
      gsap.to(p, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top 70%', end: 'bottom 30%', scrub: 1 },
      });

      // Stagger expand rings
      gsap.from(rings.current!.querySelectorAll('circle'), {
        scale: 0,
        opacity: 0,
        transformOrigin: '50% 50%',
        duration: 1,
        ease: 'expo.out',
        stagger: 0.08,
        scrollTrigger: { trigger: root.current, start: 'top 65%' },
      });

      // Layer cards: stagger in with rotation
      gsap.from('.sec-row', {
        opacity: 0,
        y: 40,
        rotateX: -10,
        skewY: 1.5,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: { trigger: '.sec-list', start: 'top 80%' },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="security" ref={root} className="py-28 lg:py-40 bg-gradient-to-b from-cream-100 to-cream-50 relative">
      <div className="container">
        <div className="mb-16">
          <span className="text-[11px] tracking-[0.3em] text-ink-mute uppercase">[ 03 — security ]</span>
          <h2 className="mt-4 font-display text-[2.5rem] lg:text-[4rem] leading-[1.02] tracking-tightish max-w-3xl">
            Eight checks, in order. <em className="not-italic text-accent">A scan only passes all eight.</em>
          </h2>
        </div>

        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-16 items-start">
          <div className="sticky top-32 hidden lg:block">
            <svg viewBox="0 0 400 400" className="w-full max-w-[420px]">
              <g ref={rings} fill="none" stroke="currentColor" className="text-ink">
                {[200, 170, 140, 110, 85, 65, 45, 25].map((r, i) => (
                  <circle
                    key={r}
                    cx="200" cy="200" r={r}
                    strokeOpacity={0.08 + i * 0.06}
                    strokeWidth={i === 0 ? 1.6 : 0.7}
                  />
                ))}
              </g>
              <path
                ref={path}
                d="M 20 380 Q 100 250, 200 240 T 380 60"
                stroke="#FF6B3D" strokeWidth="1.5" fill="none" strokeLinecap="round"
              />
              <circle cx="200" cy="200" r="14" fill="#FF6B3D" />
              <circle cx="200" cy="200" r="14" fill="none" stroke="#FF6B3D"
                      className="animate-[pulseRing_2s_ease-out_infinite]" />
            </svg>
          </div>

          <ol className="sec-list space-y-px bg-ink/10 rounded-2xl overflow-hidden">
            {LAYERS.map((l, i) => (
              <li key={l.k} className="sec-row bg-cream-50 p-6 flex items-baseline gap-6 hover:bg-cream-100 transition-colors">
                <span className="font-mono text-[11px] text-ink-mute w-8">{String(i + 1).padStart(2, '0')}</span>
                <div className="flex-1">
                  <h3 className="font-display text-[1.45rem]">{l.k}</h3>
                  <p className="mt-1 text-[13px] text-ink-mute">{l.d}</p>
                </div>
                <span className="text-sage-500 text-xl">✓</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
