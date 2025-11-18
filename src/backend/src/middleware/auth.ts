import { Request, Response, NextFunction } from 'express';
import { JWTUtil, JWTPayload } from '../utils/jwt';
import { AuthenticationError } from './errorHandler';
import { SubscriptionTier } from '@archetect/shared/types';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('No authentication token provided');
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    try {
      const payload = JWTUtil.verifyAccessToken(token);
      req.user = payload;
      next();
    } catch (error) {
      if (error instanceof Error) {
        throw new AuthenticationError(error.message);
      }
      throw new AuthenticationError('Invalid authentication token');
    }
  } catch (error) {
    next(error);
  }
};

export const requireSubscription = (...tiers: SubscriptionTier[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AuthenticationError('Authentication required'));
    }

    const userTier = req.user.subscriptionTier as SubscriptionTier;

    if (!tiers.includes(userTier)) {
      return next(
        new AuthenticationError(
          `This feature requires ${tiers.join(' or ')} subscription`
        )
      );
    }

    next();
  };
};

export const optionalAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    try {
      const payload = JWTUtil.verifyAccessToken(token);
      req.user = payload;
    } catch {
      // Token is invalid, but that's ok for optional auth
      req.user = undefined;
    }
  }

  next();
};
