import { NextFunction, Response } from 'express';
import { AuthRequest } from '../types';

type AsyncHandler = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => Promise<void>;

const catchAsync = (fn: AsyncHandler) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };
};

export default catchAsync;
