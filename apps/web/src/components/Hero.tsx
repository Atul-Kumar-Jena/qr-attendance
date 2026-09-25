'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { SplitText as GSAPSplitText } from 'gsap/SplitText';
import { QRCodeSVG } from 'qrcode.react';
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
  'A code that can’t be shared, screenshotted, or scanned from outside the room. The end of proxy attendance — and the ten-minute roll call.';

/** Seconds between QR rotations — matches the "QR rotation 7s" claim site-wide. */
const ROTATE_S = 7;

export function Hero() {
  const root = useRef<HTMLDivElement>(null);
  const orb  = useRef<HTMLDivElement>(null);
  const sub  = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !root.current) return;
    // Reduced motion: everything is visible by default (no CSS hides it), so we
    // simply skip the entrance choreography entirely.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let ctx: ReturnType<typeof gsap.context> | undefined;
    let heroSplit: GSAPSplitText | undefined;
    let decodeRaf = 0;
    const target = sub.current;
    try {
      ctx = gsap.context(() => {
        // "Decrypt / focus-in" headline: glyphs resolve from large + faded into
        // place in random order. Transform + opacity only — animating a blur
        // filter on every glyph was what made the hero stutter on phones.
        heroSplit = new GSAPSplitText('.hero-line', { type: 'chars', aria: 'none' });
        gsap.fromTo(heroSplit.chars,
          { opacity: 0, scale: 1.6, yPercent: 10 },
          {
            opacity: 1, scale: 1, yPercent: 0,
            duration: 0.9, ease: 'power3.out',
            stagger: { each: 0.022, from: 'random' }, delay: 0.15,
          },
        );
        gsap.fromTo('.hero-badge',
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', delay: 0.05 },
        );

        // Subtext "decode": a short cipher window sweeps across the real copy
        // once. Time-based (never frame-counted), so it finishes in ~1s even on
        // a slow phone, and the copy stays readable throughout.
        if (target) {
          const glyphs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%*';
          const W = 7, D = 1100, n = SUB.length;
          let t0 = 0;
          const tick = (now: number) => {
            if (!t0) t0 = now;
            const t = Math.min(1, (now - t0) / D);
            const head = Math.floor(t * (n + W));
            const from = Math.max(0, head - W), to = Math.min(n, head);
            let cipher = '';
            for (let i = from; i < to; i++) cipher += SUB[i] === ' ' ? ' ' : glyphs[(Math.random() * glyphs.length) | 0];
            target.textContent = t < 1 ? SUB.slice(0, from) + cipher + SUB.slice(to) : SUB;
            if (t < 1) decodeRaf = requestAnimationFrame(tick);
          };
          gsap.delayedCall(0.5, () => { decodeRaf = requestAnimationFrame(tick); });
        }

        gsap.fromTo('.hero-qr',
          { opacity: 0, scale: 0.94, y: 18 },
          { opacity: 1, scale: 1, y: 0, duration: 1.1, ease: 'expo.out', delay: 0.3 },
        );
        gsap.fromTo('.hero-cta',
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', stagger: 0.1, delay: 0.5 },
        );
        gsap.fromTo('.hero-stat',
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.08, delay: 0.7 },
        );

        // Parallax aurora follows a real mouse only (touch "pointermove" fires
        // during scroll drags and would move the hero while scrolling).
        if (window.matchMedia('(pointer: fine)').matches) {
          let vw = window.innerWidth, vh = window.innerHeight;
          const onResize = () => { vw = window.innerWidth; vh = window.innerHeight; };
          const xTo = gsap.quickTo(orb.current, 'x', { duration: 1.1, ease: 'power3.out' });
          const yTo = gsap.quickTo(orb.current, 'y', { duration: 1.1, ease: 'power3.out' });
          const onMove = (e: PointerEvent) => {
            xTo((e.clientX - vw / 2) * 0.05);
            yTo((e.clientY - vh / 2) * 0.05);
          };
          window.addEventListener('pointermove', onMove, { passive: true });
          window.addEventListener('resize', onResize, { passive: true });
          return () => {
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('resize', onResize);
          };
        }
        // No scroll-scrubbed fade-out here on purpose: that was the "curtain"
        // that made the hero drag and hang behind a fast scroll.
      }, root);
    } catch { /* never crash the hero */ }
    return () => {
      cancelAnimationFrame(decodeRaf);
      if (target) target.textContent = SUB;
      try { heroSplit?.revert(); } catch {}
      try { ctx?.revert(); } catch {}
    };
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
                <span
                  key={i}
                  className={`hero-line block ${i === 1 ? 'text-white font-extrabold' : ''}`}
                  style={i === 1 ? { textShadow: '0 0 40px rgba(255,255,255,0.6), 0 0 80px rgba(255,255,255,0.2)' } : undefined}
                >
                  {line}
                </span>
              ))}
            </h1>

            <div className="mt-8 max-w-[480px] min-h-[88px]">
              <p ref={sub} className="text-[13.5px] leading-[1.75] text-ink-mute font-mono tracking-wide"
                style={{ wordBreak: 'break-word', whiteSpace: 'normal' }}>{SUB}</p>
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
              <Stat label="QR rotation"         value={ROTATE_S} suffix="s" />
            </div>
          </div>

          {/* Centerpiece: a live, rotating signed-QR credential with the three
              checks every scan must pass orbiting it. */}
          <div className="relative flex items-center justify-center">
            <Spotlight className="-top-24 left-1/2 -translate-x-1/2" fill="rgba(255,255,255,0.18)" />
            <div className="hero-qr relative w-full max-w-[340px] mx-auto aspect-square">
              <div className="hero-breathe absolute inset-0">
                <HeroQr />
              </div>
              <OrbitChips />
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
    const tween = gsap.to(obj, {
      v: value, duration: 2.4, ease: 'expo.out', delay: 0.7,
      onUpdate: () => { el.textContent = format ? Math.floor(obj.v).toLocaleString() : obj.v.toFixed(decimals); },
    });
    return () => { tween.kill(); };
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

/** A demo credential in the shape of a real signed token. Carries nothing
 *  personal and isn't accepted anywhere — it just looks and rotates like one. */
function makeToken(n: number) {
  const hex = () => Math.random().toString(16).slice(2, 10);
  return `atd://v1/CS301/${n}/${hex()}.${hex()}${hex()}`;
}

/**
 * The hero QR: one SVG code that rotates every ROTATE_S seconds behind a
 * countdown ring. Replaces the old 441-cell mosaic, which re-rendered every
 * cell through React each second. Pauses while off-screen or in a hidden tab.
 */
function HeroQr() {
  const [tick, setTick] = useState(0);
  // Deterministic first token so the static HTML and first client render match.
  const [token, setToken] = useState('atd://v1/CS301/0/5e1c07a2.9b4f3d10c28e7a64');
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = rootRef.current;
    let id: ReturnType<typeof setInterval> | null = null;
    let inView = true;
    const advance = () => setTick((t) => { const next = t + 1; setToken(makeToken(next)); return next; });
    const sync = () => {
      const run = inView && !document.hidden;
      if (run && !id) id = setInterval(advance, ROTATE_S * 1000);
      if (!run && id) { clearInterval(id); id = null; }
    };
    const io = el && typeof IntersectionObserver !== 'undefined'
      ? new IntersectionObserver(([e]) => { inView = e.isIntersecting; sync(); }, { threshold: 0 })
      : null;
    if (io && el) io.observe(el);
    document.addEventListener('visibilitychange', sync);
    sync();
    return () => {
      if (id) clearInterval(id);
      io?.disconnect();
      document.removeEventListener('visibilitychange', sync);
    };
  }, []);

  return (
    <div ref={rootRef} className="relative h-full w-full">
      <div className="absolute inset-0 rounded-[28px] glass shadow-[0_40px_100px_-20px_rgba(11,18,32,0.2)]" />
      <svg className="absolute inset-0 pointer-events-none z-10 w-full h-full" viewBox="0 0 100 100" aria-hidden>
        <circle cx="50" cy="50" r="48.5" fill="none" stroke="rgba(244,242,238,0.07)" strokeDasharray="1.5 4" />
        {/* Countdown to the next rotation; keyed so it restarts on every new code. */}
        <circle key={tick} cx="50" cy="50" r="46.5" fill="none" pathLength={100}
          stroke="#F4F2EE" strokeWidth="1.2" strokeOpacity="0.6" strokeLinecap="round"
          strokeDasharray="100" transform="rotate(-90 50 50)"
          style={{ animation: `qrRing ${ROTATE_S}s linear forwards` }}
        />
      </svg>
      <div className="absolute inset-[17%]">
        <div key={tick} className="hero-qr-swap h-full w-full">
          <QRCodeSVG
            value={token}
            size={240}
            level="H"
            bgColor="transparent"
            fgColor="#F4F2EE"
            role="img"
            aria-label="Live rotating attendance QR code (demo)"
            style={{ width: '100%', height: '100%', display: 'block' }}
          />
        </div>
      </div>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-14 w-14 rounded-2xl bg-cream-50 dark:bg-[#13161D] grid place-items-center shadow-lg z-20 ring-4 ring-[#0A0A0B]/60">
        <div className="h-6 w-6 rounded-lg bg-accent icon-pulse" />
      </div>
      <div className="absolute bottom-3 right-4 z-20 font-mono text-[9px] text-accent/60 tracking-widest select-none">
        #{tick.toString().padStart(4, '0')} · {ROTATE_S}s
      </div>
    </div>
  );
}

/* Floating verification chips that orbit the QR credential — tells the security
   story at a glance and gives the hero depth without any heavy 3D runtime. */
function OrbitChips() {
  const chips = [
    { label: 'Identity verified', top: '-6%',  left: '-14%', delay: '0s'   },
    { label: 'Inside geofence',   top: '38%',  left: '92%',  delay: '0.8s' },
    { label: 'Device attested',   top: '94%',  left: '-8%',  delay: '1.6s' },
  ];
  return (
    <div aria-hidden className="absolute inset-0 pointer-events-none hidden sm:block">
      {chips.map((c) => (
        <div
          key={c.label}
          className="hero-chip absolute inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/70 px-2.5 py-1.5 text-[10.5px] font-medium tracking-wide text-white/85 whitespace-nowrap"
          style={{ top: c.top, left: c.left, animation: `iconFloat 6s ease-in-out infinite`, animationDelay: c.delay, boxShadow: '0 8px 24px -10px rgba(0,0,0,0.7)' }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white">
            <path d="M20 6 9 17l-5-5" />
          </svg>
          {c.label}
        </div>
      ))}
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
    const tween = gsap.to(path, { strokeDashoffset: 0, duration: 2.4, ease: 'power2.inOut', delay: 1.5 });
    return () => { tween.kill(); };
  }, []);
  return (
    <svg aria-hidden viewBox="0 0 400 24"
      className="absolute left-[18%] top-[56%] w-[280px] text-accent pointer-events-none hidden md:block opacity-70">
      <path ref={ref} d="M2 14 C 80 2, 180 24, 260 10 S 380 18, 398 10"
        stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}
