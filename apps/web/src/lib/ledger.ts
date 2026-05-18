/**
 * Append-only hash-chained ledger.
 *
 * Each record stores prev_hash so any tampering with an old record
 * breaks every subsequent hash — exactly like a blockchain.
 *
 * Record hash = SHA-256(prevHash || ts || kind || JSON(payload) || sig || signerPub)
 */

import { sha256 } from './crypto';
import {
  appendLedger,
  clearLedger,
  getLastLedgerRecord,
  getLedger,
  markSynced,
  type LedgerRecord,
} from './idb';

export type LedgerKind =
  | 'genesis'
  | 'qr_scan'
  | 'qr_session_started'
  | 'qr_session_ended'
  | 'attendance_marked'
  | 'device_rebind'
  | 'sync_ack';

const GENESIS_HASH =
  '0000000000000000000000000000000000000000000000000000000000000000';

async function recordHash(rec: Omit<LedgerRecord, 'hash' | 'seq'>): Promise<string> {
  const canonical = JSON.stringify({
    prevHash: rec.prevHash,
    ts: rec.ts,
    kind: rec.kind,
    payload: rec.payload,
    sig: rec.sig ?? null,
    signerPub: rec.signerPub ?? null,
  });
  return sha256(canonical);
}

export async function appendRecord(opts: {
  kind: LedgerKind;
  payload: unknown;
  sig?: string;
  signerPub?: string;
}): Promise<LedgerRecord> {
  const prev = await getLastLedgerRecord();
  const prevHash = prev?.hash ?? GENESIS_HASH;
  const ts = Date.now();
  const draft = { prevHash, ts, kind: opts.kind, payload: opts.payload, sig: opts.sig, signerPub: opts.signerPub };
  const hash = await recordHash(draft);
  const rec: LedgerRecord = { ...draft, hash, synced: false };
  const seq = await appendLedger(rec);
  return { ...rec, seq };
}

export interface ChainVerifyReport {
  ok: boolean;
  count: number;
  brokenAt?: number;
  lastHash: string;
  bytes: number;
}

export async function verifyChain(): Promise<ChainVerifyReport> {
  const all = await getLedger();
  if (!all.length) {
    return { ok: true, count: 0, lastHash: GENESIS_HASH, bytes: 0 };
  }
  let prev = GENESIS_HASH;
  let bytes = 0;
  for (let i = 0; i < all.length; i++) {
    const r = all[i];
    if (r.prevHash !== prev) return { ok: false, count: i, brokenAt: r.seq, lastHash: prev, bytes };
    const recomputed = await recordHash({
      prevHash: r.prevHash, ts: r.ts, kind: r.kind, payload: r.payload, sig: r.sig, signerPub: r.signerPub,
    });
    if (recomputed !== r.hash) return { ok: false, count: i, brokenAt: r.seq, lastHash: prev, bytes };
    bytes += JSON.stringify(r).length;
    prev = r.hash;
  }
  return { ok: true, count: all.length, lastHash: prev, bytes };
}

export async function getChain(): Promise<LedgerRecord[]> {
  return getLedger();
}

export async function chainStats(): Promise<{
  count: number;
  pendingSync: number;
  lastHash: string;
  lastTs: number | null;
  bytes: number;
}> {
  const all = await getLedger();
  const pendingSync = all.filter((r) => !r.synced).length;
  const last = all[all.length - 1];
  return {
    count: all.length,
    pendingSync,
    lastHash: last?.hash ?? GENESIS_HASH,
    lastTs: last?.ts ?? null,
    bytes: all.reduce((n, r) => n + JSON.stringify(r).length, 0),
  };
}

export async function resetChain(): Promise<void> {
  await clearLedger();
  await appendRecord({ kind: 'genesis', payload: { msg: 'attendly ledger init', v: 1 } });
}

export { markSynced };
export type { LedgerRecord };
