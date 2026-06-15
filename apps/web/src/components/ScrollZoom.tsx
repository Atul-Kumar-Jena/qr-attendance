'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initGSAP } from '@/lib/gsap-init';
import { asset } from '@/lib/asset';

if (typeof window !== 'undefined') initGSAP();

const POOL = ['02.svg', '04.svg', '06.svg', '01.svg'];

/**
 * A framed image that zooms to fill the viewport as you scroll past — the
 * "fullscreen by zooming in" moment. Pinned + scrubbed on desktop, a lighter
 * scale-in on mobile so a fast flick never hangs.
 */
export function ScrollZoom() {
  const root = useRef<HTMLDivElement>(null);
  const media = useRef<HTMLDivElement>(null);
  const intro = useRef<HTMLDivElement>(null);
  const outro = useRef<HTMLDivElement>(null);
  const [pic, setPic] = useState(POOL[0]);

  // Pick a "random picture" on the client (kept stable for SSR hydration).
  useEffect(() => { setPic(POOL[Math.floor(Math.random() * POOL.length)]); }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mobile = window.matchMedia('(max-width: 900px)').matches;

    const ctx = gsap.context(() => {
      if (mobile) {
        // Light reveal — no long pin.
        gsap.fromTo(media.current,
          { scale: 0.9, borderRadius: 28, autoAlpha: 0.7 },
          {
            scale: 1, borderRadius: 18, autoAlpha: 1, ease: 'none',
            scrollTrigger: { trigger: root.current, start: 'top 80%', end: 'top 20%', scrub: 0.5 },
          });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: '+=140%',
          scrub: 0.6,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
      tl.fromTo(media.current,
        { scale: 0.62, borderRadius: 28 },
        { scale: 1.82, borderRadius: 0, ease: 'power1.in' }, 0)
        .to(intro.current, { autoAlpha: 0, y: -40, ease: 'power1.in' }, 0)
        .fromTo(outro.current,
          { autoAlpha: 0, y: 30 },
          { autoAlpha: 1, y: 0, ease: 'power2.out' }, 0.55);
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="immersive" className="relative overflow-hidden" aria-label="Immersive">
      <div className="h-[80vh] md:h-screen w-full flex items-center justify-center relative">
        {/* The zooming media */}
        <div
          ref={media}
          className="zoom-media relative w-[82vw] h-[52vh] md:w-[58vw] md:h-[62vh] overflow-hidden border border-white/10"
          style={{ borderRadius: 28 }}
        >
          <img src={asset(`/showcase/${pic}`)} alt="" draggable={false}
            className="absolute inset-0 h-full w-full object-cover select-none" />
          <div className="absolute inset-0" style={{
            background: 'radial-gradient(120% 120% at 50% 30%, transparent 40%, rgba(4,5,12,0.55) 100%)',
          }} />
        </div>

        {/* Intro caption — fades as the image takes over */}
        <div ref={intro} className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pointer-events-none">
          <span className="text-[10.5px] tracking-[0.3em] text-ink-mute uppercase">[ keep scrolling ]</span>
          <h2 className="mt-3 font-display text-[2.4rem] md:text-[5rem] leading-[0.98] tracking-tightish">
            Step <span className="iri-text">inside</span> the system.
          </h2>
        </div>

        {/* Outro caption — appears once fullscreen */}
        <div ref={outro} className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <h2 className="font-display text-[2.2rem] md:text-[4.2rem] leading-[0.98] tracking-tightish text-white drop-shadow-[0_8px_30px_rgba(0,0,0,0.6)]">
            Attendance, end&nbsp;to&nbsp;end.
          </h2>
          <p className="mt-4 max-w-md text-[13.5px] text-white/75">
            From the signed token in a student&apos;s hand to the audit line on your desk.
          </p>
          <a href="#pricing"
            className="btn-glass mt-7 inline-flex items-center gap-2 rounded-full bg-white/12 backdrop-blur-md border border-white/25 px-7 py-3.5 text-[13px] font-medium text-white hover:bg-white/20 transition-colors">
            Start the tour
            <svg width="13" height="13" viewBox="0 0 14 14" aria-hidden>
              <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
