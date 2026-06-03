'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initGSAP } from '@/lib/gsap-init';

if (typeof window !== 'undefined') initGSAP();

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
    if (typeof window === 'undefined' || !root.current) return;
    // Reduced motion: everything is visible by default in the markup, so we
    // simply don't run the hide-then-reveal choreography.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // The connector SVG (rings/path/radial lines) is `hidden lg:block` — only
    // wire its scrubbed draws on desktop, and as ONE scrubbed timeline instead
    // of 8+ separate ScrollTriggers.
    const desktop = window.matchMedia('(min-width: 1024px)').matches;
    let ctx: ReturnType<typeof gsap.context> | undefined;
    try {
      ctx = gsap.context(() => {
        if (desktop && path.current && rings.current) {
          const p = path.current;
          const len = p.getTotalLength();
          gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });

          const lines = gsap.utils.toArray<SVGLineElement>('.sec-radial');
          gsap.set(lines, { strokeDasharray: 200, strokeDashoffset: 200 });

          // Single scrubbed timeline draws the path + all radial lines (staggered).
          const tl = gsap.timeline({
            scrollTrigger: { trigger: root.current, start: 'top 72%', end: 'bottom 38%', scrub: 1 },
          });
          tl.to(p, { strokeDashoffset: 0, ease: 'none' }, 0)
            .to(lines, { strokeDashoffset: 0, ease: 'none', stagger: { each: 0.5, ease: 'none' } }, 0);

          // Rings expand once (cheap one-shot; immediateRender:false = never stranded).
          gsap.from(rings.current.querySelectorAll('circle'), {
            scale: 0, opacity: 0,
            transformOrigin: '50% 50%',
            duration: 1, ease: 'expo.out', stagger: 0.08,
            immediateRender: false,
            scrollTrigger: { trigger: root.current, start: 'top 65%' },
          });
        }

        // Layer cards reveal — one-shot, all breakpoints.
        gsap.from('.sec-row', {
          opacity: 0, y: 30,
          duration: 0.7, ease: 'power3.out', stagger: 0.06,
          immediateRender: false,
          scrollTrigger: { trigger: '.sec-list', start: 'top 90%' },
        });
      }, root);
    } catch { /* GSAP failure must not crash the page */ }
    return () => { try { ctx?.revert(); } catch {} };
  }, []);

  return (
    <section id="security" ref={root} className="py-28 lg:py-40 relative" style={{ background: 'var(--bg-2)' }}>
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

              {/* 8 radial lines — each draws on scroll, one per security layer */}
              {LAYERS.map((_, i) => {
                const angle = (i * 45 - 90) * (Math.PI / 180);
                const r1 = 25;
                const r2 = 198;
                const x1 = 200 + Math.cos(angle) * r1;
                const y1 = 200 + Math.sin(angle) * r1;
                const x2 = 200 + Math.cos(angle) * r2;
                const y2 = 200 + Math.sin(angle) * r2;
                return (
                  <line
                    key={i}
                    className="sec-radial"
                    x1={x1} y1={y1} x2={x2} y2={y2}
                    stroke="var(--accent)"
                    strokeWidth="0.8"
                    strokeOpacity="0.45"
                    strokeLinecap="round"
                  />
                );
              })}

              <path
                ref={path}
                d="M 20 380 Q 100 250, 200 240 T 380 60"
                stroke="var(--accent)" strokeWidth="1.5" fill="none" strokeLinecap="round"
              />
              <circle cx="200" cy="200" r="14" fill="var(--accent)" />
              <circle cx="200" cy="200" r="14" fill="none" stroke="var(--accent)"
                      className="animate-[pulseRing_2s_ease-out_infinite]" />
            </svg>
          </div>

          <ol className="sec-list space-y-px bg-ink/10 rounded-2xl overflow-hidden">
            {LAYERS.map((l, i) => (
              <li key={l.k} className="sec-row group relative bg-cream-50 p-6 pl-7 flex items-baseline gap-6 hover:bg-cream-100 transition-colors">
                <span aria-hidden className="absolute left-0 top-0 h-full w-0.5 bg-accent origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-300" />
                <span className="font-mono text-[11px] w-8 text-ink-mute group-hover:text-accent transition-colors">{String(i + 1).padStart(2, '0')}</span>
                <div className="flex-1">
                  <h3 className="font-display text-[1.45rem]">{l.k}</h3>
                  <p className="mt-1 text-[13px] text-ink-mute">{l.d}</p>
                </div>
                <span className="text-sage-500 text-xl transition-transform duration-300 group-hover:scale-125">✓</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
