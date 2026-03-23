import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../lib/utils';

/**
 * Global error handler middleware.
 */
export const errorMiddleware = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      statusCode: err.statusCode,
      message: err.message,
      data: null,
    });
    return;
  }

  console.error('Unhandled Error:', err);

  res.status(500).json({
    success: false,
    statusCode: 500,
    message: process.env.NODE_ENV === 'production'
      ? 'Internal Server Error'
      : err.message,
    data: null,
  });
};
