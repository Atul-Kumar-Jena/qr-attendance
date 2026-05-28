import type { Request, Response, NextFunction } from 'express';
import { verifyAccess, roleLevel, type AccessClaims, type UserRole } from '../utils/jwt.js';

export { roleLevel };

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AccessClaims;
      institutionId?: string;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const h = req.header('authorization');
  if (!h?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'UNAUTHENTICATED' });
  }
  try {
    const claims = verifyAccess(h.slice(7));
    req.user = claims;
    req.institutionId = claims.inst;
    next();
  } catch {
    res.status(401).json({ error: 'INVALID_TOKEN' });
  }
}

/** Require the caller to have one of the exact listed roles. */
export function requireRole(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: 'UNAUTHENTICATED' });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'FORBIDDEN' });
    }
    next();
  };
}

/** Require the caller's role to be at least as privileged as `minRole`. */
export function requireMinRole(minRole: UserRole) {
  const min = roleLevel(minRole);
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: 'UNAUTHENTICATED' });
    if (roleLevel(req.user.role) < min) {
      return res.status(403).json({ error: 'FORBIDDEN' });
    }
    next();
  };
}

/** DEVELOPER-only guard. */
export function requireDeveloper(req: Request, res: Response, next: NextFunction) {
  if (!req.user) return res.status(401).json({ error: 'UNAUTHENTICATED' });
  if (req.user.role !== 'DEVELOPER') return res.status(403).json({ error: 'FORBIDDEN' });
  next();
}
