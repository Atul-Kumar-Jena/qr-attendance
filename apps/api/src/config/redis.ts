import Redis from 'ioredis';
import { env } from './env.js';

export const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
});

export const NONCE_PREFIX = 'qr:nonce:';
export const RATELIMIT_PREFIX = 'rl:';
export const APP_NONCE_PREFIX = 'app:nonce:';
