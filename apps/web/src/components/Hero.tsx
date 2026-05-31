'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Magnetic } from './Magnetic';
import { initGSAP } from '@/lib/gsap-init';
import { DemoModal } from './DemoModal';
import { Aurora } from './Aurora';
import { Spotlight } from './ui/spotlight';

if (typeof window !== 'undefined') {
  initGSAP();
}

const HEADLINE = ['Attendance,', 'unforgeable.'];
const SUB =
  'Dynamic signed QR · device binding · geofence · app attestation. The proxy-attendance problem, solved at the protocol layer.';

export function Hero() {
  const root = useRef<HTMLDivElement>(null);
  const orb  = useRef<HTMLDivElement>(null);
  const qr   = useRef<HTMLDivElement>(null);
  const sub  = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !root.current) return;
    let ctx: ReturnType<typeof gsap.context> | undefined;
    try {
      ctx = gsap.context(() => {
        gsap.fromTo('.hero-line .reveal-line',
          { yPercent: 110, rotateZ: 2, filter: 'blur(10px)' },
          { yPercent: 0, rotateZ: 0, filter: 'blur(0px)', duration: 1.25, ease: 'expo.out', stagger: 0.12, delay: 0.25 },
        );
        gsap.fromTo('.hero-badge',
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', delay: 0.1 },
        );
        const target = sub.current;
        if (!target) return;
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*';
        let frame = 0;
        const total = 28;
        const tick = () => {
          let out = '';
          for (let i = 0; i < SUB.length; i++) {
            const p = Math.max(0, Math.min(1, (frame - i * 0.6) / 8));
            out += p >= 1 ? SUB[i] : chars[Math.floor(Math.random() * chars.length)];
          }
          target.textContent = out;
          frame++;
          if (frame < total + SUB.length * 0.6) requestAnimationFrame(tick);
          else target.textContent = SUB;
        };
        gsap.delayedCall(1.0, () => requestAnimationFrame(tick));

        gsap.fromTo('.qr-cell',
          { scale: 0, opacity: 0, rotation: () => gsap.utils.random(-90, 90) },
          {
            scale: 1, opacity: 1, rotation: 0,
            transformOrigin: 'center center',
            duration: 0.85, ease: 'back.out(1.5)',
            stagger: { each: 0.005, from: 'random' }, delay: 0.4,
          },
        );
        gsap.to(qr.current, {
          rotate: 0.8, scale: 1.014, duration: 4,
          ease: 'sine.inOut', yoyo: true, repeat: -1,
        });

        const onMove = (e: PointerEvent) => {
          if (!orb.current) return;
          const { innerWidth: w, innerHeight: h } = window;
          gsap.to(orb.current, {
            x: (e.clientX - w / 2) * 0.05,
            y: (e.clientY - h / 2) * 0.05,
            duration: 1.1, ease: 'power3.out',
          });
        };
        window.addEventListener('pointermove', onMove);

        ScrollTrigger.create({
          trigger: root.current,
          start: 'top top', end: '+=500', scrub: 1.2,
          animation: gsap.timeline()
            .to('.hero-line',  { yPercent: -12, opacity: 0.5 }, 0)
            .to(qr.current,   { yPercent: -4 }, 0)
            .to(orb.current,  { scale: 0.65, opacity: 0.35 }, 0),
        });

        gsap.fromTo('.hero-cta',
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', stagger: 0.1, delay: 0.6 },
        );
        gsap.fromTo('.hero-stat',
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.08, delay: 0.85 },
        );

        return () => window.removeEventListener('pointermove', onMove);
      }, root);
    } catch { /* never crash the hero */ }
    return () => { try { ctx?.revert(); } catch {} };
  }, []);

  return (
    <section ref={root} className="hero-section section-dark relative pt-40 pb-28 md:pt-52 md:pb-40 overflow-hidden">
      <div ref={orb} aria-hidden className="absolute inset-0">
        <Aurora variant="hero" />
      </div>
      <DrawUnderline />

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-[1.15fr_1fr] gap-14 lg:gap-20 items-center">
          <div>
            <div className="hero-badge inline-flex items-center gap-2.5 rounded-full glass px-3.5 py-1.5 text-[11.5px] tracking-widest text-ink-mute uppercase mb-10">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-accent animate-ping opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
              </span>
              Private beta · 40 institutions
            </div>

            <h1 className="hero-headline font-display text-[2.8rem] sm:text-[5rem] lg:text-[6rem] leading-[0.95] tracking-tightish text-ink">
              {HEADLINE.map((line, i) => (
                <span key={i} className="hero-line block reveal-mask">
                  <span className="reveal-line">
                    {i === 1
                      ? <em className="not-italic text-white font-extrabold" style={{ textShadow: '0 0 40px rgba(255,255,255,0.6), 0 0 80px rgba(255,255,255,0.2)' }}>{line}</em>
                      : line}
                  </span>
                </span>
              ))}
            </h1>

            <div className="mt-8 max-w-[480px] min-h-[88px]">
              <p ref={sub} className="text-[13.5px] leading-[1.75] text-ink-mute font-mono tracking-wide"
                style={{ wordBreak: 'break-word', whiteSpace: 'normal' }} />
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Magnetic strength={0.22}>
                <a href="#pricing" data-magnetic
                  className="hero-cta group inline-flex items-center gap-2.5 rounded-xl bg-accent px-7 py-3.5 text-[13px] font-semibold tracking-wide text-[#0A0A0B] shadow-[0_8px_30px_-6px_rgba(244,242,238,0.35)] transition-all hover:bg-accent/90 hover:scale-[1.03] active:scale-[0.97]">
                  Get started
                  <svg width="13" height="13" viewBox="0 0 14 14" className="transition-transform group-hover:translate-x-1">
                    <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </Magnetic>
              <Magnetic strength={0.18}>
                <DemoModal trigger={
                  <button data-magnetic className="hero-cta inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-7 py-3.5 text-[13px] tracking-wide text-white/85 hover:bg-white/10 hover:border-white/25 transition-all">
                    Watch demo
                  </button>
                } />
              </Magnetic>
            </div>

            <div className="mt-14 flex items-center gap-10 text-[11px] tracking-[0.18em] uppercase text-ink-mute">
              <Stat label="Scan success"        value={99.7}   suffix="%" decimals={1} />
              <Divider />
              <Stat label="Spoofed scans blocked" value={132984} format />
              <Divider />
              <Stat label="QR rotation"         value={7}      suffix="s" />
            </div>
          </div>

          <div ref={qr} className="relative flex flex-col items-center gap-6">
            {/* The guardian robot's window — it boots up here, then walks out */}
            <div id="guardian-pod" className="robot-3d relative w-full h-[300px] md:h-[340px] rounded-[28px] overflow-hidden"
              style={{ background: 'radial-gradient(120% 120% at 50% 0%, rgba(20,20,26,0.6), rgba(0,0,0,0.85))', border: '1px solid rgba(255,255,255,0.07)' }}>
              <Spotlight className="-top-24 left-10 md:-top-16 md:left-24" fill="rgba(120,200,255,0.55)" />
              <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[9px] tracking-[0.34em] uppercase text-white/25 font-mono">guardian · online</span>
            </div>
            {/* QR mosaic — kept as the core product visual */}
            <div className="relative w-full max-w-[260px] mx-auto aspect-square">
              <QrMosaic />
            </div>
          </div>
        </div>
      </div>

      <div aria-hidden className="absolute inset-x-0 bottom-0 h-28 z-[1] pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, var(--page-bg))' }} />

      <div className="hero-cue absolute bottom-7 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center gap-2 text-white/40">
        <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
        <span className="relative w-px h-9 overflow-hidden bg-white/15">
          <span className="absolute inset-x-0 top-0 h-3 bg-white/60" style={{ animation: 'scrollCue 1.8s ease-in-out infinite' }} />
        </span>
      </div>
    </section>
  );
}

function Divider() {
  return <span className="hidden sm:block h-7 w-px bg-ink/12" />;
}

function Stat({ label, value, suffix, decimals = 0, format }:
  { label: string; value: number; suffix?: string; decimals?: number; format?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obj = { v: 0 };
    gsap.to(obj, {
      v: value, duration: 2.4, ease: 'expo.out', delay: 0.7,
      onUpdate: () => { el.textContent = format ? Math.floor(obj.v).toLocaleString() : obj.v.toFixed(decimals); },
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

const N = 21;

function isFinder(x: number, y: number) {
  return (x < 7 && y < 7) || (x >= N - 7 && y < 7) || (x < 7 && y >= N - 7);
}

function finderOn(x: number, y: number) {
  const lx = x >= N - 7 ? x - (N - 7) : x;
  const ly = y >= N - 7 ? y - (N - 7) : y;
  const d  = Math.min(lx, 6 - lx, ly, 6 - ly);
  return d === 0 || d >= 2;
}

function rng(seed: number, i: number) {
  const x = Math.sin(i * 9301 + 49297 + seed * 1000) * 233280;
  return x - Math.floor(x);
}

function buildCells(seed: number) {
  const cells: { on: boolean; isFnd: boolean }[] = [];
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const fnd = isFinder(x, y);
      cells.push({ isFnd: fnd, on: fnd ? finderOn(x, y) : rng(seed, x * 31 + y * 17) > 0.52 });
    }
  }
  return cells;
}

function QrMosaic() {
  const [tick, setTick]       = useState(0);
  const [cells, setCells]     = useState(() => buildCells(0));
  const [prevCells, setPrevCells] = useState<typeof cells>([]);
  const [flipping, setFlipping]   = useState(false);
  const flipRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const id = setInterval(() => {
      setTick((t) => {
        const next = t + 1;
        setCells((prev) => { setPrevCells(prev); return buildCells(next); });
        setFlipping(true);
        if (flipRef.current) clearTimeout(flipRef.current);
        flipRef.current = setTimeout(() => setFlipping(false), 350);
        return next;
      });
    }, 1000);
    return () => { clearInterval(id); if (flipRef.current) clearTimeout(flipRef.current); };
  }, []);

  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-0 rounded-[28px] glass shadow-[0_40px_100px_-20px_rgba(11,18,32,0.2)]" />
      <svg className="absolute inset-0 pointer-events-none z-10 w-full h-full" viewBox="0 0 100 100" aria-hidden>
        <circle cx="50" cy="50" r="49" fill="none" stroke="rgba(244,242,238,0.06)" strokeDasharray="2 5" />
        <circle cx="50" cy="50" r="44" fill="none"
          stroke="#F4F2EE" strokeWidth="1.5" strokeOpacity="0.55"
          strokeDasharray="276.46" strokeDashoffset="0" strokeLinecap="round"
          transform="rotate(-90 50 50)"
          style={{ animation: 'qrCountdown 1s linear infinite' }}
        />
      </svg>
      <div className="absolute inset-6 grid" style={{ gridTemplateColumns: `repeat(${N}, 1fr)`, gap: '2.5px' }}>
        {cells.map((c, i) => {
          const changed = !c.isFnd && prevCells[i] && prevCells[i].on !== c.on;
          return (
            <div key={i} className="qr-cell aspect-square" style={{
              opacity: c.on ? 1 : 0,
              transform: c.on ? 'scale(1)' : 'scale(0)',
              transition: changed && flipping
                ? `opacity 0.28s ease ${(i % 11) * 0.008}s, transform 0.28s ease ${(i % 11) * 0.008}s`
                : 'none',
            }} />
          );
        })}
      </div>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-14 w-14 rounded-2xl bg-cream-50 dark:bg-[#13161D] grid place-items-center shadow-lg z-20">
        <div className="h-6 w-6 rounded-lg bg-accent icon-pulse" />
      </div>
      <div className="absolute bottom-3 right-4 z-20 font-mono text-[9px] text-accent/60 tracking-widest select-none">
        #{tick.toString().padStart(4, '0')} · 1s
      </div>
    </div>
  );
}

function DrawUnderline() {
  const ref = useRef<SVGPathElement>(null);
  useEffect(() => {
    const path = ref.current;
    if (!path) return;
    const len = path.getTotalLength();
    gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
    gsap.to(path, { strokeDashoffset: 0, duration: 2.4, ease: 'power2.inOut', delay: 1.5 });
  }, []);
  return (
    <svg aria-hidden viewBox="0 0 400 24"
      className="absolute left-[18%] top-[56%] w-[280px] text-accent pointer-events-none hidden md:block opacity-70">
      <path ref={ref} d="M2 14 C 80 2, 180 24, 260 10 S 380 18, 398 10"
        stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}
