'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Magnetic } from './Magnetic';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

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
      // 1) Headline mask reveal (word-by-word, stagger, ease-out-quint)
      gsap.fromTo('.hero-line .reveal-line',
        { yPercent: 110, rotateZ: 2 },
        { yPercent: 0, rotateZ: 0, duration: 1.2, ease: 'expo.out', stagger: 0.08, delay: 0.15 },
      );

      // 2) Char-by-char scramble for subtitle
      const target = sub.current!;
      const finalText = SUB;
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*';
      let frame = 0;
      const total = 26;
      const tick = () => {
        let out = '';
        for (let i = 0; i < finalText.length; i++) {
          const progress = Math.max(0, Math.min(1, (frame - i * 0.6) / 8));
          out += progress >= 1
            ? finalText[i]
            : chars[Math.floor(Math.random() * chars.length)];
        }
        target.textContent = out;
        frame++;
        if (frame < total + finalText.length * 0.6) requestAnimationFrame(tick);
        else target.textContent = finalText;
      };
      gsap.delayedCall(0.9, () => requestAnimationFrame(tick));

      // 3) QR mosaic — cells materialise with random stagger
      gsap.from('.qr-cell', {
        scale: 0,
        opacity: 0,
        rotation: () => gsap.utils.random(-90, 90),
        transformOrigin: 'center center',
        duration: 0.9,
        ease: 'back.out(1.6)',
        stagger: { each: 0.005, from: 'random' },
        delay: 0.5,
      });

      // 4) Continuous breathing
      gsap.to(qr.current, {
        rotate: 0.6,
        scale: 1.012,
        duration: 4,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });

      // 5) Orb parallax follows cursor
      const onMove = (e: PointerEvent) => {
        const { innerWidth: w, innerHeight: h } = window;
        gsap.to(orb.current!, {
          x: (e.clientX - w / 2) * 0.04,
          y: (e.clientY - h / 2) * 0.04,
          duration: 0.9,
          ease: 'power3.out',
        });
      };
      window.addEventListener('pointermove', onMove);

      // 6) Pin + scrub fade-out as you scroll past hero
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top top',
        end: '+=600',
        scrub: 1,
        animation: gsap.timeline()
          .to('.hero-line', { yPercent: -15, opacity: 0.6 }, 0)
          .to(qr.current, { scale: 0.85, rotate: -4, yPercent: -10 }, 0)
          .to(orb.current, { scale: 0.6, opacity: 0.4 }, 0),
      });

      // 7) Floating tickers (badges) with elastic entry
      gsap.from('.hero-badge', {
        y: 30, opacity: 0,
        ease: 'elastic.out(1, 0.55)',
        duration: 1.4,
        stagger: 0.12,
        delay: 0.8,
      });

      return () => window.removeEventListener('pointermove', onMove);
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative pt-36 pb-24 md:pt-44 md:pb-32 overflow-hidden">
      {/* Background parallax orb */}
      <div
        ref={orb}
        aria-hidden
        className="absolute -top-32 -right-40 h-[640px] w-[640px] rounded-full blur-3xl opacity-50"
        style={{
          background:
            'radial-gradient(circle at 30% 30%, rgba(255,107,61,0.55), rgba(242,166,90,0.25) 40%, transparent 70%)',
        }}
      />
      {/* SVG draw underline */}
      <DrawUnderline />

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-16 items-center">
          <div>
            <div className="hero-badge inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-[11.5px] tracking-wide text-ink-mute mb-8">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-accent animate-ping opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
              </span>
              Now in private beta · onboarding 40 institutions
            </div>

            <h1 className="font-display text-[3.5rem] sm:text-[4.5rem] lg:text-[5.6rem] leading-[0.95] tracking-tightish text-ink">
              {HEADLINE.map((line, i) => (
                <span key={i} className="hero-line block reveal-mask">
                  <span className="reveal-line">
                    {i === 1 ? <em className="not-italic text-accent">{line}</em> : line}
                  </span>
                </span>
              ))}
            </h1>

            <p
              ref={sub}
              className="mt-8 max-w-xl text-[1.05rem] leading-relaxed text-ink-mute font-mono text-[14px]"
            >
              {/* scramble fills this */}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Magnetic strength={0.25}>
                <a
                  href="#demo"
                  className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-[13.5px] font-medium text-cream-50 transition-all hover:bg-ink-soft"
                >
                  Get started
                  <svg width="14" height="14" viewBox="0 0 14 14" className="transition-transform group-hover:translate-x-1">
                    <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </Magnetic>
              <Magnetic strength={0.2}>
                <a
                  href="#demo"
                  className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-cream-50/50 px-6 py-3.5 text-[13.5px] text-ink hover:bg-cream-100 transition-colors"
                >
                  Watch 90-sec demo
                </a>
              </Magnetic>
            </div>

            <div className="mt-14 flex items-center gap-8 text-[11.5px] tracking-wide uppercase text-ink-mute">
              <Stat label="Scan success" value={99.7} suffix="%" decimals={1} />
              <Divider />
              <Stat label="Spoofed scans blocked" value={132984} format />
              <Divider />
              <Stat label="QR rotation" value={7} suffix="s" />
            </div>
          </div>

          <div ref={qr} className="relative mx-auto w-full max-w-[440px] aspect-square">
            <QrMosaic />
          </div>
        </div>
      </div>
    </section>
  );
}

function Divider() {
  return <span className="hidden sm:block h-6 w-px bg-ink/15" />;
}

function Stat({
  label, value, suffix, decimals = 0, format,
}: { label: string; value: number; suffix?: string; decimals?: number; format?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current!;
    const obj = { v: 0 };
    gsap.to(obj, {
      v: value, duration: 2.2, ease: 'expo.out', delay: 0.6,
      onUpdate: () => {
        const n = obj.v;
        el.textContent = format
          ? Math.floor(n).toLocaleString()
          : n.toFixed(decimals);
      },
    });
  }, [value, decimals, format]);
  return (
    <div>
      <div className="counter-num text-[2rem] font-display text-ink leading-none">
        <span ref={ref}>0</span>
        {suffix && <span className="text-accent">{suffix}</span>}
      </div>
      <div className="mt-1.5 text-[10.5px] tracking-[0.14em] text-ink-mute">{label}</div>
    </div>
  );
}

/** Animated 21×21 QR-like mosaic. Three anchor "finder" patterns at corners. */
function QrMosaic() {
  const cells: { x: number; y: number; on: boolean }[] = [];
  const N = 21;

  const isFinder = (x: number, y: number) =>
    (x < 7 && y < 7) || (x >= N - 7 && y < 7) || (x < 7 && y >= N - 7);

  // Deterministic pseudo-random
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
        const ring = Math.min(fx, fy);
        on = ring === 0 || ring === 2;
      } else {
        on = rng(x * 31 + y * 17) > 0.55;
      }
      cells.push({ x, y, on });
    }
  }

  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-0 rounded-[28px] glass shadow-[0_30px_80px_-20px_rgba(11,18,32,0.25)]" />
      <div
        className="absolute inset-6 grid"
        style={{ gridTemplateColumns: `repeat(${N}, 1fr)`, gap: '2px' }}
      >
        {cells.map((c, i) => (
          <div
            key={i}
            className="qr-cell aspect-square"
            style={{ visibility: c.on ? 'visible' : 'hidden' }}
          />
        ))}
      </div>
      {/* Center logo bubble */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-14 w-14 rounded-2xl bg-cream-50 grid place-items-center shadow-md">
        <div className="h-6 w-6 rounded-md bg-accent" />
      </div>
      {/* Rotating ring */}
      <svg
        className="absolute inset-0 animate-[spin_22s_linear_infinite]"
        viewBox="0 0 100 100"
        aria-hidden
      >
        <circle cx="50" cy="50" r="49" fill="none" stroke="rgba(11,18,32,0.06)" strokeDasharray="2 4" />
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
    gsap.to(path, {
      strokeDashoffset: 0,
      duration: 2.2,
      ease: 'power2.inOut',
      delay: 1.4,
    });
  }, []);
  return (
    <svg
      aria-hidden
      viewBox="0 0 400 24"
      className="absolute left-[20%] top-[58%] w-[300px] text-accent pointer-events-none hidden md:block"
    >
      <path
        ref={ref}
        d="M2 14 C 80 2, 180 24, 260 10 S 380 18, 398 10"
        stroke="currentColor"
        strokeWidth="2.2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
