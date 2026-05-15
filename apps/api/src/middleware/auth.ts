import type { Request, Response, NextFunction } from 'express';
import { verifyAccess, type AccessClaims } from '../utils/jwt.js';

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

export function requireRole(...roles: AccessClaims['role'][]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: 'UNAUTHENTICATED' });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'FORBIDDEN' });
    }
    next();
  };
}
