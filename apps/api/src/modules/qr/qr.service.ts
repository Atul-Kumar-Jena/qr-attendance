import crypto from 'node:crypto';
import { env } from '../../config/env.js';
import { redis, NONCE_PREFIX } from '../../config/redis.js';

/**
 * QR token: `aqr:v1:<headerB64>.<payloadB64>.<sigB64>`
 *
 * payload = { iid, cid, sid, iat, exp, nonce, ver }
 *
 * Validation contract (in order, fail fast):
 *   1. parseable + signature valid
 *   2. not expired (server time)
 *   3. nonce is single-use (atomic SET NX in Redis)
 *
 * Everything else (session OPEN, device, geofence, duplicate) is enforced
 * by the attendance pipeline — this service is purely cryptographic +
 * nonce bookkeeping.
 */

export interface QrPayload {
  iid: string; // institution id
  cid: string; // class id
  sid: string; // session id
  iat: number;
  exp: number;
  nonce: string;
  ver: number;
}

const HEADER = { alg: 'HS256', typ: 'AQR' } as const;
const HEADER_B64 = b64urlEncode(JSON.stringify(HEADER));
const PREFIX = 'aqr:v1:';

function b64urlEncode(input: string | Buffer): string {
  return Buffer.from(input)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function b64urlDecode(input: string): Buffer {
  const pad = input.length % 4 === 0 ? '' : '='.repeat(4 - (input.length % 4));
  return Buffer.from(input.replace(/-/g, '+').replace(/_/g, '/') + pad, 'base64');
}

function sign(payloadB64: string): string {
  const h = crypto.createHmac('sha256', env.QR_SIGNING_KEY);
  h.update(`${HEADER_B64}.${payloadB64}`);
  return b64urlEncode(h.digest());
}

/** Mint a new QR token for a session and reserve its nonce in Redis. */
export async function mintToken(params: {
  institutionId: string;
  classId: string;
  sessionId: string;
  ttlSec?: number;
}): Promise<{ token: string; payload: QrPayload }> {
  const ttl = params.ttlSec ?? env.QR_DEFAULT_TTL_SEC;
  const now = Math.floor(Date.now() / 1000);
  const nonce = crypto.randomBytes(16).toString('base64url');

  const payload: QrPayload = {
    iid: params.institutionId,
    cid: params.classId,
    sid: params.sessionId,
    iat: now,
    exp: now + ttl,
    nonce,
    ver: 1,
  };

  const payloadB64 = b64urlEncode(JSON.stringify(payload));
  const sig = sign(payloadB64);
  const token = `${PREFIX}${HEADER_B64}.${payloadB64}.${sig}`;

  // Reserve nonce (NX so collision is impossible). TTL = 2× lifetime so
  // a late scan still finds it pending and we can mark "expired" rather
  // than "unknown".
  await redis.set(`${NONCE_PREFIX}${nonce}`, '1', 'EX', ttl * 2, 'NX');

  return { token, payload };
}

export type VerifyResult =
  | { ok: true; payload: QrPayload }
  | { ok: false; code: 'TOKEN_INVALID' | 'TOKEN_EXPIRED' | 'TOKEN_REUSED' };

/** Verify token signature + expiry + nonce. Atomically consumes the nonce. */
export async function verifyAndConsume(token: string): Promise<VerifyResult> {
  if (!token?.startsWith(PREFIX)) return { ok: false, code: 'TOKEN_INVALID' };
  const body = token.slice(PREFIX.length);
  const parts = body.split('.');
  if (parts.length !== 3) return { ok: false, code: 'TOKEN_INVALID' };
  const [headerB64, payloadB64, sigB64] = parts as [string, string, string];

  if (headerB64 !== HEADER_B64) return { ok: false, code: 'TOKEN_INVALID' };

  // Constant-time signature comparison
  const expected = sign(payloadB64);
  const a = Buffer.from(sigB64);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return { ok: false, code: 'TOKEN_INVALID' };
  }

  let payload: QrPayload;
  try {
    payload = JSON.parse(b64urlDecode(payloadB64).toString('utf8')) as QrPayload;
  } catch {
    return { ok: false, code: 'TOKEN_INVALID' };
  }

  const now = Math.floor(Date.now() / 1000);
  if (now > payload.exp) return { ok: false, code: 'TOKEN_EXPIRED' };

  // Atomically consume nonce. GETDEL ensures only one caller wins.
  const key = `${NONCE_PREFIX}${payload.nonce}`;
  const existed = await redis.getdel(key);
  if (existed !== '1') return { ok: false, code: 'TOKEN_REUSED' };

  return { ok: true, payload };
}

/** Peek without consuming (for admin debug only). */
export function decodeUnsafe(token: string): QrPayload | null {
  if (!token?.startsWith(PREFIX)) return null;
  const [, payloadB64] = token.slice(PREFIX.length).split('.');
  if (!payloadB64) return null;
  try {
    return JSON.parse(b64urlDecode(payloadB64).toString('utf8')) as QrPayload;
  } catch {
    return null;
  }
}
