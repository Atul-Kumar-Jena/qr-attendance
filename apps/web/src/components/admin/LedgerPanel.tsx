'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import {
  appendRecord,
  chainStats,
  getChain,
  resetChain,
  verifyChain,
  type LedgerRecord,
  type ChainVerifyReport,
} from '@/lib/ledger';

type VerifyState =
  | { kind: 'idle' }
  | { kind: 'running' }
  | { kind: 'done'; report: ChainVerifyReport };

export function LedgerPanel() {
  const [chain, setChain] = useState<LedgerRecord[]>([]);
  const [stats, setStats] = useState<{ count: number; pendingSync: number; lastHash: string; lastTs: number | null; bytes: number } | null>(null);
  const [verify, setVerify] = useState<VerifyState>({ kind: 'idle' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const rootRef = useRef<HTMLDivElement>(null);

  const refresh = async () => {
    try {
      const [c, s] = await Promise.all([getChain(), chainStats()]);
      setChain(c);
      setStats(s);
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  };

  useEffect(() => { refresh(); }, []);

  useEffect(() => {
    if (!rootRef.current) return;
    gsap.fromTo(
      rootRef.current.querySelectorAll('[data-anim]'),
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out', stagger: 0.05 },
    );
  }, [stats]);

  const handleVerify = async () => {
    setVerify({ kind: 'running' });
    const report = await verifyChain();
    setVerify({ kind: 'done', report });
  };

  const handleSeed = async () => {
    setBusy(true);
    try {
      const samples = [
        { kind: 'qr_session_started' as const, payload: { sessionId: `demo-${Date.now()}`, subject: 'Operating Systems', class: 'CS-301' } },
        { kind: 'qr_scan' as const, payload: { sessionId: 'demo', studentRoll: 'CS21B01', deviceFp: '7f3a90b…' } },
        { kind: 'qr_scan' as const, payload: { sessionId: 'demo', studentRoll: 'CS21B02', deviceFp: '8d2c1ee…' } },
        { kind: 'attendance_marked' as const, payload: { count: 2, geo: { lat: 12.971, lng: 77.594 } } },
        { kind: 'qr_session_ended' as const, payload: { sessionId: 'demo', total: 2 } },
      ];
      for (const s of samples) {
        await appendRecord(s);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
      refresh();
    }
  };

  const handleReset = async () => {
    if (!confirm('Reset the local hash chain? All records on this device will be wiped (Firestore server audit log is unaffected).')) return;
    setBusy(true);
    try {
      await resetChain();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
      refresh();
    }
  };

  const handleExport = async () => {
    const blob = new Blob([JSON.stringify(chain, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendly-ledger-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div ref={rootRef} className="space-y-5 max-w-4xl">
      {error && (
        <div className="rounded-xl border border-red-400/30 bg-red-50 dark:bg-red-900/15 text-red-700 dark:text-red-300 px-4 py-3 text-[12.5px]">
          {error}
        </div>
      )}

      <div data-anim>
        <div className="text-[10.5px] tracking-[0.22em] uppercase text-ink-mute mb-2">
          [ blockchain-style audit ledger ]
        </div>
        <h2 className="font-display text-[1.9rem] text-ink dark:text-cream-50 mb-1.5">
          Tamper-evident hash chain
        </h2>
        <p className="text-[13px] text-ink-mute max-w-xl leading-relaxed">
          Every QR scan, session and attendance proof appends to an append-only
          ledger in IndexedDB. Each record stores the previous hash —
          editing any past entry breaks every subsequent hash.
        </p>
      </div>

      {/* Stats */}
      <div data-anim className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatTile label="Records" value={stats?.count ?? '—'} />
        <StatTile label="Pending sync" value={stats?.pendingSync ?? '—'} />
        <StatTile label="Local size" value={stats ? `${(stats.bytes / 1024).toFixed(1)} KB` : '—'} />
        <StatTile label="Last entry" value={stats?.lastTs ? new Date(stats.lastTs).toLocaleTimeString() : '—'} />
      </div>

      {/* Actions */}
      <div data-anim className="flex flex-wrap gap-2">
        <button
          onClick={handleVerify}
          disabled={verify.kind === 'running'}
          className="text-[12.5px] rounded-lg bg-accent text-cream-50 px-3.5 py-2 font-medium hover:bg-accent/90 transition-colors disabled:opacity-50"
        >
          {verify.kind === 'running' ? 'Verifying…' : 'Verify chain integrity'}
        </button>
        <button
          onClick={handleSeed}
          disabled={busy}
          className="text-[12.5px] rounded-lg border border-ink/15 dark:border-white/15 px-3.5 py-2 hover:bg-ink/4 dark:hover:bg-white/6 transition-colors disabled:opacity-50"
        >
          + Append 5 sample records
        </button>
        <button
          onClick={handleExport}
          disabled={!chain.length}
          className="text-[12.5px] rounded-lg border border-ink/15 dark:border-white/15 px-3.5 py-2 hover:bg-ink/4 dark:hover:bg-white/6 transition-colors disabled:opacity-50"
        >
          Export JSON
        </button>
        <button
          onClick={handleReset}
          disabled={busy}
          className="text-[12.5px] rounded-lg border border-red-500/25 text-red-500 dark:text-red-400 px-3.5 py-2 hover:bg-red-50 dark:hover:bg-red-900/15 transition-colors disabled:opacity-50"
        >
          Reset chain
        </button>
      </div>

      {/* Verify result */}
      {verify.kind === 'done' && (
        <div data-anim className={`rounded-xl border px-4 py-3 text-[12.5px] ${
          verify.report.ok
            ? 'border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400'
            : 'border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400'
        }`}>
          {verify.report.ok ? (
            <>✓ Chain verified · {verify.report.count} records · {(verify.report.bytes / 1024).toFixed(1)} KB · last hash <span className="font-mono">{verify.report.lastHash.slice(0, 16)}…</span></>
          ) : (
            <>✗ Chain broken at record #{verify.report.brokenAt} (records before that are still valid)</>
          )}
        </div>
      )}

      {/* Records */}
      <div data-anim className="rounded-2xl border border-ink/8 dark:border-white/10 bg-cream-50 dark:bg-[#13161D] overflow-hidden">
        <div className="px-5 py-3.5 border-b border-ink/8 dark:border-white/8 flex items-center justify-between">
          <h3 className="text-[13.5px] font-medium text-ink dark:text-cream-50">Chain ({chain.length})</h3>
          <span className="text-[11px] text-ink-mute font-mono">{stats?.lastHash.slice(0, 18) || '—'}…</span>
        </div>
        {chain.length === 0 ? (
          <div className="px-5 py-10 text-center text-ink-mute text-[12.5px]">
            Empty. Start a QR session or add sample records.
          </div>
        ) : (
          <div className="max-h-[480px] overflow-y-auto divide-y divide-ink/6 dark:divide-white/6">
            {chain.slice().reverse().map((r) => (
              <RecordRow key={r.seq} r={r} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatTile({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-ink/8 dark:border-white/10 bg-cream-50 dark:bg-[#13161D] px-4 py-3">
      <div className="text-[10px] tracking-[0.18em] uppercase text-ink-mute mb-1">{label}</div>
      <div className="text-[20px] font-display text-ink dark:text-cream-50 tabular-nums">{value}</div>
    </div>
  );
}

function RecordRow({ r }: { r: LedgerRecord }) {
  const [open, setOpen] = useState(false);
  const kindColor: Record<string, string> = {
    qr_session_started: 'bg-blue-500/15 text-blue-500',
    qr_session_ended:   'bg-purple-500/15 text-purple-500',
    qr_scan:            'bg-green-500/15 text-green-500',
    attendance_marked:  'bg-accent/15 text-accent',
    device_rebind:      'bg-amber-500/15 text-amber-500',
    sync_ack:           'bg-emerald-500/15 text-emerald-500',
    genesis:            'bg-gray-500/15 text-gray-500',
  };
  const color = kindColor[r.kind] || 'bg-gray-500/15 text-gray-500';
  return (
    <div className="px-5 py-3">
      <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center justify-between gap-3 text-left">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-[10px] font-mono text-ink-mute flex-shrink-0">#{r.seq}</span>
          <span className={`text-[10.5px] px-2 py-0.5 rounded-full font-medium ${color}`}>{r.kind}</span>
          <span className="text-[11px] text-ink-mute flex-shrink-0">{new Date(r.ts).toLocaleTimeString()}</span>
          <span className="text-[10.5px] font-mono text-ink-mute truncate min-w-0">{r.hash.slice(0, 24)}…</span>
        </div>
        <span className={`text-[10px] text-ink-mute transition-transform ${open ? 'rotate-90' : ''}`}>▶</span>
      </button>
      {open && (
        <pre className="mt-2.5 text-[11px] font-mono bg-ink/4 dark:bg-white/4 rounded-lg p-3 overflow-x-auto text-ink-mute whitespace-pre-wrap break-all">
{JSON.stringify({ prevHash: r.prevHash.slice(0, 16) + '…', hash: r.hash.slice(0, 16) + '…', ts: r.ts, kind: r.kind, payload: r.payload }, null, 2)}
        </pre>
      )}
    </div>
  );
}
