import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { TFieldError } from '../types/response.types';
import { ApiResponse } from '../utils/api-response.utils';

const validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors: TFieldError[] = result.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));

      ApiResponse.validationError(res, errors);
      return;
    }

    req.body = result.data;
    next();
  };
};

export default validate;
