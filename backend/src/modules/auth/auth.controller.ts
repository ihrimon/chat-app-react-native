import { cookieOptions } from '../../config/env.config';
import { ApiResponse } from '../../utils/api-response.utils';
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

  res.cookie('refresh-token', refreshToken, cookieOptions);
  ApiResponse.created(res, 'User registered successfully', user);
});

/* ======== Login ======== */
export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const { user, refreshToken } = await authService.loginUser(email, password);

  res.cookie('refresh-token', refreshToken, cookieOptions);
  ApiResponse.success(res, 'Login successful', user);
});

/* ======== Refresh Token ======== */
export const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const { accessToken } = await authService.refreshAccessToken(refreshToken);

  ApiResponse.success(res, 'Token refreshed successfully', { accessToken });
});

/* ======== Logout ======== */
export const logout = catchAsync(async (_req, res) => {
  res.clearCookie('refresh-token', cookieOptions);
  ApiResponse.success(res, 'Logged out successfully');
});
