import { NextFunction, Request, Response } from 'express';
import { getSessionCookieName, verifySessionToken } from '../utils/auth';

function extractBearerToken(authHeader?: string): string | null {
  if (!authHeader) return null;
  const [scheme, token] = authHeader.split(' ');
  if (scheme !== 'Bearer' || !token) return null;
  return token;
}

export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const cookieToken = req.cookies?.[getSessionCookieName()] as string | undefined;
    const headerToken = extractBearerToken(req.header('Authorization'));
    const token = cookieToken ?? headerToken;

    if (!token) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const payload = verifySessionToken(token);

    req.authUser = {
      id: payload.sub,
      username: payload.username,
      role: payload.role,
    };

    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired session' });
  }
};

export const requireRole = (role: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.authUser) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    if (req.authUser.role !== role) {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }

    next();
  };
};
