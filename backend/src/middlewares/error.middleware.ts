import { NextFunction, Request, Response } from 'express';
import { TFieldError } from '../types/response.types';
import { AppError } from '../utils/app-error.utils';

/* ======== Global Error Handler ======== */
export const globalErrorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  /* ======== Custom AppError ======== */
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      statusCode: err.statusCode,
      message: err.message,
      data: null,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
  }

  /* ======== Mongoose Validation Error ======== */
  if (err.name === 'ValidationError') {
    const errors: TFieldError[] = Object.values((err as any).errors).map(
      (e: any) => ({
        field: e.path,
        message: e.message,
      }),
    );

    return res.status(422).json({
      success: false,
      statusCode: 422,
      message: 'Validation failed',
      data: null,
      errors,
    });
  }

  /* ======== Mongoose Duplicate Key Error ======== */
  if ((err as any).code === 11000) {
    const field = Object.keys((err as any).keyValue)[0];
    return res.status(409).json({
      success: false,
      statusCode: 409,
      message: `${field} already exists`,
      data: null,
    });
  }

  /* ======== Cast Error ======== */
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: `Invalid ${(err as any).path}: ${(err as any).value}`,
      data: null,
    });
  }

  /* ======== JWT Errors ======== */
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      statusCode: 401,
      message: 'Invalid token',
      data: null,
    });
  }

  /* ======== Expired Token Error ======== */
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      statusCode: 401,
      message: 'Token expired',
      data: null,
      code: 'TOKEN_EXPIRED',
    });
  }

  /* ======== Unhandled Error ======== */
  return res.status(500).json({
    success: false,
    statusCode: 500,
    message: 'Something went wrong',
    data: null,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

/* ======== Not Found Error ======== */
export const notFoundHandler = (
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: `The requested ${req.method} method and ${req.originalUrl} route does not exist.`,
    data: null,
  });
};
