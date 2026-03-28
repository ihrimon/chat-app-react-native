import { Request, Response, NextFunction } from 'express';

export const validateRegister = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ message: 'All fields are required' });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: 'Invalid email format' });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({ message: 'Password must be at least 6 characters' });
    return;
  }

  next();
};

export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: 'Email and password are required' });
    return;
  }

  next();
};
