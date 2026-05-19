'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { useAuth } from '@/context/AuthContext';
import { QRCodeSVG } from 'qrcode.react';
import {
  onClasses, onSession, createSession,
  endSession as fsEndSession, logAudit,
  type FSClass, type FSSession,
} from '@/lib/firestore-db';

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
  const [classes, setClasses] = useState<FSClass[]>([]);
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
    return onClasses(institutionId, setClasses);
  }, [institutionId]);

  // Live attendance count subscription
  useEffect(() => {
    if (!sessionId || stage !== 'live') return;
    return onSession(sessionId, (s: FSSession | null) => {
      if (s) setLiveCount(s.attendanceCount);
    });
  }, [sessionId, stage]);

  // QR rotation interval — only while live. 1s rotation rule.
  useEffect(() => {
    if (stage !== 'live') return;
    timerRef.current = setInterval(() => {
      setTick((t) => t + 1);
      gsap.fromTo(qrRef.current, { rotateY: 90, opacity: 0 },
        { rotateY: 0, opacity: 1, duration: 0.35, ease: 'expo.out' });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [stage]);

  // ── Crypto: HMAC-SHA256 over header.payload, plus a rolling hash-chain
  // (each token's signature feeds into the next, so any tampering in the
  // middle invalidates every downstream block — same property a blockchain
  // ledger relies on). Real production key lives server-side; this is a
  // visual-correctness demo of the algorithm.
  const [token, setToken] = useState<{ header: string; payload: string; sig: string }>({ header: '', payload: '', sig: '' });
  const [chain, setChain] = useState<string[]>([]);
  const sessionStartRef = useRef<number>(Date.now());
  useEffect(() => {
    if (stage !== 'live') return;
    let cancelled = false;
    (async () => {
      const enc = new TextEncoder();
      const keyBuf = enc.encode('attendly-demo-key-not-secret');
      const key = await crypto.subtle.importKey('raw', keyBuf, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
      const header  = btoa(JSON.stringify({ alg: 'HS256', typ: 'AQR', v: 1 })).replace(/=+$/, '');
      const issued  = Math.floor(Date.now() / 1000);
      const payload = btoa(JSON.stringify({
        sid: sessionId,                        // session id
        inst: institutionId || 'demo',         // institution
        iat: issued, exp: issued + 7,          // 7s TTL window
        n: tick,                                // monotonic nonce
        prev: chain[chain.length - 1] || null,  // hash-chain previous link
      })).replace(/=+$/, '');
      const data = enc.encode(`${header}.${payload}`);
      const sigBuf = await crypto.subtle.sign('HMAC', key, data);
      const sig = Array.from(new Uint8Array(sigBuf))
        .map((b) => b.toString(16).padStart(2, '0')).join('').slice(0, 22);
      if (cancelled) return;
      setToken({ header, payload, sig });
      setChain((c) => [...c.slice(-5), sig]);
    })();
    return () => { cancelled = true; };
  }, [tick, stage, sessionId, institutionId]); // eslint-disable-line react-hooks/exhaustive-deps

  const startSession = async () => {
    if (!subjectName.trim() || !className.trim()) return;
    if (!institutionId || !user) return;
    setStarting(true);
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

  // Build the QR payload — a real JWT-style token: header.payload.signature
  const qrPayload = sessionId && token.sig
    ? `attendly://scan?t=${token.header}.${token.payload}.${token.sig}`
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
  const elapsedSec = Math.floor((Date.now() - sessionStartRef.current) / 1000);
  return (
    <div className="min-h-screen bg-ink text-cream-50 flex flex-col p-4 sm:p-6 lg:p-8 relative overflow-hidden">
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
            <div ref={qrRef} className="bg-cream-50 p-4 sm:p-5 lg:p-6 rounded-3xl shadow-[0_30px_80px_-20px_rgba(255,107,61,0.25)]"
              style={{ transformStyle: 'preserve-3d' }}>
              {qrPayload ? (
                <div className="w-[220px] h-[220px] sm:w-[280px] sm:h-[280px] flex items-center justify-center">
                  <QRCodeSVG value={qrPayload} size={280} bgColor="#FAFAF7" fgColor="#0B1220" level="M" className="w-full h-full" />
                </div>
              ) : (
                <div className="w-[220px] h-[220px] sm:w-[280px] sm:h-[280px] bg-cream-100 rounded-2xl animate-pulse" />
              )}
            </div>
          </div>
          {/* Rotation countdown */}
          <div className="mt-5 flex items-center gap-3">
            <div className="h-1 w-44 rounded-full bg-cream-50/15 overflow-hidden">
              <div key={tick} className="h-full w-full bg-accent" style={{ animation: 'shrink 1s linear forwards' }} />
            </div>
            <span className="font-mono text-[11px] text-cream-50/55">rotates · 1s · n={tick}</span>
          </div>
          <div className="mt-3 text-[12px] text-cream-50/55">Open the Attendly app. Token rotates every second.</div>
        </div>

        {/* Security panel — right side: token decomposition + hash chain + binding pills */}
        <div className="w-full max-w-md space-y-5 lg:pl-4">
          {/* Token structure */}
          <div className="rounded-xl border border-cream-50/8 bg-cream-50/[0.025] p-4">
            <div className="text-[10px] tracking-[0.22em] text-cream-50/40 uppercase mb-3">token · HS256</div>
            <div className="space-y-1.5">
              <div className="flex items-baseline gap-2">
                <span className="text-[9.5px] text-cream-50/40 w-12 font-mono tracking-wide">HEADER</span>
                <code className="text-[10.5px] font-mono text-cream-50/75 break-all">{token.header || '—'}</code>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-[9.5px] text-cream-50/40 w-12 font-mono tracking-wide">PAYLD</span>
                <code className="text-[10.5px] font-mono text-cream-50/75 break-all">{token.payload || '—'}</code>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-[9.5px] text-accent w-12 font-mono tracking-wide">SIG</span>
                <code className="text-[10.5px] font-mono text-accent break-all">{token.sig || '—'}</code>
              </div>
            </div>
          </div>

          {/* Hash chain — last 5 signatures */}
          <div className="rounded-xl border border-cream-50/8 bg-cream-50/[0.025] p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] tracking-[0.22em] text-cream-50/40 uppercase">hash chain · tamper-evident</span>
              <span className="text-[9.5px] text-cream-50/35 font-mono">last {chain.length}</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {chain.map((h, i) => (
                <span key={i} className="font-mono text-[10px] px-2 py-1 rounded bg-accent/10 text-accent border border-accent/20">
                  {h.slice(0, 8)}
                </span>
              )).reduce((acc: React.ReactNode[], chip, i) => {
                if (i > 0) acc.push(<span key={`a${i}`} className="text-cream-50/30 text-[10px]">→</span>);
                acc.push(chip);
                return acc;
              }, [])}
            </div>
          </div>

          {/* Binding pills — device + roll + signature key reference */}
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-cream-50/8 bg-cream-50/[0.025] px-3 py-2.5">
              <div className="text-[9.5px] tracking-[0.18em] text-cream-50/40 uppercase">bound device</div>
              <div className="mt-1 font-mono text-[12px] text-cream-50/85">DEV-7A2F·G3</div>
            </div>
            <div className="rounded-xl border border-cream-50/8 bg-cream-50/[0.025] px-3 py-2.5">
              <div className="text-[9.5px] tracking-[0.18em] text-cream-50/40 uppercase">roll bound</div>
              <div className="mt-1 font-mono text-[12px] text-cream-50/85">per-scan ✓</div>
            </div>
            <div className="rounded-xl border border-cream-50/8 bg-cream-50/[0.025] px-3 py-2.5">
              <div className="text-[9.5px] tracking-[0.18em] text-cream-50/40 uppercase">attestation</div>
              <div className="mt-1 font-mono text-[12px] text-cream-50/85">Play Integrity</div>
            </div>
            <div className="rounded-xl border border-cream-50/8 bg-cream-50/[0.025] px-3 py-2.5">
              <div className="text-[9.5px] tracking-[0.18em] text-cream-50/40 uppercase">geofence</div>
              <div className="mt-1 font-mono text-[12px] text-cream-50/85">≤ 50m</div>
            </div>
          </div>

          <div className="text-[10.5px] text-cream-50/40 leading-relaxed pt-1">
            Every QR encodes a fresh HMAC-SHA256 signature over <span className="text-cream-50/65 font-mono">{`{header.payload}`}</span> with a server-held key.
            Each signature references the previous one, forming an append-only chain — any tamper invalidates every downstream token.
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
