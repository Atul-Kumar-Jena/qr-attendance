'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { QRCodeSVG } from 'qrcode.react';
import { generateKeyPair, signQrToken, randomNonce, type QrClaims } from '@/lib/crypto';
import { useSiteConfig } from '@/context/SiteConfigContext';

/**
 * Live, real-ECDSA-signed rotating QR for the landing page.
 *
 * The keypair is generated in-memory only — the public half is never
 * published anywhere, so even though the QR rotates with valid signatures,
 * no production verifier will accept it. Visually identical to the real
 * admin QR; safe for marketing.
 *
 * Rotation duration comes from SiteConfig.defaultQrRotationSec, which
 * admins can change live; the component animates smoothly to the new TTL.
 */
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
  const qrRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // Generate ephemeral demo keypair once
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
        // Web Crypto unavailable (old browser) — fall back to plain animated string
        keyRef.current = null;
        setReady(true);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Sign a fresh token on every tick (or generate fallback string)
  useEffect(() => {
    if (!ready) return;
    let cancelled = false;
    (async () => {
      const claims: QrClaims = {
        v: 1,
        sid: 'demo-landing',
        t: tick,
        ts: Date.now(),
        ttl: Math.round(ttlSec * 1000),
        max: 1,
        non: keyRef.current ? randomNonce(6) : `n${tick}`,
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

  // Rotation timer — restarts cleanly whenever ttlSec changes
  useEffect(() => {
    if (!ready) return;
    const intervalMs = Math.round(ttlSec * 1000);
    const t = setInterval(() => setTick((x) => x + 1), intervalMs);

    // 3-D flip on tick using GSAP
    return () => clearInterval(t);
  }, [ready, ttlSec]);

  // Flip animation on every new token
  useEffect(() => {
    if (!token || !qrRef.current) return;
    gsap.fromTo(qrRef.current,
      { rotateY: 70, opacity: 0, scale: 0.96 },
      { rotateY: 0, opacity: 1, scale: 1, duration: 0.45, ease: 'expo.out' });
  }, [token]);

  // Restart progress bar on every tick
  useEffect(() => {
    if (!progressRef.current) return;
    gsap.killTweensOf(progressRef.current);
    gsap.fromTo(progressRef.current,
      { scaleX: 1 },
      { scaleX: 0, duration: ttlSec, ease: 'linear' });
  }, [tick, ttlSec]);

  return (
    <div className={`relative ${className}`}>
      <div style={{ perspective: '1200px' }}>
        <div
          ref={qrRef}
          style={{ transformStyle: 'preserve-3d' }}
          className={`bg-white p-3 ${rounded ? 'rounded-2xl' : ''} shadow-[0_8px_40px_-10px_rgba(0,0,0,0.35)] inline-block`}
        >
          {token ? (
            <QRCodeSVG
              value={token}
              size={size}
              bgColor="#FFFFFF"
              fgColor="#0B1220"
              level="L"
              includeMargin={false}
            />
          ) : (
            <div style={{ width: size, height: size }} className="bg-cream-100 animate-pulse rounded-xl" />
          )}
        </div>
      </div>

      {showMeta && (
        <div className="mt-3 flex flex-col items-center gap-1.5">
          <div className="h-[3px] w-32 rounded-full overflow-hidden bg-cream-50/15">
            <div
              ref={progressRef}
              className="h-full w-full bg-accent origin-left"
            />
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-cream-50/55">
            <span className="text-accent">●</span>
            ECDSA-P256 · TTL {ttlSec}s · sig {signerFp || '—'}…
          </div>
          <div className="text-[9.5px] tracking-[0.18em] uppercase text-cream-50/40">
            demo · unverifiable
          </div>
        </div>
      )}
    </div>
  );
}
