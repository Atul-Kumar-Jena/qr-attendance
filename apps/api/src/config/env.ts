import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url().default('redis://localhost:6379'),
  JWT_ACCESS_SECRET: z.string().min(16),
  JWT_REFRESH_SECRET: z.string().min(16),
  JWT_ACCESS_TTL: z.coerce.number().default(900),
  JWT_REFRESH_TTL: z.coerce.number().default(60 * 60 * 24 * 30),
  QR_SIGNING_KEY: z.string().min(16),
  QR_DEFAULT_TTL_SEC: z.coerce.number().min(3).max(60).default(10),
  APP_REQUEST_KEY: z.string().min(8).default('dev-app-key'),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
});

export const env = schema.parse(process.env);
