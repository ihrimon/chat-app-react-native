import { NextFunction, Request, Response } from 'express';

type AsyncHandler<T extends Request = Request> = (
  req: T,
  res: Response,
  next: NextFunction,
) => Promise<unknown>;

const catchAsync = <T extends Request = Request>(fn: AsyncHandler<T>) => {
  return (req: T, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next);
  };
};

export default catchAsync;
