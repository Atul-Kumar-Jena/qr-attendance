import crypto from 'node:crypto';

/**
 * Attendly QR token (JWT-shaped, HMAC-SHA256).
 *
 *   header.payload.signature
 *
 * Header  : { alg: 'HS256', typ: 'JWT', kid: 'k1' }
 * Payload : { typ: 'attendly.qr.v1', iss: 'attendly', aud: 'attendance-scan',
 *             institutionId, classId, sessionId, qrId, nonce,
 *             iat, nbf, exp }
 *
 * The token is NOT a single-use bearer credential — many students must be
 * able to scan the same QR while it is valid. Replay protection is provided
 * by short TTL plus per-student dedup at verification time.
 *
 * Security properties enforced on verify:
 *   - alg MUST be HS256 (alg=none and asymmetric algs are rejected)
 *   - kid MUST be a known key
 *   - signature compared with timingSafeEqual
 *   - typ/iss/aud claims validated
 *   - nbf ≤ now ≤ exp
 */

export type QrHeader = {
  alg: 'HS256';
  typ: 'JWT';
  kid: string;
};

export type QrPayload = {
  typ: 'attendly.qr.v1';
  iss: 'attendly';
  aud: 'attendance-scan';
  institutionId: string;
  classId: string;
  sessionId: string;
  qrId: string;
  nonce: string;
  iat: number;
  nbf: number;
  exp: number;
};

export type VerifyError =
  | 'INVALID_FORMAT'
  | 'BAD_SIGNATURE'
  | 'WRONG_ALG'
  | 'EXPIRED'
  | 'NOT_YET_VALID'
  | 'WRONG_TYP'
  | 'WRONG_ISS'
  | 'WRONG_AUD';

export type VerifyResult =
  | { ok: true; payload: QrPayload }
  | { ok: false; code: VerifyError };

const KID = 'k1';
const ALG = 'HS256';
const TYP = 'attendly.qr.v1';
const ISS = 'attendly';
const AUD = 'attendance-scan';

function getSecret(): string {
  const s = process.env.ATTENDLY_QR_HMAC_SECRET;
  if (!s || s.length < 16) {
    throw new Error(
      'ATTENDLY_QR_HMAC_SECRET is not set or too short (need ≥16 chars). ' +
        'Run: firebase functions:secrets:set ATTENDLY_QR_HMAC_SECRET',
    );
  }
  return s;
}

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

function hmacSign(signingInput: string, secret: string): string {
  const h = crypto.createHmac('sha256', secret);
  h.update(signingInput);
  return b64urlEncode(h.digest());
}

export type MintParams = {
  institutionId: string;
  classId: string;
  sessionId: string;
  ttlSec: number;
};

export type MintResult = {
  token: string;
  qrId: string;
  nonce: string;
  exp: number;
  iat: number;
};

export function mintToken(params: MintParams): MintResult {
  if (!params.institutionId || !params.classId || !params.sessionId) {
    throw new Error('mintToken: institutionId, classId, sessionId are required');
  }
  if (!Number.isFinite(params.ttlSec) || params.ttlSec < 1 || params.ttlSec > 600) {
    throw new Error('mintToken: ttlSec must be in [1, 600]');
  }

  const secret = getSecret();
  const now = Math.floor(Date.now() / 1000);
  const qrId = crypto.randomBytes(16).toString('base64url');
  const nonce = crypto.randomBytes(16).toString('base64url');

  const header: QrHeader = { alg: ALG, typ: 'JWT', kid: KID };
  const payload: QrPayload = {
    typ: TYP,
    iss: ISS,
    aud: AUD,
    institutionId: params.institutionId,
    classId: params.classId,
    sessionId: params.sessionId,
    qrId,
    nonce,
    iat: now,
    nbf: now,
    exp: now + params.ttlSec,
  };

  const headerB64 = b64urlEncode(JSON.stringify(header));
  const payloadB64 = b64urlEncode(JSON.stringify(payload));
  const sig = hmacSign(`${headerB64}.${payloadB64}`, secret);
  const token = `${headerB64}.${payloadB64}.${sig}`;

  return { token, qrId, nonce, exp: payload.exp, iat: payload.iat };
}

function safeJsonParse<T>(raw: string): T | null {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function verifyToken(token: unknown): VerifyResult {
  if (typeof token !== 'string' || !token) {
    return { ok: false, code: 'INVALID_FORMAT' };
  }
  const parts = token.split('.');
  if (parts.length !== 3) return { ok: false, code: 'INVALID_FORMAT' };
  const [headerB64, payloadB64, sigB64] = parts as [string, string, string];
  if (!headerB64 || !payloadB64 || !sigB64) {
    return { ok: false, code: 'INVALID_FORMAT' };
  }

  // Parse header first so we can decide WRONG_ALG vs INVALID_FORMAT.
  let header: Partial<QrHeader> | null;
  try {
    header = safeJsonParse<Partial<QrHeader>>(b64urlDecode(headerB64).toString('utf8'));
  } catch {
    return { ok: false, code: 'INVALID_FORMAT' };
  }
  if (!header || typeof header !== 'object') {
    return { ok: false, code: 'INVALID_FORMAT' };
  }

  // CRITICAL: reject alg=none and anything other than HS256. Defense
  // against the classic "alg: none" attack and key-confusion attacks.
  if (header.alg !== ALG) return { ok: false, code: 'WRONG_ALG' };
  if (header.typ !== 'JWT') return { ok: false, code: 'INVALID_FORMAT' };
  if (header.kid !== KID) return { ok: false, code: 'WRONG_ALG' };

  // Compute the expected signature and compare in constant time.
  let secret: string;
  try {
    secret = getSecret();
  } catch (e) {
    // Re-throw — this is a deployment misconfiguration, not a client error.
    throw e;
  }
  const expectedSig = hmacSign(`${headerB64}.${payloadB64}`, secret);
  const a = Buffer.from(sigB64);
  const b = Buffer.from(expectedSig);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return { ok: false, code: 'BAD_SIGNATURE' };
  }

  // Now safe to parse the payload (signature has been validated).
  let payload: Partial<QrPayload> | null;
  try {
    payload = safeJsonParse<Partial<QrPayload>>(b64urlDecode(payloadB64).toString('utf8'));
  } catch {
    return { ok: false, code: 'INVALID_FORMAT' };
  }
  if (!payload || typeof payload !== 'object') {
    return { ok: false, code: 'INVALID_FORMAT' };
  }

  if (payload.typ !== TYP) return { ok: false, code: 'WRONG_TYP' };
  if (payload.iss !== ISS) return { ok: false, code: 'WRONG_ISS' };
  if (payload.aud !== AUD) return { ok: false, code: 'WRONG_AUD' };

  const now = Math.floor(Date.now() / 1000);
  if (typeof payload.nbf !== 'number' || typeof payload.exp !== 'number') {
    return { ok: false, code: 'INVALID_FORMAT' };
  }
  if (now < payload.nbf) return { ok: false, code: 'NOT_YET_VALID' };
  if (now > payload.exp) return { ok: false, code: 'EXPIRED' };

  if (
    typeof payload.institutionId !== 'string' ||
    typeof payload.classId !== 'string' ||
    typeof payload.sessionId !== 'string' ||
    typeof payload.qrId !== 'string' ||
    typeof payload.nonce !== 'string' ||
    typeof payload.iat !== 'number'
  ) {
    return { ok: false, code: 'INVALID_FORMAT' };
  }

  return { ok: true, payload: payload as QrPayload };
}

/** Test-only helper to forge a custom-header token (used by alg=none test). */
export function __testForgeToken(header: Record<string, unknown>, payload: Record<string, unknown>, secret: string): string {
  const headerB64 = b64urlEncode(JSON.stringify(header));
  const payloadB64 = b64urlEncode(JSON.stringify(payload));
  // If alg is 'none', emit an empty signature; otherwise sign with provided secret.
  const sig =
    (header as { alg?: string }).alg === 'none' ? '' : hmacSign(`${headerB64}.${payloadB64}`, secret);
  return `${headerB64}.${payloadB64}.${sig}`;
}
