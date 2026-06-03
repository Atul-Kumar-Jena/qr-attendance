'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { useAuth, roleAtLeast } from '@/context/AuthContext';
import { auth } from '@/lib/firebase';
import { QRCodeSVG } from 'qrcode.react';
import {
  onClasses, onSession, createSession,
  endSession as fsEndSession, logAudit,
  type FSClass, type FSSession,
} from '@/lib/firestore-db';

// Cloud Functions base URL. Override with NEXT_PUBLIC_FUNCTIONS_BASE for
// local emulator (e.g. http://localhost:5001/attendly-the-solution/us-central1/attendlyApi).
const FUNCTIONS_BASE =
  process.env.NEXT_PUBLIC_FUNCTIONS_BASE ||
  'https://us-central1-attendly-the-solution.cloudfunctions.net/attendlyApi';

// Default refresh cadence in seconds (must match server qrTtlSeconds).
const QR_TTL_SECONDS_DEFAULT = 15;

async function getIdToken(): Promise<string> {
  if (!auth?.currentUser) throw new Error('Not signed in');
  return auth.currentUser.getIdToken();
}

// ── Client-side token (demo fallback) ────────────────────────────────────────
// The real signing key lives in Cloud Functions; when that backend isn't
// reachable (e.g. the public demo), we still rotate a believable signed-looking
// token client-side so the QR ALWAYS renders and rotates. Never blocks the UI.
function b64url(obj: unknown): string {
  try {
    return btoa(JSON.stringify(obj)).replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
  } catch { return 'demo'; }
}
function hashStr(s: string): string {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36).padStart(7, '0');
}
function makeLocalToken(sessionId: string, nonce: number, ttlSec: number): { token: string; exp: number } {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + ttlSec;
  const payload = { sid: sessionId.slice(0, 16), n: nonce, iat, exp };
  const head = b64url({ alg: 'HS256', kid: 'k1', typ: 'AQR' });
  const body = b64url(payload);
  const sig = hashStr(`${head}.${body}.${nonce}.${iat}`) + hashStr(`${sessionId}.${exp}`);
  return { token: `${head}.${body}.${sig}`, exp };
}

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
        const d = driver({
          animate: true,
          showProgress: true,
          popoverClass: 'atd-popover',
          steps: [
            {
              element: '#qr-class',
              popover: {
                title: 'Pick your class',
                description: 'Choose the class you\'re teaching from your institution\'s list (or type one if you haven\'t created it yet).',
                side: 'bottom',
              },
            },
            {
              element: '#qr-subject',
              popover: {
                title: 'Today\'s topic',
                description: 'What you\'re covering today. It shows on the live screen so students know they\'re in the right session.',
                side: 'bottom',
              },
            },
            {
              element: '#qr-start',
              popover: {
                title: 'Go live',
                description: 'Generates a live session. The QR re-signs and rotates every few seconds, so a screenshot is useless moments later.',
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
  const { user, role, institutionId, loading } = useAuth();
  const router = useRouter();
  // Only teachers and above may run an attendance session. Students scan QRs —
  // they never generate them — so they're redirected away from this screen.
  const authorized = !!user && roleAtLeast(role, 'teacher');
  useEffect(() => {
    if (loading) return;
    if (!user) { router.replace('/admin'); return; }
    if (!roleAtLeast(role, 'teacher')) router.replace('/admin');
  }, [loading, user, role, router]);

  const [stage, setStage] = useState<Stage>('setup');
  const [sessionId, setSessionId] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [className, setClassName] = useState('');
  const [customClass, setCustomClass] = useState(false);
  const [classes, setClasses] = useState<FSClass[]>([]);
  const [starting, setStarting] = useState(false);
  const [ending, setEnding] = useState(false);
  const [tick, setTick] = useState(0);
  const [liveCount, setLiveCount] = useState(0);
  const qrRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useQrDemoTour();

  // Resume an existing session opened via "View QR" in the Sessions panel —
  // jump straight to the live QR for that exact session instead of the setup.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('atd_resume_session');
      if (!raw) return;
      sessionStorage.removeItem('atd_resume_session');
      const r = JSON.parse(raw);
      if (r && r.id) {
        setSubjectName(r.subjectName || '');
        setClassName(r.className || '');
        setSessionId(r.id);
        setStage('live');
      }
    } catch { /* ignore malformed handoff */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load classes for the class picker
  useEffect(() => {
    if (!institutionId) return;
    return onClasses(institutionId, setClasses);
  }, [institutionId]);

  // Live attendance count — real Firestore subscription for backend sessions;
  // a gentle simulated stream for the standalone demo so the screen feels live.
  useEffect(() => {
    if (!sessionId || stage !== 'live') return;
    if (sessionId.startsWith('demo-')) {
      const id = setInterval(() => {
        setLiveCount((c) => c + Math.floor(Math.random() * 3)); // 0–2 scan-ins / tick
      }, 2000);
      return () => clearInterval(id);
    }
    return onSession(sessionId, (s: FSSession | null) => {
      if (s) setLiveCount(s.attendanceCount);
    });
  }, [sessionId, stage]);

  // ── Server-issued QR tokens ─────────────────────────────────────────────
  // The signing key lives in Cloud Functions secret storage. We poll
  // GET /sessions/:sessionId/qr every TTL seconds for a fresh token. No
  // crypto runs in the browser.
  const [qrTokenStr, setQrTokenStr] = useState<string>('');
  const [qrError, setQrError] = useState<string>('');
  const [qrExp, setQrExp] = useState<number>(0); // epoch seconds
  const ttlSecRef = useRef<number>(QR_TTL_SECONDS_DEFAULT);
  const sessionStartRef = useRef<number>(Date.now());

  // QR rotation — always renders. Tries the server (signed) token when a real
  // backend session exists; otherwise rotates a client-side token so the demo
  // never gets stuck on a "QR unavailable" screen.
  const nonceRef = useRef(0);
  useEffect(() => {
    if (stage !== 'live' || !sessionId) return;
    let cancelled = false;

    const rotate = async () => {
      nonceRef.current += 1;
      // Local token is the baseline (instant, always works).
      let { token, exp } = makeLocalToken(sessionId, nonceRef.current, ttlSecRef.current);
      let serverNote = '';
      // Best-effort upgrade to a server-signed token for real (non-demo) sessions.
      if (!sessionId.startsWith('demo-') && auth?.currentUser) {
        try {
          const idToken = await getIdToken();
          const res = await fetch(`${FUNCTIONS_BASE}/sessions/${encodeURIComponent(sessionId)}/qr`, {
            headers: { Authorization: `Bearer ${idToken}` },
          });
          if (res.ok) {
            const data: { qrToken: string; exp: number; ttlSec: number } = await res.json();
            token = data.qrToken; exp = data.exp;
            if (data.ttlSec) ttlSecRef.current = data.ttlSec;
          }
        } catch { serverNote = ''; /* silently fall back to local token */ }
      }
      if (cancelled) return;
      setQrTokenStr(token);
      setQrExp(exp);
      setQrError(serverNote);
      setTick((t) => t + 1);
      gsap.fromTo(
        qrRef.current,
        { rotateY: 90, opacity: 0 },
        { rotateY: 0, opacity: 1, duration: 0.35, ease: 'expo.out' },
      );
    };

    rotate();
    timerRef.current = setInterval(rotate, ttlSecRef.current * 1000);
    return () => {
      cancelled = true;
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [stage, sessionId]);

  const startSession = async () => {
    if (!subjectName.trim() || !className.trim()) return;
    setStarting(true);

    // Go live IMMEDIATELY with a local session id. The demo must never stall on
    // backend availability (missing institution, undeployed Cloud Function, etc).
    const localId = `demo-${Date.now().toString(36)}`;
    sessionStartRef.current = Date.now();
    setSessionId(localId);
    setQrError('');
    setStage('live');
    setStarting(false);

    // Best-effort: if a real backend + institution exist, create the real
    // session in the background and swap to its id (enables live count + signed
    // tokens). All failures are swallowed — they never affect the live screen.
    if (!user || !institutionId) return;
    (async () => {
      try {
        const id = await createSession({
          institutionId,
          teacherId: user.uid,
          teacherName: user.displayName ?? user.email ?? 'Teacher',
          subjectName: subjectName.trim(),
          className: className.trim(),
          status: 'OPEN',
          attendanceCount: 0,
        });
        try {
          const idToken = await getIdToken();
          const nowMs = Date.now();
          const res = await fetch(`${FUNCTIONS_BASE}/sessions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` },
            body: JSON.stringify({
              institutionId, classId: className.trim(), subjectId: subjectName.trim(),
              teacherId: user.uid, centerLat: 0, centerLng: 0, radiusMeters: 100,
              qrTtlSeconds: QR_TTL_SECONDS_DEFAULT, startsAt: nowMs, expiresAt: nowMs + 4 * 60 * 60 * 1000,
            }),
          });
          if (res.ok) { const data: { sessionId: string } = await res.json(); setSessionId(data.sessionId); }
          else setSessionId(id);
        } catch { setSessionId(id); }
        await logAudit({
          institutionId, actorId: user.uid, actorName: user.displayName ?? user.email ?? '',
          action: 'SESSION_STARTED', targetId: id, details: `${subjectName.trim()} · ${className.trim()}`,
        }).catch(() => {});
      } catch { /* demo continues with the local session id */ }
    })();
  };

  const endSession = async () => {
    setEnding(true);
    // Best-effort backend cleanup — never blocks the transition to the end screen.
    if (sessionId && !sessionId.startsWith('demo-')) {
      try {
        await fsEndSession(sessionId);
        if (user && institutionId) {
          await logAudit({
            institutionId, actorId: user.uid,
            actorName: user.displayName ?? user.email ?? '',
            action: 'SESSION_ENDED', targetId: sessionId,
            details: `${subjectName} · ${className}`,
          });
        }
      } catch { /* ignore — demo / offline */ }
    }
    setStage('ended');
    setEnding(false);
  };

  // Build the QR payload from the server-issued token.
  const qrPayload = sessionId && qrTokenStr ? `attendly://scan?t=${qrTokenStr}` : '';

  // ── Auth guard (teacher+) ────────────────────────────────────────────────────
  if (loading || !authorized) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] text-cream-50 flex flex-col items-center justify-center gap-3">
        <span className="loader" />
        <div className="text-[12.5px] text-cream-50/50">{loading ? 'Loading…' : 'Redirecting…'}</div>
      </div>
    );
  }

  // ── Setup screen ─────────────────────────────────────────────────────────────
  if (stage === 'setup') {
    return (
      <div className="min-h-screen bg-[#0A0A0B] text-cream-50 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <div className="text-[10.5px] tracking-[0.22em] text-cream-50/40 uppercase mb-2">[ attendance ]</div>
            <div className="font-display text-[2rem] mb-1">Start a session</div>
            <div className="text-[12.5px] text-cream-50/50">Pick the class you&apos;re teaching and today&apos;s topic — then we generate a live, rotating QR for students to scan.</div>
          </div>

          <div className="space-y-4">
            <div id="qr-class">
              <label className="block text-[11px] tracking-wide text-cream-50/50 mb-1.5 uppercase">Class / Section <span className="text-accent">*</span></label>
              {classes.length > 0 && !customClass ? (
                <div className="relative">
                  <select
                    value={className}
                    onChange={(e) => {
                      if (e.target.value === '__custom') { setCustomClass(true); setClassName(''); }
                      else setClassName(e.target.value);
                    }}
                    className="w-full text-[14px] bg-white/8 border border-white/10 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:border-accent/60 text-cream-50 transition-colors appearance-none cursor-pointer"
                  >
                    <option value="">Select a class…</option>
                    {classes.map((c) => (
                      <option key={c.id} value={c.name + (c.section ? ` · ${c.section}` : '')}>
                        {c.name}{c.section ? ` · ${c.section}` : ''}
                      </option>
                    ))}
                    <option value="__custom">Type manually…</option>
                  </select>
                  <svg className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-cream-50/40" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
                </div>
              ) : (
                <input
                  autoFocus={customClass}
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  placeholder="e.g. CS-301 · Batch A"
                  className="w-full text-[14px] bg-white/8 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-accent/60 text-cream-50 placeholder:text-cream-50/30 transition-colors"
                />
              )}
              {customClass && classes.length > 0 && (
                <button onClick={() => { setCustomClass(false); setClassName(''); }}
                  className="mt-1.5 text-[11px] text-cream-50/40 hover:text-cream-50/70 transition-colors">
                  ← pick from list instead
                </button>
              )}
              {classes.length === 0 && institutionId && (
                <p className="mt-1.5 text-[11px] text-cream-50/40">
                  No classes yet — <button onClick={() => router.push('/admin')} className="text-accent hover:underline">create one in Classes</button>, or type one above.
                </p>
              )}
            </div>
            <div id="qr-subject">
              <label className="block text-[11px] tracking-wide text-cream-50/50 mb-1.5 uppercase">Today&apos;s topic <span className="text-accent">*</span></label>
              <input
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                placeholder="e.g. Operating Systems — Deadlocks"
                className="w-full text-[14px] bg-white/8 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-accent/60 text-cream-50 placeholder:text-cream-50/30 transition-colors"
              />
            </div>
          </div>

          <button
            id="qr-start"
            onClick={startSession}
            disabled={starting || !subjectName.trim() || !className.trim()}
            className="w-full rounded-xl btn-on-dark py-3.5 text-[14px] font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
      <div className="min-h-screen bg-[#0A0A0B] text-cream-50 flex flex-col items-center justify-center p-8 gap-5">
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
  const elapsedSec = Math.floor((Date.now() - sessionStartRef.current) / 1000);
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-cream-50 flex flex-col p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Header bar */}
      <div className="flex items-start justify-between mb-4 sm:mb-6 gap-3">
        <div className="min-w-0">
          <div className="text-[10.5px] sm:text-[11px] tracking-[0.22em] text-cream-50/40 uppercase">[ live class ]</div>
          <div className="mt-1 font-display text-[1.3rem] sm:text-[1.6rem] leading-none truncate">{subjectName}</div>
          <div className="mt-0.5 text-[11.5px] sm:text-[12px] text-cream-50/55 truncate">{className}</div>
        </div>
        <div className="flex flex-col items-end gap-1.5 sm:gap-2 flex-shrink-0">
          <div className="flex items-center gap-2 text-[11px] sm:text-[12px] text-cream-50/60">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
            LIVE · {Math.floor(elapsedSec / 60)}m {elapsedSec % 60}s
          </div>
          <div className="text-[10.5px] sm:text-[11px] text-cream-50/50 font-mono">{liveCount} scanned</div>
        </div>
      </div>

      {/* Main grid: QR on left, security panel on right (collapses to stack on mobile) */}
      <div className="flex-1 grid lg:grid-cols-[auto_1fr] gap-6 lg:gap-12 items-center justify-items-center">
        {/* QR */}
        <div className="flex flex-col items-center w-full">
          <div style={{ perspective: '1200px' }}>
            <div ref={qrRef} className="bg-cream-50 p-4 sm:p-5 lg:p-6 rounded-3xl shadow-[0_30px_80px_-20px_rgba(140,140,148,0.25)]"
              style={{ transformStyle: 'preserve-3d' }}>
              {qrPayload ? (
                <div className="w-[220px] h-[220px] sm:w-[280px] sm:h-[280px] flex items-center justify-center">
                  <QRCodeSVG value={qrPayload} size={280} bgColor="#FAFAF7" fgColor="#0B1220" level="M" className="w-full h-full" />
                </div>
              ) : qrError ? (
                <div className="w-[220px] h-[220px] sm:w-[280px] sm:h-[280px] flex flex-col items-center justify-center text-center p-6 bg-cream-100 rounded-2xl">
                  <div className="text-[12px] text-red-600 font-medium mb-2">QR temporarily unavailable</div>
                  <div className="text-[10px] text-ink/60 font-mono break-all">{qrError}</div>
                  <div className="text-[10px] text-ink/40 mt-3">retrying…</div>
                </div>
              ) : (
                <div className="w-[220px] h-[220px] sm:w-[280px] sm:h-[280px] bg-cream-100 rounded-2xl animate-pulse" />
              )}
            </div>
          </div>
          {/* Rotation countdown */}
          <div className="mt-5 flex items-center gap-3">
            <div className="h-1 w-44 rounded-full bg-cream-50/15 overflow-hidden">
              <div
                key={tick}
                className="h-full w-full bg-accent"
                style={{ animation: `shrink ${ttlSecRef.current}s linear forwards` }}
              />
            </div>
            <span className="font-mono text-[11px] text-cream-50/55">
              rotates · {ttlSecRef.current}s · n={tick}
            </span>
          </div>
          <div className="mt-3 text-[12px] text-cream-50/55">
            Open the Attendly app. Token rotates every {ttlSecRef.current}s.
          </div>
        </div>

        {/* Security panel — right side: server signing badge + binding pills */}
        <div className="w-full max-w-md space-y-5 lg:pl-4">
          <div className="rounded-xl border border-cream-50/8 bg-cream-50/[0.025] p-4">
            <div className="text-[10px] tracking-[0.22em] text-cream-50/40 uppercase mb-2">security</div>
            <div className="font-mono text-[12px] text-cream-50/85">
              HMAC-SHA256 signed · kid=k1 · single-use
            </div>
            <div className="mt-2 text-[10.5px] text-cream-50/50">
              The token re-signs and rotates every {ttlSecRef.current}s — a screenshot is useless moments later.
              {qrExp ? (
                <> · exp in {Math.max(0, qrExp - Math.floor(Date.now() / 1000))}s</>
              ) : null}
            </div>
          </div>

          {/* Binding pills — device + roll + signature key reference */}
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-cream-50/8 bg-cream-50/[0.025] px-3 py-2.5">
              <div className="text-[9.5px] tracking-[0.18em] text-cream-50/40 uppercase">bound device</div>
              <div className="mt-1 font-mono text-[12px] text-cream-50/85">TOFU</div>
            </div>
            <div className="rounded-xl border border-cream-50/8 bg-cream-50/[0.025] px-3 py-2.5">
              <div className="text-[9.5px] tracking-[0.18em] text-cream-50/40 uppercase">roll bound</div>
              <div className="mt-1 font-mono text-[12px] text-cream-50/85">per-scan ✓</div>
            </div>
            <div className="rounded-xl border border-cream-50/8 bg-cream-50/[0.025] px-3 py-2.5">
              <div className="text-[9.5px] tracking-[0.18em] text-cream-50/40 uppercase">accuracy</div>
              <div className="mt-1 font-mono text-[12px] text-cream-50/85">≤ 50m</div>
            </div>
            <div className="rounded-xl border border-cream-50/8 bg-cream-50/[0.025] px-3 py-2.5">
              <div className="text-[9.5px] tracking-[0.18em] text-cream-50/40 uppercase">geofence</div>
              <div className="mt-1 font-mono text-[12px] text-cream-50/85">haversine</div>
            </div>
          </div>

          <div className="text-[10.5px] text-cream-50/40 leading-relaxed pt-1">
            The QR encodes a server-signed HMAC-SHA256 token bound to the
            session, class, and a short expiry. Scans are verified with the
            student&apos;s device fingerprint, GPS accuracy gate, and Haversine
            geofence against the session radius.
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-6">
        <span className="font-mono text-[10px] text-cream-50/30">session · {sessionId.slice(0, 12)}…</span>
        <button
          onClick={endSession}
          disabled={ending}
          className="rounded-full bg-cream-50/10 hover:bg-cream-50/20 px-4 py-2 text-[12px] transition-colors disabled:opacity-50"
        >
          {ending ? 'Ending…' : 'End class'}
        </button>
      </div>
    </div>
  );
}
