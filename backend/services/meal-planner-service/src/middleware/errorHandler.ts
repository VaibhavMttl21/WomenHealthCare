import { Request, Response, NextFunction } from 'express';

/**
 * Global error handling middleware
 */
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error('Error:', err);

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
}

/**
 * Not found middleware for undefined routes
 */
export function notFound(req: Request, res: Response, next: NextFunction): void {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
}
