import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import { ApiError } from '../lib/utils';
import jwt from 'jsonwebtoken';
import { config } from '../config';

/**
 * Auth middleware — verifies JWT token from Authorization header.
 * Stub: replace with actual JWT verification logic.
 */
export const authMiddleware = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'Authentication required');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new ApiError(401, 'Invalid token');
    }

    const decoded = jwt.verify(token, config.jwt.secret) as any;
    req.user = decoded;

    next();
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(401, 'Authentication failed'));
    }
  }
};
