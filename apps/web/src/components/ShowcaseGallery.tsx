'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initGSAP } from '@/lib/gsap-init';
import { asset } from '@/lib/asset';

if (typeof window !== 'undefined') initGSAP();

/**
 * Side-scroll showcase — one refined language:
 *  1. Inner-image parallax ("window"): image is larger than its frame and
 *     glides as the panel crosses the viewport.
 *  2. Scale-recede focus: centred panel is full size; neighbours shrink + dim.
 *  3. Velocity skew: the row skews a few degrees on fast scroll, then settles.
 *  4. Deep atmospheric backdrop sits behind (site-wide field + local glow).
 *  5. Organic per-panel variation: each panel gets its own parallax depth and a
 *     small vertical offset — a curated gallery rhythm.
 *
 * Desktop: pinned horizontal track driven directly from scroll progress (no GSAP
 * per-frame tween → no attribute thrash, steady 60fps). Mobile: native
 * scroll-snap carousel with a lighter scale-recede — a fast flick never hangs.
 */

interface Panel {
  img: string;
  kicker: string;
  title: string;
  body: string;
  depth: number;
  offset: number;
}

const PANELS: Panel[] = [
  { img: '01.svg', kicker: 'Token',     title: 'Signed light',        body: 'Every QR is born cryptographic — ECDSA-P256, single-use, gone in seconds.', depth: 70,  offset: -26 },
  { img: '02.svg', kicker: 'Detection', title: 'The deep field',      body: 'Weighted fraud signals surface the anomalies. The rest stays invisible.',  depth: 120, offset: 30 },
  { img: '03.svg', kicker: 'Identity',  title: 'One device, one you', body: 'Accounts bind to a single device. Resets are admin-only, always logged.',  depth: 90,  offset: -14 },
  { img: '04.svg', kicker: 'Presence',  title: 'Geofenced',           body: 'Server-side Haversine draws the line. Mock-location is flagged on contact.', depth: 150, offset: 44 },
  { img: '05.svg', kicker: 'Realtime',  title: 'Always live',         body: 'Sessions stream as they happen — marked, pending, suspicious, in order.',   depth: 80,  offset: -34 },
  { img: '06.svg', kicker: 'Trust',     title: 'Provable',            body: 'Append-only, hash-chained audit. Every sensitive action, reconstructable.', depth: 130, offset: 20 },
];

export function ShowcaseGallery() {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mobile = window.matchMedia('(max-width: 900px)').matches;

    if (mobile) {
      const panels = gsap.utils.toArray<HTMLElement>('.gallery-panel', root.current!);
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            const t = e.intersectionRatio;
            gsap.to(e.target, { scale: 0.9 + t * 0.1, opacity: 0.5 + t * 0.5, duration: 0.4, ease: 'power2.out' });
          });
        },
        { root: track.current, threshold: [0, 0.25, 0.5, 0.75, 1], rootMargin: '0px -22% 0px -22%' },
      );
      panels.forEach((p) => io.observe(p));
      return () => io.disconnect();
    }

    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>('.gallery-panel');
      const imgs = panels.map((p) => p.querySelector<HTMLElement>('.gallery-img')!);
      const cur = { x: 0, skew: 0 };

      const distance = () =>
        Math.max(0, track.current!.scrollWidth - window.innerWidth + window.innerWidth * 0.12);

      const writeTrack = () => {
        track.current!.style.transform = `translate3d(${cur.x}px,0,0) skewX(${cur.skew}deg)`;
      };

      const layout = () => {
        const center = window.innerWidth / 2;
        const rects = panels.map((p) => p.getBoundingClientRect());
        rects.forEach((r, i) => {
          const d = (r.left + r.width / 2 - center) / window.innerWidth; // -~1 .. ~1
          const ad = Math.min(1, Math.abs(d));
          panels[i].style.transform =
            `translateY(${(PANELS[i].offset + d * PANELS[i].depth * 0.18).toFixed(2)}px) scale(${(1 - ad * 0.14).toFixed(3)})`;
          panels[i].style.opacity = (1 - ad * 0.4).toFixed(3);
          imgs[i].style.transform = `translate(calc(-50% + ${(-d * PANELS[i].depth).toFixed(1)}px), -50%)`;
        });
      };

      const st = ScrollTrigger.create({
        trigger: root.current,
        pin: true,
        start: 'top top',
        end: () => `+=${distance() * 1.05 + 240}`,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          cur.x = -distance() * self.progress;
          cur.skew = gsap.utils.clamp(-7, 7, self.getVelocity() / 320);
          writeTrack();
          layout();
        },
        onRefresh: (self) => {
          cur.x = -distance() * self.progress;
          writeTrack();
          layout();
        },
      });

      // Settle the velocity skew toward 0 when scrolling stops.
      const ticker = () => {
        if (Math.abs(cur.skew) > 0.01) {
          cur.skew = gsap.utils.interpolate(cur.skew, 0, 0.12);
          writeTrack();
        }
      };
      gsap.ticker.add(ticker);

      layout();
      writeTrack();
      return () => { gsap.ticker.remove(ticker); st.kill(); };
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      id="showcase"
      className="relative overflow-hidden py-20 md:py-0 md:h-screen md:flex md:flex-col md:justify-center"
      aria-label="Showcase"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[80vh] w-[80vh] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]"
          style={{ background: 'radial-gradient(circle, rgba(46,138,92,0.18), transparent 70%)' }} />
      </div>

      <div className="container relative z-10 mb-10 md:absolute md:top-10 md:left-1/2 md:-translate-x-1/2 md:mb-0">
        <div className="flex items-end justify-between gap-6">
          <div>
            <span className="text-[10.5px] tracking-[0.3em] text-ink-mute uppercase">[ 04 — the field ]</span>
            <h2 className="mt-3 font-display text-[2.2rem] md:text-[3.4rem] leading-[1.0] tracking-tightish">
              A gallery of <span className="iri-text">moving parts</span>.
            </h2>
          </div>
          <div className="hidden md:flex items-center gap-2 text-[11px] tracking-[0.18em] text-ink-mute uppercase">
            <span>scroll</span>
            <svg width="34" height="10" viewBox="0 0 34 10" fill="none" aria-hidden>
              <path d="M0 5h31M27 1l5 4-5 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>

      <div
        ref={track}
        className="flex gap-5 md:gap-8 px-6 md:px-[12vw] will-change-transform overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {PANELS.map((p, i) => (
          <article
            key={p.img}
            className="gallery-panel snap-center shrink-0 w-[78vw] sm:w-[60vw] md:w-[34vw] lg:w-[30vw]"
          >
            <div className="gallery-frame h-[58vh] md:h-[62vh]">
              <img
                src={asset(`/showcase/${p.img}`)}
                alt={p.title}
                draggable={false}
                className="gallery-img select-none"
              />
              <div className="gallery-edge" />
              <div className="absolute inset-x-4 bottom-4 md:inset-x-6 md:bottom-6">
                <div className="glass rounded-2xl px-4 py-3.5 md:px-5 md:py-4">
                  <div className="flex items-center gap-2 text-[10px] tracking-[0.22em] uppercase text-accent">
                    <span className="h-1 w-1 rounded-full bg-accent" />
                    {p.kicker} · {String(i + 1).padStart(2, '0')}
                  </div>
                  <h3 className="mt-1.5 font-display text-[1.5rem] md:text-[1.8rem] leading-none">{p.title}</h3>
                  <p className="mt-1.5 text-[12px] md:text-[12.5px] leading-snug text-ink-mute">{p.body}</p>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
