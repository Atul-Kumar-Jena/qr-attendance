/**
 * Browser Web Crypto wrappers for the Attendly QR security model.
 *
 * Signing: ECDSA P-256 + SHA-256 (16-byte signatures, 32-byte keys)
 * Hashing: SHA-256
 *
 * Why P-256: short keys/sigs fit comfortably inside a QR payload,
 * supported in every modern browser and Node 16+.
 */

export type AlgoName = 'ECDSA-P256';
export const ALGO: AlgoName = 'ECDSA-P256';
const KEY_ALG: EcKeyGenParams = { name: 'ECDSA', namedCurve: 'P-256' };
const SIGN_ALG: EcdsaParams = { name: 'ECDSA', hash: 'SHA-256' };

function getSubtle(): SubtleCrypto {
  if (typeof window === 'undefined' || !window.crypto?.subtle) {
    throw new Error('Web Crypto API not available in this environment');
  }
  return window.crypto.subtle;
}

// ─── Encoding helpers ────────────────────────────────────────────────────────

const enc = new TextEncoder();
const dec = new TextDecoder();

// Convert any Uint8Array / typed-array view to a plain ArrayBuffer copy so
// SubtleCrypto (which insists on BufferSource without SharedArrayBuffer) is happy.
function toAb(data: string | Uint8Array): ArrayBuffer {
  const u8 = typeof data === 'string' ? enc.encode(data) : data;
  const copy = new Uint8Array(u8.length);
  copy.set(u8);
  return copy.buffer;
}

export function abToB64(buf: ArrayBuffer | Uint8Array): string {
  const b = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let s = '';
  for (let i = 0; i < b.length; i++) s += String.fromCharCode(b[i]);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function b64ToAb(b64: string): ArrayBuffer {
  const s = b64.replace(/-/g, '+').replace(/_/g, '/');
  const pad = s.length % 4 ? '='.repeat(4 - (s.length % 4)) : '';
  const raw = atob(s + pad);
  const buf = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) buf[i] = raw.charCodeAt(i);
  return buf.buffer;
}

// ─── Hashing ─────────────────────────────────────────────────────────────────

export async function sha256(data: string | Uint8Array): Promise<string> {
  const hash = await getSubtle().digest('SHA-256', toAb(data));
  return abToB64(hash);
}

export async function sha256Hex(data: string | Uint8Array): Promise<string> {
  const hash = await getSubtle().digest('SHA-256', toAb(data));
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// ─── Key generation / export ────────────────────────────────────────────────

export interface KeyPairExport {
  publicKey: string;   // base64url, SPKI
  privateKey: string;  // base64url, PKCS8
  algo: AlgoName;
  createdAt: number;
}

export async function generateKeyPair(): Promise<KeyPairExport> {
  const kp = await getSubtle().generateKey(KEY_ALG, true, ['sign', 'verify']);
  const [pub, priv] = await Promise.all([
    getSubtle().exportKey('spki', kp.publicKey),
    getSubtle().exportKey('pkcs8', kp.privateKey),
  ]);
  return {
    publicKey: abToB64(pub),
    privateKey: abToB64(priv),
    algo: ALGO,
    createdAt: Date.now(),
  };
}

async function importPrivate(b64: string): Promise<CryptoKey> {
  return getSubtle().importKey('pkcs8', b64ToAb(b64), KEY_ALG, false, ['sign']);
}

async function importPublic(b64: string): Promise<CryptoKey> {
  return getSubtle().importKey('spki', b64ToAb(b64), KEY_ALG, true, ['verify']);
}

// ─── Sign / Verify ───────────────────────────────────────────────────────────

export async function sign(privateKeyB64: string, payload: string): Promise<string> {
  const key = await importPrivate(privateKeyB64);
  const sig = await getSubtle().sign(SIGN_ALG, key, toAb(payload));
  return abToB64(sig);
}

export async function verify(
  publicKeyB64: string,
  payload: string,
  signatureB64: string,
): Promise<boolean> {
  try {
    const key = await importPublic(publicKeyB64);
    return await getSubtle().verify(
      SIGN_ALG,
      key,
      b64ToAb(signatureB64),
      toAb(payload),
    );
  } catch {
    return false;
  }
}

// ─── QR token format ─────────────────────────────────────────────────────────

/**
 * A signed QR token contains:
 *   v   = format version
 *   sid = session id
 *   t   = rotation tick (monotonic counter per session)
 *   ts  = issue timestamp (ms)
 *   ttl = token lifetime (ms)
 *   max = max uses (0 = unlimited per tick)
 *   non = 8-byte random nonce
 *
 * Final payload = base64url(JSON(claims)) + "." + base64url(signature)
 */

export interface QrClaims {
  v: 1;
  sid: string;
  t: number;
  ts: number;
  ttl: number;
  max: number;
  non: string;
  iss: string;  // institution id (issuer)
}

export function randomNonce(bytes = 8): string {
  if (typeof window === 'undefined' || !window.crypto) {
    throw new Error('crypto.getRandomValues unavailable');
  }
  const b = new Uint8Array(bytes);
  window.crypto.getRandomValues(b);
  return abToB64(b);
}

export async function signQrToken(
  privateKeyB64: string,
  claims: QrClaims,
): Promise<string> {
  const payload = abToB64(enc.encode(JSON.stringify(claims)) as Uint8Array);
  const sig = await sign(privateKeyB64, payload);
  return `${payload}.${sig}`;
}

export interface QrVerifyResult {
  ok: boolean;
  reason?: string;
  claims?: QrClaims;
}

export async function verifyQrToken(
  publicKeyB64: string,
  token: string,
  now: number = Date.now(),
): Promise<QrVerifyResult> {
  const parts = token.split('.');
  if (parts.length !== 2) return { ok: false, reason: 'malformed token' };
  const [payload, sig] = parts;

  let claims: QrClaims;
  try {
    claims = JSON.parse(dec.decode(b64ToAb(payload))) as QrClaims;
  } catch {
    return { ok: false, reason: 'invalid claims JSON' };
  }

  if (claims.v !== 1) return { ok: false, reason: `unknown version ${claims.v}` };

  const validSig = await verify(publicKeyB64, payload, sig);
  if (!validSig) return { ok: false, reason: 'signature mismatch', claims };

  const expiresAt = claims.ts + claims.ttl;
  if (now > expiresAt) return { ok: false, reason: 'token expired', claims };
  if (now < claims.ts - 5000) return { ok: false, reason: 'token from future', claims };

  return { ok: true, claims };
}

// ─── Geofence (Haversine) ────────────────────────────────────────────────────

export function haversineMeters(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const x = Math.sin(dLat / 2) ** 2
    + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}
