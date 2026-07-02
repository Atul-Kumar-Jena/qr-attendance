'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';

const SCENES = [
  {
    id: 'dashboard',
    title: 'Dashboard overview',
    sub: 'Real-time attendance across all sessions',
    dur: 5000,
    color: '#6366F1',
  },
  {
    id: 'qr',
    title: 'QR rotates every 1.5 s',
    sub: 'ECDSA-P256 signed — impossible to screenshot-spoof',
    dur: 4500,
    color: '#FF6B3D',
  },
  {
    id: 'scan',
    title: 'Student scans in',
    sub: 'Device fingerprint + geofence validated instantly',
    dur: 5000,
    color: '#22C55E',
  },
  {
    id: 'block',
    title: 'Spoof attempt blocked',
    sub: 'Mock location detected and flagged for admin review',
    dur: 4500,
    color: '#EF4444',
  },
  {
    id: 'report',
    title: 'Report generated',
    sub: 'PDF/Excel with signed attendance data, ready to export',
    dur: 5000,
    color: '#10B981',
  },
] as const;

type SceneId = typeof SCENES[number]['id'];

function SceneDashboard() {
  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex gap-3">
        {['92%', '134', '3'].map((v, i) => (
          <div key={i} className="flex-1 rounded-xl bg-white/5 border border-white/8 p-3">
            <div className="text-[22px] font-display text-white">{v}</div>
            <div className="text-[10px] text-white/40 mt-0.5">{['Attendance', 'Present', 'Sessions'][i]}</div>
          </div>
        ))}
      </div>
      {[0.9, 0.6, 1.0, 0.75].map((w, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="w-16 h-2 rounded bg-white/10" />
          <div className="flex-1 h-2 rounded bg-white/10 overflow-hidden">
            <div
              className="h-full rounded bg-[#6366F1]"
              style={{ width: `${w * 100}%`, animation: `growWidth 1s ease-out ${i * 0.15}s both` }}
            />
          </div>
          <div className="text-[10px] text-white/40 w-8">{Math.round(w * 100)}%</div>
        </div>
      ))}
    </div>
  );
}

function SceneQR({ tick }: { tick: number }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="relative w-32 h-32 rounded-2xl bg-white flex items-center justify-center shadow-[0_0_40px_rgba(255,107,61,0.4)]"
        style={{ animation: tick % 2 === 0 ? 'qrFlip 0.45s ease-out' : 'none' }}
      >
        {/* Mini QR-like grid */}
        <svg width="80" height="80" viewBox="0 0 80 80">
          {Array.from({ length: 64 }, (_, i) => {
            const x = (i % 8) * 10;
            const y = Math.floor(i / 8) * 10;
            const dark = ((i * 7 + tick * 13) % 3) !== 0;
            return dark ? (
              <rect key={i} x={x + 1} y={y + 1} width={8} height={8} rx={1.5} fill="#0B1220" />
            ) : null;
          })}
          {/* Corner finders */}
          {[[1,1],[57,1],[1,57]].map(([cx,cy],i) => (
            <g key={i}>
              <rect x={cx} y={cy} width={21} height={21} rx={2} fill="#0B1220" />
              <rect x={cx+3} y={cy+3} width={15} height={15} rx={1.5} fill="white" />
              <rect x={cx+6} y={cy+6} width={9} height={9} rx={1} fill="#0B1220" />
            </g>
          ))}
        </svg>
        {/* Scan beam */}
        <div className="absolute left-2 right-2 h-0.5 bg-[#FF6B3D] shadow-[0_0_8px_rgba(255,107,61,0.9)]"
          style={{ animation: 'scanBeam 1.5s linear infinite', top: 0 }} />
      </div>
      <div className="text-[11px] font-mono text-white/50">
        ECDSA-P256 · rotating every 1.5s · nonce #{tick}
      </div>
    </div>
  );
}

function SceneScan() {
  return (
    <div className="relative flex items-center justify-center gap-8">
      {/* Phone */}
      <div className="relative flex flex-col items-center" style={{ animation: 'phoneSlide 1.2s ease-out both' }}>
        <div className="w-14 h-24 rounded-xl bg-[#1A2236] border border-white/15 flex items-center justify-center shadow-xl">
          <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,107,61,0.9)" strokeWidth="2">
              <path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3z"/>
              <rect x="14" y="14" width="3" height="3" fill="rgba(255,107,61,0.9)"/>
              <rect x="18" y="14" width="3" height="3" fill="rgba(255,107,61,0.9)"/>
              <rect x="14" y="18" width="3" height="3" fill="rgba(255,107,61,0.9)"/>
              <rect x="18" y="18" width="3" height="3" fill="rgba(255,107,61,0.9)"/>
            </svg>
          </div>
        </div>
        <div className="text-[9px] text-white/40 mt-2">Student device</div>
      </div>
      {/* Arrow with check */}
      <div className="flex flex-col items-center gap-1" style={{ animation: 'fadeIn 0.8s 0.8s ease both' }}>
        <div className="flex items-center gap-1">
          <div className="w-8 h-px bg-[#22C55E]" />
          <div className="w-4 h-4 rounded-full bg-[#22C55E] flex items-center justify-center">
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
              <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
        </div>
        <div className="text-[8px] text-[#22C55E] font-mono">verified</div>
      </div>
      {/* Server */}
      <div className="flex flex-col items-center" style={{ animation: 'fadeIn 0.6s 0.3s ease both' }}>
        <div className="w-14 h-20 rounded-xl bg-[#1A2236] border border-[#22C55E]/40 flex flex-col items-center justify-center gap-2 shadow-xl">
          {[0,1,2].map(i => (
            <div key={i} className="w-8 h-1.5 rounded bg-[#22C55E]/40" />
          ))}
        </div>
        <div className="text-[9px] text-white/40 mt-2">Attendly server</div>
      </div>
    </div>
  );
}

function SceneBlock() {
  return (
    <div className="flex flex-col items-center gap-4" style={{ animation: 'shakeIn 0.5s ease both' }}>
      <div className="w-20 h-20 rounded-full bg-red-500/15 border-2 border-red-500/50 flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.35)]">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
          <path d="M18 6L6 18M6 6l12 12" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
      </div>
      <div className="text-center">
        <div className="text-[13px] font-medium text-red-400">Spoof detected</div>
        <div className="text-[10px] text-white/40 mt-1 font-mono">mock_location=true · flagged</div>
      </div>
      <div className="w-full rounded-xl bg-red-500/8 border border-red-500/20 p-3 space-y-2">
        {['Mock GPS location detected', 'Device not bound to account', 'Previous scan: 0.2s ago'].map((t, i) => (
          <div key={i} className="flex items-center gap-2 text-[11px] text-red-300/80" style={{ animation: `fadeIn 0.4s ${i * 0.15}s ease both` }}>
            <span className="text-red-500 text-[8px]">●</span>{t}
          </div>
        ))}
      </div>
    </div>
  );
}

function SceneReport() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-20 h-20 rounded-full bg-emerald-500/15 border-2 border-emerald-500/50 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.35)]" style={{ animation: 'popIn 0.5s ease both' }}>
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
          <path d="M5 12l5 5L20 7" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="30" strokeDashoffset="30" style={{ animation: 'drawCheck 0.6s 0.3s ease forwards' }} />
        </svg>
      </div>
      <div className="w-full rounded-xl bg-emerald-500/8 border border-emerald-500/20 p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="text-[11px] text-emerald-400 font-medium">Attendance Report</div>
          <div className="text-[9px] text-white/30 font-mono">PDF · XLSX</div>
        </div>
        {['Rahul Sharma · Present · 09:04 AM', 'Priya Nair · Present · 09:05 AM', 'Ankit Verma · Absent'].map((row, i) => (
          <div key={i} className="flex items-center gap-2 py-1.5 border-b border-white/5 last:border-0 text-[10px] text-white/60" style={{ animation: `slideUp 0.4s ${0.4 + i * 0.12}s ease both`, opacity: 0, transform: 'translateY(8px)' }}>
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${row.includes('Absent') ? 'bg-red-400' : 'bg-emerald-400'}`} />
            {row}
          </div>
        ))}
      </div>
    </div>
  );
}

export function DemoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [scene, setScene] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [qrTick, setQrTick] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const goScene = useCallback((idx: number) => {
    setScene(idx);
    if (progressRef.current) {
      gsap.killTweensOf(progressRef.current);
      if (playing) {
        gsap.fromTo(progressRef.current, { scaleX: 0 }, { scaleX: 1, duration: SCENES[idx].dur / 1000, ease: 'none' });
      }
    }
  }, [playing]);

  // Auto-advance
  useEffect(() => {
    if (!open || !playing) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setScene((s) => (s + 1) % SCENES.length);
    }, SCENES[scene].dur);
    if (progressRef.current) {
      gsap.killTweensOf(progressRef.current);
      gsap.fromTo(progressRef.current, { scaleX: 0 }, { scaleX: 1, duration: SCENES[scene].dur / 1000, ease: 'none' });
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [scene, playing, open]);

  // QR tick
  useEffect(() => {
    const t = setInterval(() => setQrTick((x) => x + 1), 1500);
    return () => clearInterval(t);
  }, []);

  // Open/close animation
  useEffect(() => {
    if (!overlayRef.current || !cardRef.current) return;
    if (open) {
      setScene(0);
      setPlaying(true);
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
      gsap.fromTo(cardRef.current, { y: 40, opacity: 0, scale: 0.94 }, { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'expo.out' });
    } else {
      gsap.to(cardRef.current, { y: 20, opacity: 0, scale: 0.96, duration: 0.25, ease: 'power2.in' });
    }
  }, [open]);

  // Keyboard close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (typeof window === 'undefined') return null;
  if (!open) return null;

  const current = SCENES[scene];

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        ref={cardRef}
        className="relative w-full max-w-lg rounded-3xl bg-[#0D0F14] border border-white/10 shadow-2xl overflow-hidden"
        style={{ maxHeight: '90vh' }}
      >
        {/* Scene progress bar */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/8">
          <div
            ref={progressRef}
            className="h-full origin-left"
            style={{ background: current.color }}
          />
        </div>

        {/* Scene dots */}
        <div className="absolute top-4 left-0 right-0 flex justify-center gap-1.5 z-10">
          {SCENES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => { goScene(i); }}
              className="transition-all duration-300 rounded-full"
              style={{
                width: i === scene ? 20 : 6,
                height: 6,
                background: i === scene ? s.color : 'rgba(255,255,255,0.2)',
              }}
            />
          ))}
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-4 z-10 w-7 h-7 rounded-full bg-white/8 hover:bg-white/15 flex items-center justify-center transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M1 1l10 10M11 1L1 11" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Header */}
        <div className="pt-12 px-6 pb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-white/30">
              {String(scene + 1).padStart(2, '0')} / {SCENES.length}
            </span>
            <span className="w-1 h-1 rounded-full" style={{ background: current.color }} />
          </div>
          <h3 className="text-[18px] font-display text-white">{current.title}</h3>
          <p className="text-[12px] text-white/45 mt-0.5">{current.sub}</p>
        </div>

        {/* Scene content */}
        <div className="px-6 pb-6 min-h-[220px] flex items-center justify-center">
          {scene === 0 && <SceneDashboard />}
          {scene === 1 && <SceneQR tick={qrTick} />}
          {scene === 2 && <SceneScan />}
          {scene === 3 && <SceneBlock />}
          {scene === 4 && <SceneReport />}
        </div>

        {/* Controls */}
        <div className="px-6 pb-5 flex items-center justify-between">
          <button
            onClick={() => setPlaying((p) => !p)}
            className="flex items-center gap-1.5 text-[11px] text-white/40 hover:text-white/70 transition-colors"
          >
            {playing ? (
              <><svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><rect x="2" y="1" width="3" height="10" rx="1"/><rect x="7" y="1" width="3" height="10" rx="1"/></svg>Pause</>
            ) : (
              <><svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><path d="M2 1l9 5-9 5V1z"/></svg>Play</>
            )}
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => goScene((scene - 1 + SCENES.length) % SCENES.length)}
              className="w-8 h-8 rounded-full bg-white/8 hover:bg-white/15 flex items-center justify-center transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M7 2L3 6l4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
            <button
              onClick={() => scene < SCENES.length - 1 ? goScene(scene + 1) : onClose()}
              className="flex items-center gap-1.5 rounded-full px-4 h-8 text-[11px] font-medium text-white transition-colors"
              style={{ background: current.color }}
            >
              {scene < SCENES.length - 1 ? 'Next' : 'Done'}
              {scene < SCENES.length - 1 && (
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                  <path d="M5 2l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes growWidth { from { width: 0 } }
        @keyframes qrFlip { from { transform: rotateY(70deg) scale(0.94); opacity:0 } }
        @keyframes scanBeam { 0% { top: 0; opacity: 0.7 } 90% { top: 100%; opacity: 0 } 100% { top: 0; opacity: 0 } }
        @keyframes phoneSlide { from { transform: translateX(-40px); opacity: 0 } }
        @keyframes fadeIn { from { opacity: 0 } }
        @keyframes shakeIn { 0% { transform: scale(0.8); opacity: 0 } 60% { transform: scale(1.05) } 100% { transform: scale(1); opacity: 1 } }
        @keyframes popIn { 0% { transform: scale(0.5); opacity: 0 } 70% { transform: scale(1.1) } 100% { transform: scale(1); opacity: 1 } }
        @keyframes drawCheck { to { stroke-dashoffset: 0 } }
        @keyframes slideUp { to { opacity: 1; transform: translateY(0) } }
      `}</style>
    </div>,
    document.body
  );
}
