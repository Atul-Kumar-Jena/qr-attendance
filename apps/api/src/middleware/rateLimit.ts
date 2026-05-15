import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import { redis } from '../config/redis.js';
import type { Request } from 'express';

const store = () => new RedisStore({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sendCommand: ((...args: string[]) => (redis as any).call(...args)) as never,
});

export const loginLimiter = rateLimit({
  windowMs: 60_000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  store: store(),
  keyGenerator: (req: Request) => `login:${req.ip}`,
});

export const scanLimiter = rateLimit({
  windowMs: 60_000,
  limit: 10,
  store: store(),
  keyGenerator: (req: Request) => `scan:${req.user?.sub ?? req.ip}`,
});

export const writeLimiter = rateLimit({
  windowMs: 60_000,
  limit: 60,
  store: store(),
  keyGenerator: (req: Request) => `write:${req.user?.sub ?? req.ip}`,
});
