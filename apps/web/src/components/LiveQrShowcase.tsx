'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { QRCodeSVG } from 'qrcode.react';
import { generateKeyPair, signQrToken, randomNonce, type QrClaims } from '@/lib/crypto';
import { useSiteConfig } from '@/context/SiteConfigContext';

export function LiveQrShowcase({
  size = 200,
  rounded = true,
  showMeta = true,
  className = '',
}: {
  size?: number;
  rounded?: boolean;
  showMeta?: boolean;
  className?: string;
}) {
  const { config } = useSiteConfig();
  const ttlSec = Math.min(5, Math.max(0.8, Number(config.defaultQrRotationSec) || 1.5));

  const [ready, setReady] = useState(false);
  const [token, setToken] = useState('');
  const [tick, setTick] = useState(0);
  const [signerFp, setSignerFp] = useState('');
  const keyRef = useRef<{ pub: string; priv: string } | null>(null);

  // DOM refs for GSAP
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgWrapRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const ring2Ref = useRef<SVGCircleElement>(null);
  const scanRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const orbitalRaf = useRef<number>(0);
  const ringAngle = useRef(0);

  // Generate ephemeral keypair
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const kp = await generateKeyPair();
        if (cancelled) return;
        keyRef.current = { pub: kp.publicKey, priv: kp.privateKey };
        setSignerFp(kp.publicKey.slice(0, 12));
        setReady(true);
      } catch {
        keyRef.current = null;
        setReady(true);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Sign fresh token on every tick
  useEffect(() => {
    if (!ready) return;
    let cancelled = false;
    (async () => {
      const claims: QrClaims = {
        v: 1, sid: 'demo-landing', t: tick,
        ts: Date.now(), ttl: Math.round(ttlSec * 1000),
        max: 1, non: keyRef.current ? randomNonce(6) : `n${tick}`,
        iss: 'attendly-demo',
      };
      try {
        if (keyRef.current) {
          const t = await signQrToken(keyRef.current.priv, claims);
          if (!cancelled) setToken(`attendly://demo?v=1&p=${t}`);
        } else {
          const fb = btoa(JSON.stringify(claims)).slice(0, 80);
          if (!cancelled) setToken(`attendly://demo?fb=${fb}`);
        }
      } catch {
        if (!cancelled) setToken(`attendly://demo?t=${tick}`);
      }
    })();
    return () => { cancelled = true; };
  }, [tick, ready, ttlSec]);

  // Rotation timer
  useEffect(() => {
    if (!ready) return;
    const t = setInterval(() => setTick((x) => x + 1), Math.round(ttlSec * 1000));
    return () => clearInterval(t);
  }, [ready, ttlSec]);

  // 3D flip on every new token
  useEffect(() => {
    if (!token || !svgWrapRef.current) return;
    gsap.fromTo(svgWrapRef.current,
      { rotateY: 65, opacity: 0, scale: 0.94 },
      { rotateY: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'expo.out' });
  }, [token]);

  // Progress bar
  useEffect(() => {
    if (!progressRef.current) return;
    gsap.killTweensOf(progressRef.current);
    gsap.fromTo(progressRef.current,
      { scaleX: 1 },
      { scaleX: 0, duration: ttlSec, ease: 'linear' });
  }, [tick, ttlSec]);

  // Orbital arc RAF loop
  const startOrbital = useCallback(() => {
    const r1 = ringRef.current;
    const r2 = ring2Ref.current;
    if (!r1 || !r2) return;

    // r is the arc radius, circumference for stroke-dasharray
    const radius = (size / 2) + 18;
    const circ = 2 * Math.PI * radius;
    r1.setAttribute('r', String(radius));
    r1.setAttribute('stroke-dasharray', `${circ * 0.28} ${circ * 0.72}`);
    r2.setAttribute('r', String(radius + 6));
    r2.setAttribute('stroke-dasharray', `${circ * 0.10} ${circ * 0.90}`);

    let lastT = 0;
    const loop = (t: number) => {
      const dt = (t - lastT) / 1000;
      lastT = t;
      ringAngle.current = (ringAngle.current + dt * 72) % 360; // 72°/s
      const r2a = (ringAngle.current * 1.55) % 360;
      r1.setAttribute('transform', `rotate(${ringAngle.current} ${size / 2 + 18} ${size / 2 + 18})`);
      r2.setAttribute('transform', `rotate(${-r2a} ${size / 2 + 18} ${size / 2 + 18})`);
      orbitalRaf.current = requestAnimationFrame(loop);
    };
    orbitalRaf.current = requestAnimationFrame(loop);
  }, [size]);

  useEffect(() => {
    if (!ready) return;
    const el = wrapRef.current;
    startOrbital(); // run by default (safe if IntersectionObserver never fires)

    // Pause the orbital-arc RAF while the QR is scrolled out of view — no point
    // spinning two SVG arcs 60×/s off-screen.
    let io: IntersectionObserver | null = null;
    if (el && typeof IntersectionObserver !== 'undefined') {
      io = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          if (!orbitalRaf.current) startOrbital();
        } else {
          cancelAnimationFrame(orbitalRaf.current);
          orbitalRaf.current = 0;
        }
      }, { threshold: 0 });
      io.observe(el);
    }

    return () => { cancelAnimationFrame(orbitalRaf.current); io?.disconnect(); };
  }, [ready, startOrbital]);

  // Scan beam sweep
  useEffect(() => {
    if (!scanRef.current) return;
    gsap.killTweensOf(scanRef.current);
    gsap.fromTo(scanRef.current,
      { y: 0, opacity: 0.7 },
      { y: size, opacity: 0, duration: ttlSec * 0.8, ease: 'power1.inOut', repeat: -1, repeatDelay: ttlSec * 0.1 });
  }, [ttlSec, size, ready]);

  const totalSize = size + 36; // QR + orbital ring clearance

  return (
    <div className={`relative inline-block select-none ${className}`}>
      <div style={{ perspective: '1400px' }}>
        <div
          ref={wrapRef}
          className={`relative bg-[#0B1220] ${rounded ? 'rounded-[20px]' : ''} shadow-[0_12px_60px_-10px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.07)]`}
          style={{ padding: 18, display: 'inline-block' }}
        >
          {/* Orbital SVG — sits over the whole card */}
          <svg
            className="absolute pointer-events-none"
            style={{ top: -18, left: -18, overflow: 'visible' }}
            width={totalSize}
            height={totalSize}
            viewBox={`0 0 ${totalSize} ${totalSize}`}
          >
            {/* Faint full ring */}
            <circle
              cx={totalSize / 2}
              cy={totalSize / 2}
              r={(size / 2) + 18}
              fill="none"
              stroke="rgba(255,107,61,0.12)"
              strokeWidth="1"
            />
            {/* Bright arc 1 — rotating */}
            <circle
              ref={ringRef}
              cx={totalSize / 2}
              cy={totalSize / 2}
              r={(size / 2) + 18}
              fill="none"
              stroke="rgba(255,107,61,0.85)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            {/* Counter-rotating arc 2 */}
            <circle
              ref={ring2Ref}
              cx={totalSize / 2}
              cy={totalSize / 2}
              r={(size / 2) + 24}
              fill="none"
              stroke="rgba(255,140,90,0.4)"
              strokeWidth="1"
              strokeLinecap="round"
            />
            {/* Corner finder squares — artistic highlight */}
            {[
              [18, 18], [size - 24, 18], [18, size - 24],
            ].map(([x, y], i) => (
              <rect
                key={i}
                x={x + 18}
                y={y + 18}
                width={8}
                height={8}
                rx={1.5}
                fill="none"
                stroke="rgba(255,107,61,0.7)"
                strokeWidth="1.5"
              />
            ))}
          </svg>

          {/* QR code — 3D flip wrapper */}
          <div
            ref={svgWrapRef}
            style={{ transformStyle: 'preserve-3d', display: 'inline-block', position: 'relative' }}
          >
            {token ? (
              <QRCodeSVG
                value={token}
                size={size}
                bgColor="transparent"
                fgColor="#FFFFFF"
                level="L"
                includeMargin={false}
                style={{
                  display: 'block',
                  filter: 'drop-shadow(0 0 3px rgba(255,255,255,0.35))',
                  imageRendering: 'pixelated',
                }}
              />
            ) : (
              <div
                style={{ width: size, height: size }}
                className="bg-white/10 animate-pulse rounded-xl"
              />
            )}

            {/* Scan beam */}
            <div
              ref={scanRef}
              className="absolute left-0 right-0 pointer-events-none"
              style={{
                top: 0,
                height: 3,
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,107,61,0.9) 30%, rgba(255,160,90,1) 50%, rgba(255,107,61,0.9) 70%, transparent 100%)',
                boxShadow: '0 0 12px rgba(255,107,61,0.8)',
              }}
            />
          </div>
        </div>
      </div>

      {showMeta && (
        <div className="mt-3 flex flex-col items-center gap-1.5">
          <div className="h-[3px] w-32 rounded-full overflow-hidden bg-white/10">
            <div ref={progressRef} className="h-full w-full bg-accent origin-left" />
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-cream-50/55">
            <span className="text-accent">●</span>
            ECDSA-P256 · TTL {ttlSec}s · sig {signerFp || '—'}…
          </div>
          <div className="text-[9.5px] tracking-[0.18em] uppercase text-cream-50/35">
            demo · unverifiable
          </div>
        </div>
      )}
    </div>
  );
}
