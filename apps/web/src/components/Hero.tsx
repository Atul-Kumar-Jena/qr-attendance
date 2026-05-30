'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Magnetic } from './Magnetic';
import { initGSAP } from '@/lib/gsap-init';
import { DemoModal } from './DemoModal';
import { Aurora } from './Aurora';

if (typeof window !== 'undefined') {
  initGSAP();
}

const HEADLINE = ['Attendance,', 'unforgeable.'];
const SUB =
  'Dynamic signed QR · device binding · geofence · app attestation. The proxy-attendance problem, solved at the protocol layer.';

function RobotBust() {
  const headG  = useRef<SVGGElement>(null);
  const bodyG  = useRef<SVGGElement>(null);
  const armL   = useRef<SVGGElement>(null);
  const armR   = useRef<SVGGElement>(null);
  const eyeIrisL = useRef<SVGEllipseElement>(null);
  const eyeIrisR = useRef<SVGEllipseElement>(null);
  const [hiVisible, setHiVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const head = headG.current;
    const irisL = eyeIrisL.current;
    const irisR = eyeIrisR.current;
    const aL = armL.current;
    const aR = armR.current;
    if (!head || !irisL || !irisR) return;

    // Entrance
    gsap.set(head, { opacity: 0, scale: 0.92, transformOrigin: '160px 220px' });
    gsap.to(head, { opacity: 1, scale: 1, duration: 1, ease: 'power3.out', delay: 0.15 });

    gsap.set([irisL, irisR], { scaleY: 0, transformOrigin: '50% 50%' });
    gsap.to([irisL, irisR], { scaleY: 1, duration: 0.65, ease: 'back.out(1.7)', delay: 0.7 });

    setHiVisible(true);
    const hiTimer = setTimeout(() => setHiVisible(false), 2600);

    // Blink loop
    const blinkSchedule = () => {
      const delay = 2800 + Math.random() * 3200;
      return setTimeout(() => {
        if (!irisL || !irisR) return;
        gsap.timeline()
          .to([irisL, irisR], { attr: { ry: 0.05 }, duration: 0.055, ease: 'power2.in' })
          .to([irisL, irisR], { attr: { ry: 28 }, duration: 0.1, ease: 'power2.out' })
          .call(() => { blinkTimer = blinkSchedule(); });
      }, delay);
    };
    let blinkTimer = blinkSchedule();

    // Gentle body float
    const floatTween = gsap.to(head, {
      y: -8, duration: 2.2, ease: 'sine.inOut', yoyo: true, repeat: -1,
    });

    // Arms — pivot at shoulder (top-center of each arm rect)
    if (aR) {
      gsap.set(aR, { transformOrigin: '268px 340px', force3D: true });
      // Wave greeting: arm lifts & swings
      gsap.timeline({ delay: 0.75 })
        .to(aR, { rotation: -35, duration: 0.2, ease: 'power2.out' })
        .to(aR, { rotation: 14, duration: 0.25, ease: 'power2.inOut' })
        .to(aR, { rotation: -30, duration: 0.2, ease: 'power2.inOut' })
        .to(aR, { rotation: 10, duration: 0.25, ease: 'power2.inOut' })
        .to(aR, { rotation: -20, duration: 0.2, ease: 'power2.inOut' })
        .to(aR, { rotation: 0, duration: 0.45, ease: 'back.out(1.5)' })
        .then(() => {
          gsap.to(aR, { rotation: -5, duration: 3, ease: 'sine.inOut', yoyo: true, repeat: -1, force3D: true });
        });
    }
    if (aL) {
      gsap.set(aL, { transformOrigin: '52px 340px', force3D: true });
      gsap.to(aL, { rotation: 4, duration: 3.5, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 0.5, force3D: true });
    }

    // Cursor tracking
    const onPointerMove = (e: PointerEvent) => {
      if (!head) return;
      const rect = head.closest('svg')?.getBoundingClientRect();
      if (!rect) return;
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / window.innerWidth;
      const dy = (e.clientY - cy) / window.innerHeight;
      gsap.to(head, {
        rotationY: dx * 6,
        rotationX: -dy * 4,
        transformOrigin: '160px 220px',
        duration: 0.65,
        ease: 'power2.out',
      });
    };
    window.addEventListener('pointermove', onPointerMove);

    return () => {
      clearTimeout(hiTimer);
      clearTimeout(blinkTimer);
      floatTween.kill();
      window.removeEventListener('pointermove', onPointerMove);
    };
  }, []);

  return (
    <div className="relative w-full">
      {hiVisible && (
        <div
          className="absolute top-1 left-1/2 -translate-x-1/2 z-10 text-sm font-semibold text-cyan-300 pointer-events-none select-none whitespace-nowrap"
          style={{ textShadow: '0 0 14px rgba(0,180,216,0.9)', animation: 'fadeSlideIn 0.4s ease forwards' }}
        >
          Hi there! 👋
        </div>
      )}
      <svg
        viewBox="0 0 320 440"
        width="100%"
        height="290"
        role="presentation"
        aria-hidden
        style={{ filter: 'drop-shadow(0 24px 56px rgba(0,180,216,0.14))' }}
      >
        <defs>
          <radialGradient id="rb-head-grad" cx="0.42" cy="0.28" r="0.85">
            <stop offset="0" stopColor="#1E1E26" />
            <stop offset="0.5" stopColor="#111116" />
            <stop offset="1" stopColor="#0C0C10" />
          </radialGradient>
          <radialGradient id="rb-iris-l" cx="0.35" cy="0.3" r="0.85">
            <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="0.22" stopColor="#80EFFF" />
            <stop offset="0.58" stopColor="#00B4D8" />
            <stop offset="1" stopColor="#023E8A" />
          </radialGradient>
          <radialGradient id="rb-iris-r" cx="0.35" cy="0.3" r="0.85">
            <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="0.22" stopColor="#80EFFF" />
            <stop offset="0.58" stopColor="#00B4D8" />
            <stop offset="1" stopColor="#023E8A" />
          </radialGradient>
          <radialGradient id="rb-arm-grad" cx="0.5" cy="0" r="1">
            <stop offset="0" stopColor="#1A1A1E" />
            <stop offset="1" stopColor="#0C0C10" />
          </radialGradient>
          <filter id="rb-eye-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="7" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="rb-head-shadow" x="-20%" y="-10%" width="140%" height="130%">
            <feDropShadow dx="0" dy="10" stdDeviation="14" floodColor="#000" floodOpacity="0.65" />
          </filter>
          <clipPath id="rb-eye-clip-l"><ellipse cx="118" cy="155" rx="40" ry="20" /></clipPath>
          <clipPath id="rb-eye-clip-r"><ellipse cx="202" cy="155" rx="40" ry="20" /></clipPath>
        </defs>

        {/* Left arm — gentle sway, pivot at shoulder (52,340) */}
        <g ref={armL}>
          {/* Upper arm tube */}
          <rect x="40" y="338" width="24" height="44" rx="12" fill="#131318" stroke="#22222A" strokeWidth="1.2" />
          {/* Elbow joint sphere */}
          <circle cx="52" cy="384" r="13" fill="#1A1A22" stroke="#2A2A36" strokeWidth="1" />
          <circle cx="52" cy="384" r="7" fill="#111118" />
          {/* Forearm tube */}
          <rect x="40" y="382" width="24" height="40" rx="12" fill="#111116" stroke="#22222A" strokeWidth="1.2" />
          {/* Wrist */}
          <circle cx="52" cy="424" r="10" fill="#1A1A22" stroke="#2A2A36" strokeWidth="1" />
          {/* Hand — robotic claw shape */}
          <rect x="42" y="420" width="20" height="14" rx="4" fill="#141418" stroke="#22222A" strokeWidth="0.9" />
          <path d="M43 434 Q40 442 40 448" stroke="#22222A" strokeWidth="5" strokeLinecap="round" fill="none" />
          <path d="M52 435 Q52 443 52 449" stroke="#22222A" strokeWidth="5" strokeLinecap="round" fill="none" />
          <path d="M61 434 Q64 442 64 448" stroke="#22222A" strokeWidth="5" strokeLinecap="round" fill="none" />
          {/* Cyan accent on elbow */}
          <circle cx="52" cy="384" r="13" fill="none" stroke="#00D4FF" strokeWidth="0.5" opacity="0.3" />
        </g>

        {/* Right arm — waves on entry, pivot at shoulder (268,340) */}
        <g ref={armR}>
          {/* Upper arm tube */}
          <rect x="256" y="338" width="24" height="44" rx="12" fill="#131318" stroke="#22222A" strokeWidth="1.2" />
          {/* Elbow joint sphere */}
          <circle cx="268" cy="384" r="13" fill="#1A1A22" stroke="#2A2A36" strokeWidth="1" />
          <circle cx="268" cy="384" r="7" fill="#111118" />
          {/* Forearm tube */}
          <rect x="256" y="382" width="24" height="40" rx="12" fill="#111116" stroke="#22222A" strokeWidth="1.2" />
          {/* Wrist */}
          <circle cx="268" cy="424" r="10" fill="#1A1A22" stroke="#2A2A36" strokeWidth="1" />
          {/* Hand */}
          <rect x="258" y="420" width="20" height="14" rx="4" fill="#141418" stroke="#22222A" strokeWidth="0.9" />
          <path d="M259 434 Q256 442 256 448" stroke="#22222A" strokeWidth="5" strokeLinecap="round" fill="none" />
          <path d="M268 435 Q268 443 268 449" stroke="#22222A" strokeWidth="5" strokeLinecap="round" fill="none" />
          <path d="M277 434 Q280 442 280 448" stroke="#22222A" strokeWidth="5" strokeLinecap="round" fill="none" />
          {/* Cyan accent on elbow */}
          <circle cx="268" cy="384" r="13" fill="none" stroke="#00D4FF" strokeWidth="0.5" opacity="0.3" />
        </g>

        {/* Body */}
        <g ref={bodyG} filter="url(#rb-head-shadow)">
          {/* Head dome */}
          <ellipse cx="160" cy="150" rx="100" ry="120" fill="url(#rb-head-grad)" />
          <line x1="160" y1="32" x2="160" y2="265" stroke="#1A1A1E" strokeWidth="0.8" opacity="0.55" />

          {/* Eye sockets */}
          <ellipse cx="118" cy="155" rx="42" ry="22" fill="#080808" />
          <ellipse cx="202" cy="155" rx="42" ry="22" fill="#080808" />

          {/* Eye glows */}
          <ellipse cx="118" cy="155" rx="36" ry="32" fill="#00B4D8" opacity="0.3" filter="url(#rb-eye-glow)" />
          <ellipse cx="202" cy="155" rx="36" ry="32" fill="#00B4D8" opacity="0.3" filter="url(#rb-eye-glow)" />

          {/* Irises */}
          <ellipse ref={eyeIrisL} cx="118" cy="155" rx="30" ry="28" fill="url(#rb-iris-l)" clipPath="url(#rb-eye-clip-l)" />
          <ellipse ref={eyeIrisR} cx="202" cy="155" rx="30" ry="28" fill="url(#rb-iris-r)" clipPath="url(#rb-eye-clip-r)" />

          {/* Detail rings */}
          {[8, 14, 20].map(r => (
            <g key={r}>
              <circle cx="118" cy="155" r={r} fill="none" stroke="white" strokeWidth="0.5" opacity="0.12" clipPath="url(#rb-eye-clip-l)" />
              <circle cx="202" cy="155" r={r} fill="none" stroke="white" strokeWidth="0.5" opacity="0.12" clipPath="url(#rb-eye-clip-r)" />
            </g>
          ))}

          {/* Pupils */}
          <circle cx="118" cy="155" r="7" fill="#001233" clipPath="url(#rb-eye-clip-l)" />
          <circle cx="202" cy="155" r="7" fill="#001233" clipPath="url(#rb-eye-clip-r)" />

          {/* Highlights */}
          <ellipse cx="112" cy="148" rx="6" ry="4" fill="white" opacity="0.8" clipPath="url(#rb-eye-clip-l)" />
          <ellipse cx="196" cy="148" rx="6" ry="4" fill="white" opacity="0.8" clipPath="url(#rb-eye-clip-r)" />

          {/* Socket rims */}
          <ellipse cx="118" cy="155" rx="42" ry="22" fill="none" stroke="#00D4FF" strokeWidth="0.8" opacity="0.45" />
          <ellipse cx="202" cy="155" rx="42" ry="22" fill="none" stroke="#00D4FF" strokeWidth="0.8" opacity="0.45" />

          {/* Neck */}
          <path d="M130 268 Q127 292 127 312 L193 312 Q193 292 190 268 Z" fill="#0C0C10" stroke="#1A1A1E" strokeWidth="0.8" />
          <line x1="120" y1="302" x2="200" y2="302" stroke="#00D4FF" strokeWidth="1.1" opacity="0.55" />

          {/* Shoulders */}
          <path d="M55 330 Q78 315 127 330 L127 365 Q78 368 50 352 Z" fill="#0D0D11" stroke="#1A1A1E" strokeWidth="0.7" />
          <path d="M265 330 Q242 315 193 330 L193 365 Q242 368 270 352 Z" fill="#0D0D11" stroke="#1A1A1E" strokeWidth="0.7" />

          {/* Chest */}
          <path d="M127 330 L127 395 Q127 406 160 406 Q193 406 193 395 L193 330 Z" fill="#0C0C10" stroke="#1A1A1E" strokeWidth="0.7" />
          <line x1="127" y1="330" x2="193" y2="330" stroke="#00D4FF" strokeWidth="0.6" opacity="0.45" />

          {/* Chest detail grill */}
          {[348, 360, 372].map((y, i) => (
            <line key={i} x1="140" y1={y} x2="180" y2={y} stroke="#1E1E26" strokeWidth="1.2" strokeLinecap="round" />
          ))}
        </g>
      </svg>
    </div>
  );
}

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
            .to(qr.current,   { scale: 0.88, rotate: -3, yPercent: -8 }, 0)
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

          <div ref={qr} className="relative flex flex-col items-center gap-8">
            <div className="w-full max-w-[320px] mx-auto">
              <RobotBust />
            </div>
            <div className="relative w-full max-w-[280px] mx-auto aspect-square">
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
