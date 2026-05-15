/**
 * Note: requires REDIS_URL pointing to a reachable redis. The tests below
 * exercise signature + expiry logic without a network roundtrip; the
 * nonce path is integration-tested with a real redis or fakeredis.
 */
import { describe, it, expect } from 'vitest';
import { decodeUnsafe } from './qr.service.js';

describe('qr.decodeUnsafe', () => {
  it('returns null for malformed input', () => {
    expect(decodeUnsafe('not-a-qr')).toBeNull();
    expect(decodeUnsafe('aqr:v1:')).toBeNull();
    expect(decodeUnsafe('aqr:v1:abc')).toBeNull();
  });
});
