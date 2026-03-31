import { cookieOptions } from '../../config/env.config';
import catchAsync from '../../utils/catch-async.utils';
import * as authService from './auth.service';

/* ======== Register ======== */
export const register = catchAsync(async (req, res) => {
  const { name, email, password } = req.body;
  const { user, refreshToken } = await authService.registerUser(
    name,
    email,
    password,
  );

  // refreshToken → HTTP-only cookie
  res.cookie('refresh-token', refreshToken, cookieOptions);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: user,
  });
});

/* ======== Login ======== */
export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const { user, refreshToken } = await authService.loginUser(
    email,
    password,
  );

  // refreshToken → HTTP-only cookie
  res.cookie('refresh-token', refreshToken, cookieOptions);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: user,
  });
});

/* ======== Refresh Token ======== */
export const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const { accessToken } = await authService.refreshAccessToken(refreshToken);

  res.status(200).json({
    success: true,
    message: 'Token refreshed successfully',
    data: null,
  });
});

/* ======== Logout ======== */
export const logout = catchAsync(async (_req, res) => {
  // Cookie clear → refreshToken invalid
  res.clearCookie('refresh-token', cookieOptions);

  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
    data: null,
  });
});
