'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

/**
 * Full-screen live QR display. In real use it subscribes to the
 * /sessions WebSocket and receives a `qr:tick` every rotation; here we
 * generate a local random payload purely for visual demo.
 */
export default function QrDisplay() {
  const [tick, setTick] = useState(0);
  const [remaining, setRemaining] = useState(7);
  const qr = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const i = setInterval(() => {
      setTick((t) => t + 1);
      setRemaining(7);
      gsap.fromTo(qr.current, { rotateY: 90, opacity: 0 },
        { rotateY: 0, opacity: 1, duration: 0.6, ease: 'expo.out' });
    }, 7000);
    const c = setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1000);
    return () => { clearInterval(i); clearInterval(c); };
  }, []);

  return (
    <div className="min-h-screen bg-ink text-cream-50 flex flex-col items-center justify-center p-8 relative overflow-hidden">
      <div className="absolute top-6 left-6 text-[12px] text-cream-50/50">
        CS-301 · Operating Systems · Prof. Sharma
      </div>
      <div className="absolute top-6 right-6 text-[12px] text-cream-50/50">
        Session OPEN · auto-rotating
      </div>

      <div className="font-display text-[2rem] mb-3">Scan to mark attendance</div>
      <div className="text-[12px] text-cream-50/50 mb-8">Open the Attendly app. Token rotates every 7 seconds.</div>

      <div style={{ perspective: '1200px' }}>
        <div ref={qr} className="bg-cream-50 p-6 rounded-3xl" style={{ transformStyle: 'preserve-3d' }}>
          <Qr seed={tick} />
        </div>
      </div>

      <div className="mt-8 flex items-center gap-3">
        <div className="h-1.5 w-40 rounded-full bg-cream-50/15 overflow-hidden">
          <div
            className="h-full bg-accent transition-all duration-1000 linear"
            style={{ width: `${(remaining / 7) * 100}%` }}
          />
        </div>
        <span className="font-mono text-[12px] text-cream-50/70">{remaining}s</span>
      </div>

      <button className="absolute bottom-6 right-6 rounded-full bg-cream-50/10 hover:bg-cream-50/20 px-4 py-2 text-[12px]">
        End session
      </button>
    </div>
  );
}

function Qr({ seed }: { seed: number }) {
  const N = 21;
  const rng = (i: number) => {
    const x = Math.sin((i + seed * 91) * 9301 + 49297) * 233280;
    return x - Math.floor(x);
  };
  const isFinder = (x: number, y: number) =>
    (x < 7 && y < 7) || (x >= N - 7 && y < 7) || (x < 7 && y >= N - 7);

  const cells = [];
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      let on = false;
      if (isFinder(x, y)) {
        const lx = x >= N - 7 ? x - (N - 7) : x;
        const ly = y >= N - 7 ? y - (N - 7) : y;
        const fx = Math.min(lx, 6 - lx);
        const fy = Math.min(ly, 6 - ly);
        const ring = Math.min(fx, fy);
        on = ring === 0 || ring === 2;
      } else {
        on = rng(x * 31 + y * 17) > 0.55;
      }
      cells.push(on);
    }
  }
  return (
    <div className="grid" style={{
      gridTemplateColumns: `repeat(${N}, 16px)`,
      gap: '2px',
    }}>
      {cells.map((on, i) => (
        <div key={i} className="aspect-square rounded-sm" style={{
          width: 16, height: 16, background: on ? '#0B1220' : 'transparent',
        }} />
      ))}
    </div>
  );
}
