import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { MulterError } from 'multer';

export interface ApiError extends Error {
  statusCode?: number;
  errors?: any[];
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: err.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message
      }))
    });
  }

  // Handle Multer errors
  if (err instanceof MulterError) {
    let message = 'File upload error';
    switch (err.code) {
      case 'LIMIT_FILE_SIZE':
        message = 'File is too large. Maximum size is 10MB';
        break;
      case 'LIMIT_FILE_COUNT':
        message = 'Too many files';
        break;
      case 'LIMIT_UNEXPECTED_FILE':
        message = 'Unexpected field';
        break;
      default:
        message = err.message;
    }
    return res.status(400).json({
      success: false,
      message,
      error: err.code
    });
  }

  // Handle MongoDB duplicate key errors
  if (err.name === 'MongoServerError' && (err as any).code === 11000) {
    const field = Object.keys((err as any).keyValue)[0];
    return res.status(409).json({
      success: false,
      message: `${field} already exists`,
      error: 'DUPLICATE_KEY'
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
      error: 'INVALID_TOKEN'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired',
      error: 'TOKEN_EXPIRED'
    });
  }

  // Handle custom API errors
  const apiError = err as ApiError;
  if (apiError.statusCode) {
    return res.status(apiError.statusCode).json({
      success: false,
      message: apiError.message,
      errors: apiError.errors
    });
  }

  // Handle all other errors
  return res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};