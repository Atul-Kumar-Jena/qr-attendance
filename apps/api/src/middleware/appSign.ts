import crypto from 'node:crypto';
import type { Request, Response, NextFunction } from 'express';
import { env } from '../config/env.js';
import { redis, APP_NONCE_PREFIX } from '../config/redis.js';

/**
 * Request signing for mobile-app routes.
 *
 *   X-App-Signature = HMAC_SHA256(method + "\n" + path + "\n" + body + "\n" + ts + "\n" + nonce, APP_KEY)
 *   X-App-Timestamp = unix seconds
 *   X-App-Nonce     = random per-request
 *
 * Anti-replay window: ±30s; nonces remembered for 60s.
 */
export function requireAppSignature(req: Request, res: Response, next: NextFunction) {
  const sig = req.header('x-app-signature');
  const ts = req.header('x-app-timestamp');
  const nonce = req.header('x-app-nonce');
  if (!sig || !ts || !nonce) return res.status(401).json({ error: 'APP_SIG_MISSING' });

  const now = Math.floor(Date.now() / 1000);
  const tsNum = Number(ts);
  if (!Number.isFinite(tsNum) || Math.abs(now - tsNum) > 30) {
    return res.status(401).json({ error: 'APP_SIG_STALE' });
  }

  const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body ?? {});
  const mac = crypto
    .createHmac('sha256', env.APP_REQUEST_KEY)
    .update(`${req.method}\n${req.path}\n${body}\n${ts}\n${nonce}`)
    .digest('base64url');

  const a = Buffer.from(sig);
  const b = Buffer.from(mac);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return res.status(401).json({ error: 'APP_SIG_INVALID' });
  }

  redis.set(`${APP_NONCE_PREFIX}${nonce}`, '1', 'EX', 60, 'NX').then((rv) => {
    if (rv !== 'OK') return res.status(401).json({ error: 'APP_SIG_REPLAY' });
    next();
  }).catch(next);
}
