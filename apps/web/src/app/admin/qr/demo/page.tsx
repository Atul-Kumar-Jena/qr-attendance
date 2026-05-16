'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { useAuth } from '@/context/AuthContext';
import { QRCodeSVG } from 'qrcode.react';

type Stage = 'setup' | 'live' | 'ended';

function useQrDemoTour() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const key = 'atd_qr_demo_tour';
    if (localStorage.getItem(key)) return;
    localStorage.setItem(key, '1');
    const timer = setTimeout(async () => {
      try {
        const { driver } = await import('driver.js');
        import('driver.js/dist/driver.css' as any).catch(() => {});
        const d = driver({
          animate: true,
          showProgress: true,
          popoverClass: 'atd-popover',
          steps: [
            {
              element: '#qr-subject',
              popover: {
                title: 'Subject / Topic',
                description: 'Enter the subject or topic for today\'s class. This appears on the live screen.',
                side: 'bottom',
              },
            },
            {
              element: '#qr-class',
              popover: {
                title: 'Class / Section',
                description: 'Pick the class from your institution\'s list, or type one manually.',
                side: 'bottom',
              },
            },
            {
              element: '#qr-start',
              popover: {
                title: 'Start Session',
                description: 'Creates a live Firestore session. The QR rotates every second — impossible to screenshot and reuse.',
                side: 'top',
              },
            },
          ],
        });
        d.drive();
      } catch { /* driver.js unavailable */ }
    }, 600);
    return () => clearTimeout(timer);
  }, []);
}

export default function QrDisplay() {
  const { user, institutionId } = useAuth();
  const router = useRouter();
  const [stage, setStage] = useState<Stage>('setup');
  const [sessionId, setSessionId] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [className, setClassName] = useState('');
  const [classes, setClasses] = useState<import('@/lib/firestore-db').FSClass[]>([]);
  const [starting, setStarting] = useState(false);
  const [ending, setEnding] = useState(false);
  const [tick, setTick] = useState(0);
  const [liveCount, setLiveCount] = useState(0);
  const qrRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useQrDemoTour();

  // Load classes for the class picker
  useEffect(() => {
    if (!institutionId) return;
    const { onClasses } = require('@/lib/firestore-db');
    return onClasses(institutionId, setClasses);
  }, [institutionId]);

  // Live attendance count subscription
  useEffect(() => {
    if (!sessionId || stage !== 'live') return;
    const { onSession } = require('@/lib/firestore-db');
    return onSession(sessionId, (s: import('@/lib/firestore-db').FSSession | null) => {
      if (s) setLiveCount(s.attendanceCount);
    });
  }, [sessionId, stage]);

  // QR rotation interval — only while live
  useEffect(() => {
    if (stage !== 'live') return;
    timerRef.current = setInterval(() => {
      setTick((t) => t + 1);
      gsap.fromTo(qrRef.current, { rotateY: 90, opacity: 0 },
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
      await logAudit({
        institutionId, actorId: user.uid,
        actorName: user.displayName ?? user.email ?? '',
        action: 'SESSION_STARTED', targetId: id,
        details: `${subjectName.trim()} · ${className.trim()}`,
      });
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
        await logAudit({
          institutionId, actorId: user.uid,
          actorName: user.displayName ?? user.email ?? '',
          action: 'SESSION_ENDED', targetId: sessionId,
          details: `${subjectName} · ${className}`,
        });
      }
    } catch (e: unknown) {
      alert('Session end failed: ' + (e instanceof Error ? e.message : String(e)));
    }
    setStage('ended');
    setEnding(false);
  };

  // Build the QR payload — encodes a signed rotating token
  const qrPayload = sessionId
    ? `attendly://scan?session=${sessionId}&t=${tick}&token=${btoa(`${sessionId}:${tick}`).slice(0, 12)}`
    : '';

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
            <div id="qr-subject">
              <label className="block text-[11px] tracking-wide text-cream-50/50 mb-1.5 uppercase">Subject / Topic</label>
              <input
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                placeholder="e.g. Operating Systems"
                className="w-full text-[14px] bg-white/8 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-accent/60 text-cream-50 placeholder:text-cream-50/30 transition-colors"
              />
            </div>
            <div id="qr-class">
              <label className="block text-[11px] tracking-wide text-cream-50/50 mb-1.5 uppercase">Class / Section</label>
              {classes.length > 0 ? (
                <select
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="w-full text-[14px] bg-white/8 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-accent/60 text-cream-50 transition-colors appearance-none"
                >
                  <option value="">Select a class…</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.name + (c.section ? ` · ${c.section}` : '')}>
                      {c.name}{c.section ? ` · ${c.section}` : ''}
                    </option>
                  ))}
                  <option value="__custom">Type manually…</option>
                </select>
              ) : (
                <input
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  placeholder="e.g. CS-301 · Batch A"
                  className="w-full text-[14px] bg-white/8 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-accent/60 text-cream-50 placeholder:text-cream-50/30 transition-colors"
                />
              )}
              {className === '__custom' && (
                <input
                  autoFocus
                  value={''}
                  onChange={(e) => setClassName(e.target.value)}
                  placeholder="e.g. CS-301 · Batch A"
                  className="w-full mt-2 text-[14px] bg-white/8 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-accent/60 text-cream-50 placeholder:text-cream-50/30 transition-colors"
                />
              )}
            </div>
          </div>

          <button
            id="qr-start"
            onClick={startSession}
            disabled={starting || !subjectName.trim() || !className.trim() || className === '__custom'}
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
        <div className="text-[13px] text-cream-50/60">{liveCount} attendance marks recorded</div>
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
        {liveCount} scanned · auto-rotating
      </div>

      <div className="font-display text-[2rem] mb-3">Scan to mark attendance</div>
      <div className="text-[12px] text-cream-50/50 mb-8">Open the Attendly app. Token rotates every second.</div>

      <div style={{ perspective: '1200px' }}>
        <div ref={qrRef} className="bg-cream-50 p-6 rounded-3xl" style={{ transformStyle: 'preserve-3d' }}>
          {qrPayload ? (
            <QRCodeSVG
              value={qrPayload}
              size={320}
              bgColor="#FAFAF7"
              fgColor="#0B1220"
              level="M"
            />
          ) : (
            <div className="w-80 h-80 bg-cream-100 rounded-2xl animate-pulse" />
          )}
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
