'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useAuth } from '@/context/AuthContext';
import {
  getOrCreateInstitutionKeys,
  rotateInstitutionKeys,
  getOrCreateDeviceKeys,
  listAllKeys,
  type StoredKey,
} from '@/lib/keystore';
import {
  signQrToken,
  verifyQrToken,
  randomNonce,
  type QrClaims,
} from '@/lib/crypto';
import { getDeviceInfo, getCurrentLocation, type DeviceInfo, type DeviceGeo } from '@/lib/device';
import { appendRecord } from '@/lib/ledger';

interface VerifyState {
  status: 'idle' | 'signing' | 'verifying' | 'ok' | 'fail';
  detail?: string;
  claims?: QrClaims;
  tokenLen?: number;
  durMs?: number;
}

export function CryptoPanel() {
  const { institutionId, user } = useAuth();
  const [instKey, setInstKey] = useState<StoredKey | null>(null);
  const [deviceKey, setDeviceKey] = useState<StoredKey | null>(null);
  const [allKeys, setAllKeys] = useState<StoredKey[]>([]);
  const [device, setDevice] = useState<DeviceInfo | null>(null);
  const [geo, setGeo] = useState<DeviceGeo | null>(null);
  const [verify, setVerify] = useState<VerifyState>({ status: 'idle' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const rootRef = useRef<HTMLDivElement>(null);

  const refresh = async () => {
    try {
      const [inst, dev, all, info] = await Promise.all([
        institutionId ? getOrCreateInstitutionKeys(institutionId) : Promise.resolve(null),
        getOrCreateDeviceKeys(),
        listAllKeys(),
        getDeviceInfo(),
      ]);
      setInstKey(inst);
      setDeviceKey(dev);
      setAllKeys(all);
      setDevice(info);
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  };

  useEffect(() => { refresh(); }, [institutionId]);

  // GSAP fade-up on mount
  useEffect(() => {
    if (!rootRef.current) return;
    gsap.fromTo(
      rootRef.current.querySelectorAll('[data-anim]'),
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', stagger: 0.07 },
    );
  }, [instKey]);

  const handleRotate = async () => {
    if (!institutionId) return;
    if (!confirm('Rotate institution key? The old key will be invalidated immediately and any in-flight QR sessions will fail to verify.')) return;
    setBusy(true);
    try {
      const k = await rotateInstitutionKeys(institutionId);
      setInstKey(k);
      try {
        await appendRecord({ kind: 'device_rebind', payload: { reason: 'inst_key_rotate', fingerprint: k.publicKey.slice(0, 16) } });
      } catch {}
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
      refresh();
    }
  };

  const handleLocate = async () => {
    setBusy(true);
    const g = await getCurrentLocation();
    setGeo(g);
    setBusy(false);
  };

  const handleSignAndVerify = async () => {
    if (!instKey || !institutionId) return;
    setVerify({ status: 'signing' });
    const t0 = performance.now();
    try {
      const claims: QrClaims = {
        v: 1,
        sid: 'verify-demo',
        t: 0,
        ts: Date.now(),
        ttl: 2000,
        max: 1,
        non: randomNonce(),
        iss: institutionId,
      };
      const token = await signQrToken(instKey.privateKey, claims);
      setVerify({ status: 'verifying', tokenLen: token.length });
      const result = await verifyQrToken(instKey.publicKey, token);
      const dur = Math.round(performance.now() - t0);
      if (result.ok) {
        setVerify({ status: 'ok', detail: 'signature valid · TTL inside window', claims: result.claims, tokenLen: token.length, durMs: dur });
      } else {
        setVerify({ status: 'fail', detail: result.reason || 'verification failed', tokenLen: token.length, durMs: dur });
      }
    } catch (e) {
      setVerify({ status: 'fail', detail: e instanceof Error ? e.message : String(e) });
    }
  };

  const handleTamperTest = async () => {
    if (!instKey || !institutionId) return;
    setVerify({ status: 'signing' });
    try {
      const claims: QrClaims = {
        v: 1, sid: 'tamper', t: 0, ts: Date.now(), ttl: 2000, max: 1,
        non: randomNonce(), iss: institutionId,
      };
      const token = await signQrToken(instKey.privateKey, claims);
      // Flip a byte in the payload portion
      const [payload, sig] = token.split('.');
      const tampered =
        payload.slice(0, -1) + (payload.slice(-1) === 'A' ? 'B' : 'A') + '.' + sig;
      const result = await verifyQrToken(instKey.publicKey, tampered);
      setVerify({
        status: result.ok ? 'fail' : 'ok',
        detail: result.ok
          ? '⚠ tamper went undetected (bug!)'
          : `tamper detected · ${result.reason}`,
      });
    } catch (e) {
      setVerify({ status: 'fail', detail: e instanceof Error ? e.message : String(e) });
    }
  };

  return (
    <div ref={rootRef} className="space-y-5 max-w-4xl">
      {error && (
        <div className="rounded-xl border border-red-400/30 bg-red-50 dark:bg-red-900/15 text-red-700 dark:text-red-300 px-4 py-3 text-[12.5px]">
          {error}
        </div>
      )}

      {/* Header */}
      <div data-anim>
        <div className="text-[10.5px] tracking-[0.22em] uppercase text-ink-mute mb-2">
          [ crypto · signing · verification ]
        </div>
        <h2 className="font-display text-[1.9rem] text-ink dark:text-cream-50 mb-1.5">
          QR security stack
        </h2>
        <p className="text-[13px] text-ink-mute max-w-xl leading-relaxed">
          Every QR token is signed with the institution&apos;s ECDSA-P256 private key.
          Student devices verify with the corresponding public key, then sign the
          attendance proof with their own device key. All proofs land in a
          hash-chained offline ledger.
        </p>
      </div>

      {/* Institution key card */}
      <KeyCard
        title="Institution signing key"
        sub="signs every rotating QR token (1–3s)"
        k={instKey}
        actionLabel={instKey ? 'Rotate key' : 'Generate'}
        actionBusy={busy}
        onAction={handleRotate}
      />

      {/* Device key card */}
      <KeyCard
        title="Device signing key"
        sub="signs the final attendance proof when a student scans"
        k={deviceKey}
      />

      {/* Device & geo card */}
      <div data-anim className="rounded-2xl border border-ink/8 dark:border-white/10 bg-cream-50 dark:bg-[#13161D] p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[14px] font-medium text-ink dark:text-cream-50">Device binding</h3>
          <button
            onClick={handleLocate}
            disabled={busy}
            className="text-[12px] rounded-lg border border-ink/15 dark:border-white/15 px-3 py-1.5 hover:bg-ink/4 dark:hover:bg-white/6 transition-colors disabled:opacity-50"
          >
            {busy ? '…' : 'Capture location'}
          </button>
        </div>
        <div className="grid sm:grid-cols-2 gap-2.5 text-[12px]">
          <KV label="Device fingerprint" value={device?.shortId || '—'} mono />
          <KV label="Screen" value={device?.screen || '—'} />
          <KV label="Timezone" value={device?.timezone || '—'} />
          <KV label="GPU renderer" value={device?.glRenderer || '—'} truncate />
          <KV label="User agent" value={device?.ua || '—'} truncate />
          <KV label="Geofence (lat,lng)" value={geo ? `${geo.lat.toFixed(5)}, ${geo.lng.toFixed(5)} · ±${Math.round(geo.accuracy)}m` : 'not captured'} mono />
        </div>
      </div>

      {/* Verify simulator */}
      <div data-anim className="rounded-2xl border border-ink/8 dark:border-white/10 bg-cream-50 dark:bg-[#13161D] p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-[14px] font-medium text-ink dark:text-cream-50">Sign → verify simulator</h3>
            <p className="text-[11.5px] text-ink-mute mt-0.5">Runs end-to-end ECDSA sign + verify locally.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSignAndVerify}
              disabled={!instKey || verify.status === 'signing' || verify.status === 'verifying'}
              className="text-[12.5px] rounded-lg bg-accent text-cream-50 px-3.5 py-1.5 font-medium hover:bg-accent/90 transition-colors disabled:opacity-50"
            >
              Run verify
            </button>
            <button
              onClick={handleTamperTest}
              disabled={!instKey}
              className="text-[12.5px] rounded-lg border border-ink/15 dark:border-white/15 px-3.5 py-1.5 hover:bg-ink/4 dark:hover:bg-white/6 transition-colors disabled:opacity-50"
            >
              Tamper test
            </button>
          </div>
        </div>

        <VerifyResult v={verify} />

        {verify.claims && (
          <pre className="mt-3 text-[11px] font-mono bg-ink/4 dark:bg-white/4 rounded-lg p-3 text-ink-mute overflow-x-auto">
{JSON.stringify(verify.claims, null, 2)}
          </pre>
        )}
      </div>

      {/* Paste-a-token verifier */}
      <PasteVerifier instPub={instKey?.publicKey} />

      {/* All keys */}
      <div data-anim className="rounded-2xl border border-ink/8 dark:border-white/10 bg-cream-50 dark:bg-[#13161D] p-5">
        <h3 className="text-[14px] font-medium text-ink dark:text-cream-50 mb-3">All keys in this browser ({allKeys.length})</h3>
        {allKeys.length === 0 ? (
          <p className="text-[12px] text-ink-mute">No keys yet.</p>
        ) : (
          <div className="space-y-2">
            {allKeys.map((k) => (
              <div key={k.id} className="flex items-center justify-between gap-3 rounded-lg border border-ink/6 dark:border-white/6 px-3 py-2 text-[12px]">
                <div className="min-w-0 flex-1">
                  <div className="font-mono text-ink dark:text-cream-50 truncate">{k.id}</div>
                  <div className="font-mono text-[10.5px] text-ink-mute mt-0.5 truncate">{k.publicKey.slice(0, 60)}…</div>
                </div>
                <span className="text-[10px] text-ink-mute font-mono flex-shrink-0">{k.algo}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function KeyCard({
  title, sub, k, actionLabel, actionBusy, onAction,
}: {
  title: string;
  sub: string;
  k: StoredKey | null;
  actionLabel?: string;
  actionBusy?: boolean;
  onAction?: () => void;
}) {
  return (
    <div data-anim className="rounded-2xl border border-ink/8 dark:border-white/10 bg-cream-50 dark:bg-[#13161D] p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="text-[14px] font-medium text-ink dark:text-cream-50">{title}</h3>
          <p className="text-[11.5px] text-ink-mute mt-0.5">{sub}</p>
        </div>
        {onAction && (
          <button
            onClick={onAction}
            disabled={actionBusy}
            className="text-[12px] rounded-lg border border-ink/15 dark:border-white/15 px-3 py-1.5 hover:bg-ink/4 dark:hover:bg-white/6 transition-colors disabled:opacity-50 flex-shrink-0"
          >
            {actionBusy ? '…' : actionLabel}
          </button>
        )}
      </div>
      {k ? (
        <div className="space-y-2 text-[12px]">
          <KV label="Algorithm" value={k.algo} mono />
          <KV label="Fingerprint" value={k.publicKey.slice(0, 16) + '…'} mono />
          <KV label="Created" value={new Date(k.createdAt).toLocaleString()} />
          <details className="text-[11px]">
            <summary className="cursor-pointer text-ink-mute hover:text-ink dark:hover:text-cream-50 select-none">Show public key</summary>
            <pre className="mt-2 font-mono text-[10.5px] bg-ink/4 dark:bg-white/4 rounded-lg p-3 break-all whitespace-pre-wrap text-ink-mute">{k.publicKey}</pre>
          </details>
        </div>
      ) : (
        <p className="text-[12px] text-ink-mute">Loading…</p>
      )}
    </div>
  );
}

function KV({ label, value, mono = false, truncate = false }: { label: string; value: string; mono?: boolean; truncate?: boolean }) {
  return (
    <div className={`flex justify-between gap-3 ${truncate ? 'min-w-0' : ''}`}>
      <span className="text-ink-mute flex-shrink-0">{label}</span>
      <span className={`text-ink dark:text-cream-50 ${mono ? 'font-mono' : ''} ${truncate ? 'truncate min-w-0' : ''}`}>{value}</span>
    </div>
  );
}

function PasteVerifier({ instPub }: { instPub?: string }) {
  const [token, setToken] = useState('');
  const [result, setResult] = useState<{ ok: boolean; reason?: string; claims?: QrClaims; ageMs?: number } | null>(null);

  const onVerify = async () => {
    if (!instPub) { setResult({ ok: false, reason: 'no institution key loaded' }); return; }
    let raw = token.trim();
    // Accept both raw token and the attendly://scan?...&p=<token> URL form
    const m = raw.match(/[?&]p=([^&]+)/);
    if (m) raw = decodeURIComponent(m[1]);
    if (!raw.includes('.')) { setResult({ ok: false, reason: 'token missing signature separator' }); return; }
    const r = await verifyQrToken(instPub, raw);
    setResult({
      ok: r.ok,
      reason: r.reason,
      claims: r.claims,
      ageMs: r.claims ? Date.now() - r.claims.ts : undefined,
    });
  };

  return (
    <div data-anim className="rounded-2xl border border-ink/8 dark:border-white/10 bg-cream-50 dark:bg-[#13161D] p-5">
      <h3 className="text-[14px] font-medium text-ink dark:text-cream-50 mb-1">Paste & verify a token</h3>
      <p className="text-[11.5px] text-ink-mute mb-3">
        Drop in either the raw <span className="font-mono">payload.sig</span> string or a full <span className="font-mono">attendly://scan?…</span> URL.
      </p>
      <textarea
        value={token}
        onChange={(e) => setToken(e.target.value)}
        rows={3}
        placeholder="eyJ2IjoxL... . MEUCI..."
        className="w-full font-mono text-[11.5px] bg-ink/4 dark:bg-white/4 rounded-lg p-3 border border-ink/8 dark:border-white/8 focus:outline-none focus:border-accent/40 resize-none"
      />
      <div className="flex items-center justify-end mt-2 gap-2">
        <button
          onClick={() => { setToken(''); setResult(null); }}
          className="text-[12px] rounded-lg border border-ink/15 dark:border-white/15 px-3 py-1.5 hover:bg-ink/4 dark:hover:bg-white/6 transition-colors"
        >
          Clear
        </button>
        <button
          onClick={onVerify}
          disabled={!token.trim() || !instPub}
          className="text-[12px] rounded-lg bg-accent text-cream-50 px-3.5 py-1.5 font-medium hover:bg-accent/90 transition-colors disabled:opacity-50"
        >
          Verify
        </button>
      </div>
      {result && (
        <div className={`mt-3 rounded-lg border px-3.5 py-2.5 text-[12.5px] ${
          result.ok
            ? 'border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400'
            : 'border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400'
        }`}>
          {result.ok
            ? `✓ Valid · token age ${(result.ageMs! / 1000).toFixed(2)}s · session "${result.claims?.sid}"`
            : `✗ ${result.reason || 'invalid'}`}
        </div>
      )}
    </div>
  );
}

function VerifyResult({ v }: { v: VerifyState }) {
  const palette =
    v.status === 'ok'   ? 'border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400'
  : v.status === 'fail' ? 'border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400'
  : v.status === 'idle' ? 'border-ink/8 dark:border-white/10 bg-ink/3 dark:bg-white/4 text-ink-mute'
  :                       'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400';

  const symbol =
    v.status === 'ok'   ? '✓'
  : v.status === 'fail' ? '✗'
  : v.status === 'idle' ? '·'
  :                       '⋯';

  const label =
    v.status === 'idle'      ? 'Click "Run verify" to sign & verify a sample token.'
  : v.status === 'signing'   ? 'Signing…'
  : v.status === 'verifying' ? 'Verifying signature…'
  : v.status === 'ok'        ? `OK · ${v.detail}`
  :                            `FAIL · ${v.detail}`;

  return (
    <div className={`rounded-lg border px-3.5 py-2.5 text-[12.5px] flex items-center justify-between gap-3 ${palette}`}>
      <div className="flex items-center gap-2.5">
        <span className="text-[16px] leading-none">{symbol}</span>
        <span>{label}</span>
      </div>
      {(v.tokenLen || v.durMs) && (
        <span className="text-[11px] opacity-70 font-mono flex-shrink-0">
          {v.tokenLen ? `${v.tokenLen}B` : ''}{v.tokenLen && v.durMs ? ' · ' : ''}{v.durMs ? `${v.durMs}ms` : ''}
        </span>
      )}
    </div>
  );
}
