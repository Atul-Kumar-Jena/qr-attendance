import express from 'express';
import cors from 'cors';
import * as admin from 'firebase-admin';
import { onRequest } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import { setGlobalOptions, logger } from 'firebase-functions/v2';

import { authMiddleware } from './auth';
import { createSession } from './session';
import { qrToken } from './qrToken';
import { verifyScan } from './scan';

// Initialize admin once per cold start.
if (admin.apps.length === 0) {
  admin.initializeApp();
}

setGlobalOptions({ region: 'us-central1' });

const ATTENDLY_QR_HMAC_SECRET = defineSecret('ATTENDLY_QR_HMAC_SECRET');

const ALLOWED_ORIGINS = [
  'https://atul-kumar-jena.github.io',
  'http://localhost:3000',
];

const app = express();
app.use(cors({ origin: ALLOWED_ORIGINS, credentials: false }));
app.use(express.json({ limit: '32kb' }));

// Health probe — no auth, no business logic.
app.get('/health', (_req, res) => {
  res.status(200).json({ ok: true, service: 'attendly-functions', region: 'us-central1' });
});

// All real endpoints require a verified Firebase ID token.
app.use(authMiddleware);

app.post('/sessions', createSession);
app.get('/sessions/:sessionId/qr', qrToken);
app.post('/scan', verifyScan);

// Fallback 404 for unknown routes (keeps Express from leaking stack traces).
app.use((req, res) => {
  res.status(404).json({ ok: false, code: 'NOT_FOUND', path: req.path });
});

// Catch-all error handler.
app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error('Unhandled error', err);
  res.status(500).json({ ok: false, code: 'INTERNAL' });
});

export const attendlyApi = onRequest(
  {
    region: 'us-central1',
    secrets: [ATTENDLY_QR_HMAC_SECRET],
    cors: ALLOWED_ORIGINS,
    memory: '256MiB',
    timeoutSeconds: 30,
  },
  app,
);
