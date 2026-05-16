import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { createServer } from 'node:http';
import { Server as SocketIOServer } from 'socket.io';
import pinoHttp from 'pino-http';
import { env } from './config/env.js';
import { authRouter } from './modules/auth/auth.controller.js';
import { qrRouter } from './modules/qr/qr.controller.js';
import { attendanceRouter } from './modules/attendance/attendance.controller.js';
import { sessionsRouter } from './modules/sessions/sessions.controller.js';
import { siteConfigRouter } from './modules/site-config/site-config.controller.js';
import { institutionsRouter } from './modules/institutions/institutions.controller.js';
import { teacherPermsRouter } from './modules/teacher-permissions/teacher-permissions.controller.js';
import { usersRouter } from './modules/users/users.controller.js';
import { studentsRouter } from './modules/students/students.controller.js';
import { remarksRouter } from './modules/remarks/remarks.controller.js';
import { mintToken } from './modules/qr/qr.service.js';
import { prisma } from './config/db.js';

const app = express();
app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: '256kb' }));
app.use(pinoHttp());

app.get('/health', (_req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

app.use('/v1/auth', authRouter);
app.use('/v1/qr', qrRouter);
app.use('/v1/attendance', attendanceRouter);
app.use('/v1/sessions', sessionsRouter);
app.use('/v1/site-config', siteConfigRouter);
app.use('/v1/institutions', institutionsRouter);
app.use('/v1/teacher-permissions', teacherPermsRouter);
app.use('/v1/users', usersRouter);
app.use('/v1/students', studentsRouter);
app.use('/v1/remarks', remarksRouter);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if ((err as { name?: string }).name === 'ZodError') {
    return res.status(400).json({ error: 'VALIDATION', detail: (err as unknown as { issues: unknown }).issues });
  }
  console.error(err);
  res.status(500).json({ error: 'INTERNAL' });
});

const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, { cors: { origin: env.CORS_ORIGIN } });

io.of('/sessions').on('connection', (socket) => {
  socket.on('join', async ({ sessionId }: { sessionId: string }) => {
    const s = await prisma.classSession.findUnique({
      where: { id: sessionId },
      select: { id: true, klassId: true, institutionId: true, status: true, qrRotationSec: true },
    });
    if (!s || s.status !== 'OPEN') return socket.emit('error', 'NOT_OPEN');
    socket.join(`session:${sessionId}`);
    const tick = async () => {
      const fresh = await prisma.classSession.findUnique({
        where: { id: sessionId }, select: { status: true },
      });
      if (!fresh || fresh.status !== 'OPEN') {
        clearInterval(timer);
        socket.emit('session:ended');
        return;
      }
      const { token, payload } = await mintToken({
        institutionId: s.institutionId, classId: s.klassId,
        sessionId: s.id, ttlSec: s.qrRotationSec,
      });
      socket.emit('qr:tick', { token, expiresAt: payload.exp * 1000 });
    };
    await tick();
    const timer = setInterval(tick, s.qrRotationSec * 1000);
    socket.on('disconnect', () => clearInterval(timer));
  });
});

httpServer.listen(env.PORT, () => {
  console.log(`[attendly] api listening on :${env.PORT}`);
});
