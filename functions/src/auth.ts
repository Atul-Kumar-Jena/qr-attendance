import type { Request, Response, NextFunction } from 'express';
import * as admin from 'firebase-admin';

export type AuthedUser = {
  uid: string;
  email: string | null;
  emailVerified: boolean;
  name: string | null;
};

export type AuthedRequest = Request & {
  user?: AuthedUser;
  clientIp?: string;
};

/**
 * Express middleware: verifies the `Authorization: Bearer <idToken>` header
 * against Firebase Auth and attaches `req.user`. Fails closed with 401.
 */
export async function authMiddleware(
  req: AuthedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const authHeader = req.header('authorization') || req.header('Authorization');
    if (!authHeader || !authHeader.toLowerCase().startsWith('bearer ')) {
      res.status(401).json({ ok: false, code: 'NO_AUTH', reason: 'Missing Bearer token' });
      return;
    }
    const idToken = authHeader.slice('bearer '.length).trim();
    if (!idToken) {
      res.status(401).json({ ok: false, code: 'NO_AUTH', reason: 'Empty token' });
      return;
    }
    const decoded = await admin.auth().verifyIdToken(idToken);
    req.user = {
      uid: decoded.uid,
      email: decoded.email ?? null,
      emailVerified: Boolean(decoded.email_verified),
      name: (decoded.name as string | undefined) ?? null,
    };
    // Best-effort client IP (Cloud Functions sets x-forwarded-for).
    const xff = req.header('x-forwarded-for');
    req.clientIp = (xff?.split(',')[0]?.trim() || req.ip || 'unknown').toString();
    next();
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    res.status(401).json({ ok: false, code: 'BAD_TOKEN', reason: msg });
  }
}

export type UserRole = 'developer' | 'admin' | 'institution' | 'teacher' | 'student' | 'unknown';

/** Reads `users/{uid}` and returns the role string (lowercased). */
export async function loadUserRole(uid: string): Promise<UserRole> {
  const snap = await admin.firestore().collection('users').doc(uid).get();
  if (!snap.exists) return 'unknown';
  const data = snap.data() ?? {};
  const raw = (data.role ?? data.userRole ?? '').toString().toLowerCase();
  if (
    raw === 'developer' ||
    raw === 'admin' ||
    raw === 'institution' ||
    raw === 'teacher' ||
    raw === 'student'
  ) {
    return raw;
  }
  return 'unknown';
}
