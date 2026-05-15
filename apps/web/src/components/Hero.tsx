'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Magnetic } from './Magnetic';
import { initGSAP } from '@/lib/gsap-init';

if (typeof window !== 'undefined') {
  initGSAP();
}

const HEADLINE = ['Attendance,', 'unforgeable.'];
const SUB =
  'Dynamic signed QR · device binding · geofence · app attestation. The proxy-attendance problem, solved at the protocol layer.';

export function Hero() {
  const root = useRef<HTMLDivElement>(null);
  const orb = useRef<HTMLDivElement>(null);
  const qr = useRef<HTMLDivElement>(null);
  const sub = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1) Headline mask reveal
      gsap.fromTo('.hero-line .reveal-line',
        { yPercent: 110, rotateZ: 2 },
        { yPercent: 0, rotateZ: 0, duration: 1.15, ease: 'expo.out', stagger: 0.1, delay: 0.2 },
      );

      // 2) Badge entrance
      gsap.fromTo('.hero-badge',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', delay: 0.1 },
      );

      // 3) Char-by-char scramble for subtitle
      const target = sub.current!;
      const finalText = SUB;
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*';
      let frame = 0;
      const total = 28;
      const tick = () => {
        let out = '';
        for (let i = 0; i < finalText.length; i++) {
          const progress = Math.max(0, Math.min(1, (frame - i * 0.6) / 8));
          out += progress >= 1 ? finalText[i] : chars[Math.floor(Math.random() * chars.length)];
        }
        target.textContent = out;
        frame++;
        if (frame < total + finalText.length * 0.6) requestAnimationFrame(tick);
        else target.textContent = finalText;
      };
      gsap.delayedCall(1.0, () => requestAnimationFrame(tick));

      // 4) QR mosaic cells materialise
      gsap.fromTo('.qr-cell',
        { scale: 0, opacity: 0, rotation: () => gsap.utils.random(-90, 90) },
        {
          scale: 1, opacity: 1, rotation: 0,
          transformOrigin: 'center center',
          duration: 0.85,
          ease: 'back.out(1.5)',
          stagger: { each: 0.005, from: 'random' },
          delay: 0.4,
        },
      );

      // 5) QR continuous breathing
      gsap.to(qr.current, {
        rotate: 0.8, scale: 1.014, duration: 4,
        ease: 'sine.inOut', yoyo: true, repeat: -1,
      });

      // 6) Orb parallax cursor
      const onMove = (e: PointerEvent) => {
        const { innerWidth: w, innerHeight: h } = window;
        gsap.to(orb.current!, {
          x: (e.clientX - w / 2) * 0.05,
          y: (e.clientY - h / 2) * 0.05,
          duration: 1.1, ease: 'power3.out',
        });
      };
      window.addEventListener('pointermove', onMove);

      // 7) Hero scroll fade-out
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top top',
        end: '+=500',
        scrub: 1.2,
        animation: gsap.timeline()
          .to('.hero-line', { yPercent: -12, opacity: 0.5 }, 0)
          .to(qr.current, { scale: 0.88, rotate: -3, yPercent: -8 }, 0)
          .to(orb.current, { scale: 0.65, opacity: 0.35 }, 0),
      });

      // 8) CTA buttons entrance
      gsap.fromTo('.hero-cta',
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', stagger: 0.1, delay: 0.6 },
      );

      // 9) Stats entrance
      gsap.fromTo('.hero-stat',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.08, delay: 0.85 },
      );

      return () => window.removeEventListener('pointermove', onMove);
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative pt-36 pb-24 md:pt-48 md:pb-36 overflow-hidden">
      {/* Background orb */}
      <div
        ref={orb}
        aria-hidden
        className="absolute -top-32 -right-40 h-[680px] w-[680px] rounded-full blur-3xl opacity-45"
        style={{
          background:
            'radial-gradient(circle at 30% 30%, rgba(255,107,61,0.5), rgba(242,166,90,0.2) 40%, transparent 70%)',
        }}
      />
      <DrawUnderline />

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-[1.15fr_1fr] gap-14 lg:gap-20 items-center">
          <div>
            {/* Badge */}
            <div className="hero-badge inline-flex items-center gap-2.5 rounded-full glass px-3.5 py-1.5 text-[11.5px] tracking-widest text-ink-mute uppercase mb-10">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-accent animate-ping opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
              </span>
              Private beta · 40 institutions
            </div>

            {/* Headline */}
            <h1 className="font-display text-[3.8rem] sm:text-[5rem] lg:text-[6rem] leading-[0.95] tracking-tightish text-ink">
              {HEADLINE.map((line, i) => (
                <span key={i} className="hero-line block reveal-mask">
                  <span className="reveal-line">
                    {i === 1 ? <em className="not-italic text-accent">{line}</em> : line}
                  </span>
                </span>
              ))}
            </h1>

            {/* Subtitle */}
            <p
              ref={sub}
              className="mt-8 max-w-[480px] text-[13.5px] leading-[1.75] text-ink-mute font-mono tracking-wide"
            />

            {/* CTAs */}
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Magnetic strength={0.22}>
                <a
                  href="#demo"
                  className="hero-cta group inline-flex items-center gap-2.5 rounded-xl bg-ink px-7 py-3.5 text-[13px] font-medium tracking-wide text-cream-50 transition-all hover:bg-ink-soft hover:scale-[1.03] active:scale-[0.97]"
                >
                  Get started
                  <svg width="13" height="13" viewBox="0 0 14 14" className="transition-transform group-hover:translate-x-1">
                    <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </Magnetic>
              <Magnetic strength={0.18}>
                <a
                  href="#demo"
                  className="hero-cta inline-flex items-center gap-2 rounded-xl border border-ink/12 bg-cream-50/50 px-7 py-3.5 text-[13px] tracking-wide text-ink hover:bg-cream-100 transition-all"
                >
                  Watch 90-sec demo
                </a>
              </Magnetic>
            </div>

            {/* Stats strip */}
            <div className="mt-14 flex items-center gap-10 text-[11px] tracking-[0.18em] uppercase text-ink-mute">
              <Stat label="Scan success" value={99.7} suffix="%" decimals={1} />
              <Divider />
              <Stat label="Spoofed scans blocked" value={132984} format />
              <Divider />
              <Stat label="QR rotation" value={7} suffix="s" />
            </div>
          </div>

          {/* QR mosaic */}
          <div ref={qr} className="relative mx-auto w-full max-w-[420px] aspect-square">
            <QrMosaic />
          </div>
        </div>
      </div>
    </section>
  );
}

function Divider() {
  return <span className="hidden sm:block h-7 w-px bg-ink/12" />;
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
    <div className="hero-stat">
      <div className="counter-num text-[2.1rem] font-display text-ink leading-none flex items-baseline gap-1">
        <span ref={ref}>0</span>
        {suffix && <span className="text-accent text-[1.3rem]">{suffix}</span>}
      </div>
      <div className="mt-2 text-[10px] tracking-[0.16em] text-ink-mute">{label}</div>
    </div>
  );
}

function QrMosaic() {
  const cells: { x: number; y: number; on: boolean }[] = [];
  const N = 21;
  const isFinder = (x: number, y: number) =>
    (x < 7 && y < 7) || (x >= N - 7 && y < 7) || (x < 7 && y >= N - 7);
  const rng = (i: number) => {
    const x = Math.sin(i * 9301 + 49297) * 233280;
    return x - Math.floor(x);
  };
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const finder = isFinder(x, y);
      let on = false;
      if (finder) {
        const lx = x >= N - 7 ? x - (N - 7) : x;
        const ly = y >= N - 7 ? y - (N - 7) : y;
        const fx = Math.min(lx, 6 - lx);
        const fy = Math.min(ly, 6 - ly);
        on = Math.min(fx, fy) === 0 || Math.min(fx, fy) === 2;
      } else {
        on = rng(x * 31 + y * 17) > 0.55;
      }
      cells.push({ x, y, on });
    }
  }
  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-0 rounded-[28px] glass shadow-[0_40px_100px_-20px_rgba(11,18,32,0.2)]" />
      <div
        className="absolute inset-6 grid"
        style={{ gridTemplateColumns: `repeat(${N}, 1fr)`, gap: '2.5px' }}
      >
        {cells.map((c, i) => (
          <div key={i} className="qr-cell aspect-square" style={{ visibility: c.on ? 'visible' : 'hidden' }} />
        ))}
      </div>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-14 w-14 rounded-2xl bg-cream-50 grid place-items-center shadow-lg">
        <div className="h-6 w-6 rounded-lg bg-accent icon-pulse" />
      </div>
      <svg className="absolute inset-0 animate-[spin_24s_linear_infinite]" viewBox="0 0 100 100" aria-hidden>
        <circle cx="50" cy="50" r="49" fill="none" stroke="rgba(11,18,32,0.05)" strokeDasharray="2 5" />
      </svg>
    </div>
  );
}

function DrawUnderline() {
  const ref = useRef<SVGPathElement>(null);
  useEffect(() => {
    const path = ref.current!;
    const len = path.getTotalLength();
    gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
    gsap.to(path, { strokeDashoffset: 0, duration: 2.4, ease: 'power2.inOut', delay: 1.5 });
  }, []);
  return (
    <svg aria-hidden viewBox="0 0 400 24" className="absolute left-[18%] top-[56%] w-[280px] text-accent pointer-events-none hidden md:block opacity-70">
      <path ref={ref} d="M2 14 C 80 2, 180 24, 260 10 S 380 18, 398 10"
        stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}
