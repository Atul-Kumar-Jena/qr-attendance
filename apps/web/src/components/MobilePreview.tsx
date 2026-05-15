'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

/**
 * Side-by-side phone mockups with a parallax difference + a sweeping
 * scanner line that scrubs with scroll.
 */
export function MobilePreview() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Phones parallax at different speeds
      gsap.to('.phone-a', {
        y: -80, ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: 1 },
      });
      gsap.to('.phone-b', {
        y: 40, ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: 1 },
      });

      // Scanner sweep
      gsap.fromTo('.scan-line',
        { top: '0%' },
        {
          top: '100%', repeat: -1, duration: 2, ease: 'sine.inOut', yoyo: true,
        });

      // Card-stack reveal (history items slide up + stagger)
      gsap.from('.hist-row', {
        y: 30, opacity: 0,
        stagger: 0.08, ease: 'power3.out', duration: 0.9,
        scrollTrigger: { trigger: '.phone-b', start: 'top 80%' },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="py-28 lg:py-40 bg-ink text-cream-50 relative overflow-hidden">
      <div className="container">
        <div className="mb-16 max-w-3xl">
          <span className="text-[11px] tracking-[0.3em] text-cream-50/50 uppercase">[ 05 — mobile ]</span>
          <h2 className="mt-4 font-display text-[2.5rem] lg:text-[4rem] leading-[1.02] tracking-tightish">
            For students, it's just <em className="not-italic text-accent">tap, scan, done.</em>
          </h2>
          <p className="mt-5 text-[14px] text-cream-50/60 max-w-md">
            Bound to one device. Sees its own attendance history, percentages
            and warnings — nothing more.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Phone A — Scanner */}
          <div className="flex justify-center md:justify-end">
            <div className="phone-a relative">
              <PhoneShell>
                <div className="relative h-full w-full bg-gradient-to-b from-[#0F1A2D] to-[#0B1220] text-cream-50 p-5 flex flex-col">
                  <div className="text-[10px] text-cream-50/50 tracking-wider">CS-301 · Operating Systems</div>
                  <div className="font-display text-[1.4rem] mt-1">Scan QR</div>
                  <div className="mt-4 relative aspect-square rounded-2xl border border-cream-50/15 overflow-hidden">
                    <div className="scan-line absolute left-0 right-0 h-[2px] bg-accent shadow-[0_0_18px_2px_rgba(255,107,61,0.7)]" />
                    {/* corner marks */}
                    {['top-2 left-2','top-2 right-2','bottom-2 left-2','bottom-2 right-2'].map((p) => (
                      <span key={p} className={`absolute ${p} h-5 w-5 border-2 border-cream-50/70`} style={{
                        borderTop: p.includes('top') ? undefined : 'none',
                        borderBottom: p.includes('bottom') ? undefined : 'none',
                        borderLeft: p.includes('left') ? undefined : 'none',
                        borderRight: p.includes('right') ? undefined : 'none',
                      }} />
                    ))}
                  </div>
                  <div className="mt-4 text-[12px] text-cream-50/60">
                    Hold steady — token rotates every 7s.
                  </div>
                  <div className="mt-auto flex items-center gap-2 text-[11px] text-cream-50/50">
                    <span className="h-1.5 w-1.5 rounded-full bg-sage-500" />
                    Device bound · GPS OK · attestation OK
                  </div>
                </div>
              </PhoneShell>
            </div>
          </div>

          {/* Phone B — History */}
          <div className="flex justify-center md:justify-start">
            <div className="phone-b relative">
              <PhoneShell>
                <div className="h-full w-full bg-cream-50 text-ink p-5 flex flex-col">
                  <div className="text-[10px] text-ink-mute tracking-wider">YOUR ATTENDANCE</div>
                  <div className="font-display text-[2.4rem] leading-none mt-1">
                    86<span className="text-accent">%</span>
                  </div>
                  <div className="mt-1 text-[12px] text-ink-mute">across 4 subjects · last 30 days</div>

                  <div className="mt-5 space-y-2">
                    {[
                      { s: 'Operating Systems', p: 92, c: 'sage' },
                      { s: 'Networks',           p: 84, c: 'sage' },
                      { s: 'DBMS',               p: 78, c: 'sage' },
                      { s: 'Compilers',          p: 64, c: 'accent' },
                    ].map((row) => (
                      <div key={row.s} className="hist-row">
                        <div className="flex justify-between text-[12px]">
                          <span>{row.s}</span><span className="font-mono">{row.p}%</span>
                        </div>
                        <div className="mt-1 h-1 rounded-full bg-ink/8 overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${row.p}%`, background: row.c === 'accent' ? '#FF6B3D' : '#7C967A' }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="hist-row mt-5 rounded-xl bg-accent/10 border border-accent/30 p-3 text-[12px] text-ink">
                    Compilers is below 75%. <span className="underline">2 more classes</span> to recover.
                  </div>
                </div>
              </PhoneShell>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PhoneShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative h-[600px] w-[300px] rounded-[44px] bg-ink-soft p-2 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.6)]">
      <div className="absolute left-1/2 top-2 -translate-x-1/2 h-6 w-32 rounded-full bg-ink z-10" />
      <div className="relative h-full w-full rounded-[36px] overflow-hidden">{children}</div>
    </div>
  );
}
