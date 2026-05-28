import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import { env } from '../config/env.js';

export type UserRole = 'DEVELOPER' | 'INSTITUTION' | 'ADMIN' | 'TEACHER' | 'STUDENT';

// Numeric level for hierarchy checks (higher = more privilege)
const ROLE_LEVEL: Record<UserRole, number> = {
  DEVELOPER:   50,
  INSTITUTION: 40,
  ADMIN:       30,
  TEACHER:     20,
  STUDENT:     10,
};

export function roleLevel(role: UserRole): number {
  return ROLE_LEVEL[role] ?? 0;
}

export interface AccessClaims {
  sub: string;    // userId or studentId
  role: UserRole;
  inst: string;   // institutionId
  bg?: number;    // device binding generation (students only)
}

export function signAccess(claims: AccessClaims): string {
  return jwt.sign(claims, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_TTL,
    algorithm: 'HS256',
  });
}

export function verifyAccess(token: string): AccessClaims {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessClaims;
}

export function mintRefresh(): { plain: string; hash: string; familyId: string } {
  const plain = crypto.randomBytes(32).toString('base64url');
  const hash = crypto.createHash('sha256').update(plain).digest('hex');
  const familyId = crypto.randomUUID();
  return { plain, hash, familyId };
}

export function hashToken(plain: string): string {
  return crypto.createHash('sha256').update(plain).digest('hex');
}
