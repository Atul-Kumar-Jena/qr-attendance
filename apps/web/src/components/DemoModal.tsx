'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { useEffect, useRef, useState, ReactNode } from 'react';

type Scene = { id: number; title: string; subtitle: string; duration: number; visual: () => ReactNode };

const SCENES: Scene[] = [
  {
    id: 1, title: 'Live Dashboard', subtitle: 'Real-time attendance at a glance', duration: 5000,
    visual: () => (
      <div className="w-full h-full flex flex-col gap-3 p-4">
        <div className="flex gap-3">
          {['Sessions', 'Students', 'Attendance'].map((label, i) => (
            <div key={label} className="flex-1 rounded-xl bg-cream-100 dark:bg-white/8 p-3 border border-ink/8 dark:border-white/8">
              <div className="text-[10px] text-ink-mute mb-1">{label}</div>
              <div className="text-[1.4rem] font-semibold text-ink dark:text-white" style={{ fontVariantNumeric: 'tabular-nums' }}>
                {['3', '142', '94%'][i]}
              </div>
            </div>
          ))}
        </div>
        <div className="flex-1 rounded-xl bg-cream-100 dark:bg-white/8 border border-ink/8 dark:border-white/8 overflow-hidden">
          <div className="px-4 py-2 border-b border-ink/8 dark:border-white/8 text-[11px] font-medium text-ink-mute">Recent Sessions</div>
          {['CS301 · Section A', 'MATH201 · Section B', 'PHY101 · Section C'].map((s, i) => (
            <div key={s} className="flex items-center justify-between px-4 py-2.5 border-b border-ink/5 dark:border-white/5 last:border-0"
              style={{ animation: `fadeSlideIn 0.4s ${i * 0.15}s both` }}>
              <span className="text-[12px] text-ink dark:text-white">{s}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${i === 0 ? 'bg-green-500/15 text-green-500' : 'bg-ink/8 text-ink-mute'}`}>
                {i === 0 ? 'LIVE' : 'ENDED'}
              </span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 2, title: 'QR Rotates Every Second', subtitle: 'Cryptographically signed — impossible to screenshot-reuse', duration: 4500,
    visual: () => (
      <div className="flex flex-col items-center justify-center h-full gap-5">
        <div className="relative w-32 h-32">
          <svg viewBox="0 0 128 128" className="w-full h-full">
            {Array.from({ length: 64 }, (_, i) => {
              const col = i % 8, row = Math.floor(i / 8);
              const isCorner = (col < 3 && row < 3) || (col > 4 && row < 3) || (col < 3 && row > 4);
              const fill = isCorner || (Math.sin(i * 9301 + 49297) * 233280 % 1 > 0.5);
              return fill ? (
                <rect key={i} x={col * 14 + 8} y={row * 14 + 8} width="12" height="12" rx="1.5"
                  className="fill-ink dark:fill-white"
                  style={{ animation: `qrPulse 1s ${(i % 8) * 0.05}s infinite alternate` }} />
              ) : null;
            })}
          </svg>
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 128 128" aria-hidden>
            <circle cx="64" cy="64" r="44" fill="none" stroke="var(--accent)" strokeWidth="3"
              strokeDasharray="276.46" strokeDashoffset="0"
              style={{ animation: 'qrCountdown 1s linear infinite', transformOrigin: '64px 64px', transform: 'rotate(-90deg)' }} />
          </svg>
        </div>
        <div className="text-center">
          <div className="text-[12px] font-mono text-ink-mute">Token expires in <span className="text-accent font-semibold tabular-nums">1s</span></div>
          <div className="text-[11px] text-ink-mute/60 mt-1">HMAC-signed · single-use nonce</div>
        </div>
      </div>
    ),
  },
  {
    id: 3, title: 'Student Scans on Phone', subtitle: 'Native camera — no app install needed', duration: 5000,
    visual: () => (
      <div className="flex items-center justify-center h-full gap-8">
        <div className="relative">
          <div className="w-20 h-36 rounded-2xl border-2 border-ink/30 dark:border-white/20 bg-cream-100 dark:bg-white/5 flex items-center justify-center overflow-hidden">
            <div className="w-12 h-12 rounded border border-ink/40 dark:border-white/30 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 rounded-sm bg-ink/80 dark:bg-white/80" />
              </div>
              <div className="scan-beam absolute left-0 right-0 h-0.5 bg-accent/70"
                style={{ animation: 'scanBeam 1.5s ease-in-out infinite' }} />
            </div>
          </div>
          <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center"
            style={{ animation: 'pulseGreen 1s ease-in-out infinite' }}>
            <svg width="10" height="10" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path d="M2.5 7.5l3 3 6-6" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </div>
        </div>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" aria-hidden
          style={{ animation: 'arrowPulse 0.8s ease-in-out infinite alternate' }}>
          <path d="M5 12h14M13 6l6 6-6 6"/>
        </svg>
        <div className="w-20 h-20 rounded-xl border-2 border-accent/40 bg-cream-100 dark:bg-white/5 flex items-center justify-center"
          style={{ animation: 'qrGlow 1s ease-in-out infinite alternate' }}>
          <div className="text-[10px] font-mono text-ink-mute">QR</div>
        </div>
      </div>
    ),
  },
  {
    id: 4, title: 'Spoof Attempt Blocked', subtitle: 'Mock location & VPN detection built-in', duration: 4500,
    visual: () => (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <div className="w-16 h-16 rounded-full bg-red-500/15 border-2 border-red-500/30 flex items-center justify-center"
          style={{ animation: 'shakeBounce 0.4s 0.3s ease-in-out' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" aria-hidden>
            <circle cx="12" cy="12" r="9"/><line x1="8" y1="8" x2="16" y2="16"/><line x1="16" y1="8" x2="8" y2="16"/>
          </svg>
        </div>
        <div className="text-center">
          <div className="text-[15px] font-semibold text-red-500">Attendance Rejected</div>
          <div className="text-[12px] text-ink-mute mt-1">Mock location detected</div>
        </div>
        <div className="w-full max-w-[220px] rounded-xl bg-red-500/8 border border-red-500/20 p-3 space-y-2">
          {['Mock GPS spoofing app active', 'Device not within geofence', 'Scan logged to audit trail'].map((msg, i) => (
            <div key={msg} className="flex items-center gap-2 text-[11px] text-ink-mute"
              style={{ animation: `fadeSlideIn 0.3s ${i * 0.15 + 0.4}s both` }}>
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
              {msg}
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 5, title: 'Report Generated', subtitle: 'Export CSV, PDF, or view live in dashboard', duration: 5000,
    visual: () => (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <div className="w-14 h-14 rounded-full bg-green-500/15 border-2 border-green-500/30 flex items-center justify-center"
          style={{ animation: 'bounceIn 0.5s 0.2s both' }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
            <path d="M3 12l5 5L20 7"/>
          </svg>
        </div>
        <div className="text-[14px] font-semibold text-green-500">94% attendance recorded</div>
        <div className="w-full max-w-[230px] rounded-xl border border-ink/10 dark:border-white/10 overflow-hidden">
          <div className="bg-cream-100 dark:bg-white/8 px-3 py-2 text-[10px] text-ink-mute font-medium border-b border-ink/8 dark:border-white/8">
            ATTENDANCE REPORT · CS301
          </div>
          {[['Rahul Sharma', '✓'], ['Priya Patel', '✓'], ['Amit Kumar', '✗'], ['Neha Singh', '✓']].map(([name, status], i) => (
            <div key={name} className="flex items-center justify-between px-3 py-2 border-b border-ink/5 dark:border-white/5 last:border-0"
              style={{ animation: `fadeSlideIn 0.3s ${i * 0.1 + 0.4}s both` }}>
              <span className="text-[11px] text-ink dark:text-white">{name}</span>
              <span className={`text-[12px] font-semibold ${status === '✓' ? 'text-green-500' : 'text-red-400'}`}>{status}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

interface DemoModalProps {
  trigger: ReactNode;
}

export function DemoModal({ trigger }: DemoModalProps) {
  const [open, setOpen] = useState(false);
  const [scene, setScene] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startRef = useRef<number>(0);
  const elapsed = useRef<number>(0);

  const currentScene = SCENES[scene];

  const clearTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const startTimer = () => {
    clearTimer();
    startRef.current = Date.now() - elapsed.current;
    const dur = currentScene.duration;
    intervalRef.current = setInterval(() => {
      const el = Date.now() - startRef.current;
      elapsed.current = el;
      const pct = Math.min(el / dur, 1);
      setProgress(pct);
      if (pct >= 1) {
        elapsed.current = 0;
        setScene((s) => (s + 1) % SCENES.length);
        setProgress(0);
      }
    }, 50);
  };

  useEffect(() => {
    if (!open) return;
    elapsed.current = 0;
    setProgress(0);
    if (!paused) startTimer();
    return clearTimer;
  }, [scene, open]);

  useEffect(() => {
    if (!open) return;
    if (paused) {
      clearTimer();
    } else {
      startTimer();
    }
    return clearTimer;
  }, [paused, open]);

  useEffect(() => {
    if (!open) {
      clearTimer();
      setScene(0);
      setProgress(0);
      elapsed.current = 0;
      setPaused(false);
    }
  }, [open]);

  const goTo = (idx: number) => {
    elapsed.current = 0;
    setProgress(0);
    setScene(idx);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[9998] bg-ink/50 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:fade-in" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-[9999] -translate-x-1/2 -translate-y-1/2 w-full max-w-md rounded-3xl border border-ink/10 dark:border-white/8 bg-cream-50 dark:bg-[#0D0F14] shadow-2xl overflow-hidden focus:outline-none"
          aria-describedby="demo-modal-desc"
        >
          {/* Progress bar */}
          <div className="h-0.5 bg-ink/8 dark:bg-white/8">
            <div
              className="h-full bg-accent transition-none"
              style={{ width: `${progress * 100}%` }}
            />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-ink/8 dark:border-white/8">
            <div>
              <Dialog.Title className="text-[14px] font-semibold text-ink dark:text-white">
                {currentScene.title}
              </Dialog.Title>
              <Dialog.Description id="demo-modal-desc" className="text-[11px] text-ink-mute mt-0.5">
                {currentScene.subtitle}
              </Dialog.Description>
            </div>
            <div className="flex items-center gap-2">
              {/* Pause/play */}
              <button
                onClick={() => setPaused((p) => !p)}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-ink-mute hover:text-ink dark:hover:text-white hover:bg-ink/5 transition-colors"
                aria-label={paused ? 'Play' : 'Pause'}
              >
                {paused ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M8 5.5v13l11-6.5z"/>
                  </svg>
                ) : (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
                    <rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>
                  </svg>
                )}
              </button>
              <Dialog.Close asChild>
                <button className="w-7 h-7 flex items-center justify-center rounded-lg text-ink-mute hover:text-ink dark:hover:text-white hover:bg-ink/5 transition-colors" aria-label="Close">
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden>
                    <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                </button>
              </Dialog.Close>
            </div>
          </div>

          {/* Scene visual */}
          <div className="h-56 relative overflow-hidden bg-cream-50 dark:bg-[#0D0F14]">
            {currentScene.visual()}
          </div>

          {/* Dot navigator */}
          <div className="flex items-center justify-center gap-2 py-4">
            {SCENES.map((s, i) => (
              <button
                key={s.id}
                onClick={() => goTo(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === scene ? 'w-4 h-1.5 bg-accent' : 'w-1.5 h-1.5 bg-ink/20 dark:bg-white/20 hover:bg-ink/40 dark:hover:bg-white/40'
                }`}
                aria-label={`Go to scene ${i + 1}: ${s.title}`}
              />
            ))}
          </div>

          {/* Scene counter */}
          <div className="text-center pb-4 text-[11px] text-ink-mute">
            {scene + 1} / {SCENES.length}
          </div>
        </Dialog.Content>
      </Dialog.Portal>

    </Dialog.Root>
  );
}
