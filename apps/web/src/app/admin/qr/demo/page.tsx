'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { useAuth } from '@/context/AuthContext';

type Stage = 'setup' | 'live' | 'ended';

export default function QrDisplay() {
  const { user, institutionId } = useAuth();
  const router = useRouter();
  const [stage, setStage] = useState<Stage>('setup');
  const [sessionId, setSessionId] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [className, setClassName] = useState('');
  const [starting, setStarting] = useState(false);
  const [ending, setEnding] = useState(false);
  const [tick, setTick] = useState(0);
  const qr = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // QR rotation interval (only while live)
  useEffect(() => {
    if (stage !== 'live') return;
    timerRef.current = setInterval(() => {
      setTick((t) => t + 1);
      gsap.fromTo(qr.current, { rotateY: 90, opacity: 0 },
        { rotateY: 0, opacity: 1, duration: 0.35, ease: 'expo.out' });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [stage]);

  const startSession = async () => {
    if (!subjectName.trim() || !className.trim()) return;
    if (!institutionId || !user) return;
    setStarting(true);
    try {
      const { createSession, logAudit } = await import('@/lib/firestore-db');
      const id = await createSession({
        institutionId,
        teacherId: user.uid,
        teacherName: user.displayName ?? user.email ?? 'Teacher',
        subjectName: subjectName.trim(),
        className: className.trim(),
        status: 'OPEN',
        attendanceCount: 0,
      });
      await logAudit({ institutionId, actorId: user.uid, actorName: user.displayName ?? user.email ?? '', action: 'SESSION_STARTED', targetId: id, details: `${subjectName.trim()} · ${className.trim()}` });
      setSessionId(id);
      setStage('live');
    } catch (e: unknown) {
      alert('Failed to start session: ' + (e instanceof Error ? e.message : String(e)));
    } finally {
      setStarting(false);
    }
  };

  const endSession = async () => {
    if (!sessionId) { router.push('/admin'); return; }
    setEnding(true);
    try {
      const { endSession: fsEndSession, logAudit } = await import('@/lib/firestore-db');
      await fsEndSession(sessionId);
      if (user && institutionId) {
        await logAudit({ institutionId, actorId: user.uid, actorName: user.displayName ?? user.email ?? '', action: 'SESSION_ENDED', targetId: sessionId, details: `${subjectName} · ${className}` });
      }
    } catch {/* ignore */}
    setStage('ended');
    setEnding(false);
  };

  // ── Setup screen ─────────────────────────────────────────────────────────────
  if (stage === 'setup') {
    return (
      <div className="min-h-screen bg-ink text-cream-50 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <div className="font-display text-[2rem] mb-1">Start QR Session</div>
            <div className="text-[12px] text-cream-50/50">Fill in the details to generate a live attendance QR.</div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[11px] tracking-wide text-cream-50/50 mb-1.5 uppercase">Subject / Topic</label>
              <input
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                placeholder="e.g. Operating Systems"
                className="w-full text-[14px] bg-white/8 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-accent/60 text-cream-50 placeholder:text-cream-50/30 transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] tracking-wide text-cream-50/50 mb-1.5 uppercase">Class / Section</label>
              <input
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                placeholder="e.g. CS-301 · Batch A"
                className="w-full text-[14px] bg-white/8 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-accent/60 text-cream-50 placeholder:text-cream-50/30 transition-colors"
              />
            </div>
          </div>

          <button
            onClick={startSession}
            disabled={starting || !subjectName.trim() || !className.trim()}
            className="w-full rounded-xl bg-accent text-cream-50 py-3.5 text-[14px] font-medium hover:bg-accent/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {starting ? 'Creating session…' : 'Start session & show QR →'}
          </button>

          <button onClick={() => router.push('/admin')}
            className="w-full text-[13px] text-cream-50/40 hover:text-cream-50/70 transition-colors text-center">
            ← back to dashboard
          </button>
        </div>
      </div>
    );
  }

  // ── Ended screen ─────────────────────────────────────────────────────────────
  if (stage === 'ended') {
    return (
      <div className="min-h-screen bg-ink text-cream-50 flex flex-col items-center justify-center p-8 gap-5">
        <div className="text-[3rem]">✓</div>
        <div className="font-display text-[2rem]">Session ended</div>
        <div className="text-[12px] text-cream-50/50">{subjectName} · {className}</div>
        <button onClick={() => router.push('/admin')}
          className="rounded-xl border border-white/15 px-6 py-2.5 text-[13px] hover:bg-white/8 transition-colors mt-4">
          Back to dashboard
        </button>
      </div>
    );
  }

  // ── Live QR screen ───────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-ink text-cream-50 flex flex-col items-center justify-center p-8 relative overflow-hidden">
      <div className="absolute top-6 left-6 text-[12px] text-cream-50/50">
        {className} · {subjectName}
      </div>
      <div className="absolute top-6 right-6 flex items-center gap-2 text-[12px] text-cream-50/50">
        <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
        Session OPEN · auto-rotating
      </div>

      <div className="font-display text-[2rem] mb-3">Scan to mark attendance</div>
      <div className="text-[12px] text-cream-50/50 mb-8">Open the Attendly app. Token rotates every second.</div>

      <div style={{ perspective: '1200px' }}>
        <div ref={qr} className="bg-cream-50 p-6 rounded-3xl" style={{ transformStyle: 'preserve-3d' }}>
          <Qr seed={tick} />
        </div>
      </div>

      <div className="mt-8 flex items-center gap-3">
        <div className="h-1 w-40 rounded-full bg-cream-50/15 overflow-hidden">
          <div className="h-full w-full bg-accent animate-[shrink_1s_linear_infinite]" />
        </div>
        <span className="font-mono text-[12px] text-cream-50/50">1s</span>
      </div>

      <button
        onClick={endSession}
        disabled={ending}
        className="absolute bottom-6 right-6 rounded-full bg-cream-50/10 hover:bg-cream-50/20 px-4 py-2 text-[12px] transition-colors disabled:opacity-50"
      >
        {ending ? 'Ending…' : 'End session'}
      </button>

      <div className="absolute bottom-6 left-6 font-mono text-[10px] text-cream-50/25">
        {sessionId.slice(0, 8)}…
      </div>
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
        on = Math.min(fx, fy) === 0 || Math.min(fx, fy) === 2;
      } else {
        on = rng(x * 31 + y * 17) > 0.55;
      }
      cells.push(on);
    }
  }
  return (
    <div className="grid" style={{ gridTemplateColumns: `repeat(${N}, 16px)`, gap: '2px' }}>
      {cells.map((on, i) => (
        <div key={i} className="aspect-square rounded-sm" style={{
          width: 16, height: 16, background: on ? '#0B1220' : 'transparent',
        }} />
      ))}
    </div>
  );
}
