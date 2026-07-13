import { describe, it, expect, beforeAll } from 'vitest';

// Set the secret BEFORE importing the module under test — the module reads
// it lazily, but we want it deterministic for the whole suite.
beforeAll(() => {
  process.env.ATTENDLY_QR_HMAC_SECRET = 'test-secret-32-bytes-min-aaaaaaaaa';
});
process.env.ATTENDLY_QR_HMAC_SECRET = 'test-secret-32-bytes-min-aaaaaaaaa';

import { mintToken, verifyToken, __testForgeToken } from '../qr';

const SECRET = 'test-secret-32-bytes-min-aaaaaaaaa';

function decodeB64Url(s: string): string {
  const pad = s.length % 4 === 0 ? '' : '='.repeat(4 - (s.length % 4));
  return Buffer.from(s.replace(/-/g, '+').replace(/_/g, '/') + pad, 'base64').toString('utf8');
}
function encodeB64Url(s: string): string {
  return Buffer.from(s).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

describe('QR token sign/verify', () => {
  it('round-trips a valid token', () => {
    const { token, qrId, nonce } = mintToken({
      institutionId: 'inst1',
      classId: 'class1',
      sessionId: 'sess1',
      ttlSec: 30,
    });
    const r = verifyToken(token);
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.payload.institutionId).toBe('inst1');
      expect(r.payload.classId).toBe('class1');
      expect(r.payload.sessionId).toBe('sess1');
      expect(r.payload.qrId).toBe(qrId);
      expect(r.payload.nonce).toBe(nonce);
    }
  });

  it('rejects a tampered payload as BAD_SIGNATURE', () => {
    const { token } = mintToken({
      institutionId: 'inst1', classId: 'c', sessionId: 's', ttlSec: 30,
    });
    const [h, p, sig] = token.split('.');
    // Decode, mutate, re-encode payload without re-signing.
    const original = JSON.parse(decodeB64Url(p));
    original.institutionId = 'attacker-controlled';
    const tampered = `${h}.${encodeB64Url(JSON.stringify(original))}.${sig}`;
    const r = verifyToken(tampered);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.code).toBe('BAD_SIGNATURE');
  });

  it('rejects alg=none as WRONG_ALG', () => {
    const forged = __testForgeToken(
      { alg: 'none', typ: 'JWT', kid: 'k1' },
      {
        typ: 'attendly.qr.v1', iss: 'attendly', aud: 'attendance-scan',
        institutionId: 'i', classId: 'c', sessionId: 's',
        qrId: 'q', nonce: 'n',
        iat: Math.floor(Date.now() / 1000),
        nbf: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 60,
      },
      SECRET,
    );
    const r = verifyToken(forged);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.code).toBe('WRONG_ALG');
  });

  it('rejects an expired token as EXPIRED', () => {
    const now = Math.floor(Date.now() / 1000);
    const forged = __testForgeToken(
      { alg: 'HS256', typ: 'JWT', kid: 'k1' },
      {
        typ: 'attendly.qr.v1', iss: 'attendly', aud: 'attendance-scan',
        institutionId: 'i', classId: 'c', sessionId: 's',
        qrId: 'q', nonce: 'n',
        iat: now - 120, nbf: now - 120, exp: now - 60,
      },
      SECRET,
    );
    const r = verifyToken(forged);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.code).toBe('EXPIRED');
  });

  it('rejects a not-yet-valid token as NOT_YET_VALID', () => {
    const now = Math.floor(Date.now() / 1000);
    const forged = __testForgeToken(
      { alg: 'HS256', typ: 'JWT', kid: 'k1' },
      {
        typ: 'attendly.qr.v1', iss: 'attendly', aud: 'attendance-scan',
        institutionId: 'i', classId: 'c', sessionId: 's',
        qrId: 'q', nonce: 'n',
        iat: now + 60, nbf: now + 60, exp: now + 120,
      },
      SECRET,
    );
    const r = verifyToken(forged);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.code).toBe('NOT_YET_VALID');
  });

  it('rejects wrong typ as WRONG_TYP', () => {
    const now = Math.floor(Date.now() / 1000);
    const forged = __testForgeToken(
      { alg: 'HS256', typ: 'JWT', kid: 'k1' },
      {
        typ: 'bogus', iss: 'attendly', aud: 'attendance-scan',
        institutionId: 'i', classId: 'c', sessionId: 's',
        qrId: 'q', nonce: 'n', iat: now, nbf: now, exp: now + 60,
      },
      SECRET,
    );
    const r = verifyToken(forged);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.code).toBe('WRONG_TYP');
  });

  it('rejects wrong iss as WRONG_ISS', () => {
    const now = Math.floor(Date.now() / 1000);
    const forged = __testForgeToken(
      { alg: 'HS256', typ: 'JWT', kid: 'k1' },
      {
        typ: 'attendly.qr.v1', iss: 'evil', aud: 'attendance-scan',
        institutionId: 'i', classId: 'c', sessionId: 's',
        qrId: 'q', nonce: 'n', iat: now, nbf: now, exp: now + 60,
      },
      SECRET,
    );
    const r = verifyToken(forged);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.code).toBe('WRONG_ISS');
  });

  it('rejects wrong aud as WRONG_AUD', () => {
    const now = Math.floor(Date.now() / 1000);
    const forged = __testForgeToken(
      { alg: 'HS256', typ: 'JWT', kid: 'k1' },
      {
        typ: 'attendly.qr.v1', iss: 'attendly', aud: 'other',
        institutionId: 'i', classId: 'c', sessionId: 's',
        qrId: 'q', nonce: 'n', iat: now, nbf: now, exp: now + 60,
      },
      SECRET,
    );
    const r = verifyToken(forged);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.code).toBe('WRONG_AUD');
  });

  it('rejects malformed token as INVALID_FORMAT', () => {
    expect(verifyToken('not-a-token')).toEqual({ ok: false, code: 'INVALID_FORMAT' });
    expect(verifyToken('')).toEqual({ ok: false, code: 'INVALID_FORMAT' });
    expect(verifyToken(null)).toEqual({ ok: false, code: 'INVALID_FORMAT' });
  });
});
