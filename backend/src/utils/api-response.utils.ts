import { Response } from 'express';
import { TMeta, TFieldError } from '../types/response.types';

export class ApiResponse {
  /* ======== 200 OK ======== */
  static success<T>(res: Response, message: string, data?: T, meta?: TMeta) {
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message,
      data: data ?? null,
      ...(meta && { meta }),
    });
  }

  /* ======== 201 Created ======== */
  static created<T>(res: Response, message: string, data?: T) {
    return res.status(201).json({
      success: true,
      statusCode: 201,
      message,
      data: data ?? null,
    });
  }

  /* ======== 400 Bad Request ======== */
  static badRequest(res: Response, message: string, errors?: TFieldError[]) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message,
      data: null,
      ...(errors && { errors }),
    });
  }

  /* ======== 401 Unauthorized ======== */
  static unauthorized(res: Response, message = 'Unauthorized') {
    return res.status(401).json({
      success: false,
      statusCode: 401,
      message,
      data: null,
    });
  }

  /* ======== 403 Forbidden ======== */
  static forbidden(res: Response, message = 'Access denied') {
    return res.status(403).json({
      success: false,
      statusCode: 403,
      message,
      data: null,
    });
  }

  /* ======== 404 Not Found ======== */
  static notFound(res: Response, message = 'Resource not found') {
    return res.status(404).json({
      success: false,
      statusCode: 404,
      message,
      data: null,
    });
  }

  /* ======== 409 Conflict ======== */
  static conflict(res: Response, message: string) {
    return res.status(409).json({
      success: false,
      statusCode: 409,
      message,
      data: null,
    });
  }

  /* ======== 422 Validation Error ======== */
  static validationError(res: Response, errors: TFieldError[]) {
    return res.status(422).json({
      success: false,
      statusCode: 422,
      message: 'Validation failed',
      data: null,
      errors,
    });
  }
 
  /* ======== 500 Internal Server Error ======== */
  static serverError(
    res: Response,
    message = 'Internal server error',
    stack?: string,
  ) {
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message,
      data: null,
      ...(process.env.NODE_ENV === 'development' && stack && { stack }),
    });
  }
}
