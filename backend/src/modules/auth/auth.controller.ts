import { Request, Response } from 'express';
import * as authService from './auth.service';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    const { user, token } = await authService.registerUser(
      name,
      email,
      password,
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Registration failed';
    res.status(400).json({ success: false, message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.loginUser(email, password);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Login failed';
    res.status(401).json({ success: false, message });
  }
};

export const logout = async (_req: Request, res: Response): Promise<void> => {
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};
