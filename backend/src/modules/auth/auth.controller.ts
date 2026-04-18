import {
  cookieOptions,
  refreshTokenCookieOptions,
} from '../../config/env.config';
import { AuthRequest } from '../../types';
import { ApiResponse } from '../../utils/api-response.utils';
import { AppError } from '../../utils/app-error.utils';
import catchAsync from '../../utils/catch-async.utils';
import * as authService from './auth.service';

/* ======== Register ======== */
export const register = catchAsync(async (req, res) => {
  const { name, email, password } = req.body;
  const { user, accessToken, refreshToken } = await authService.registerUser(
    name,
    email,
    password,
  );

  res.cookie('refresh-token', refreshToken, refreshTokenCookieOptions);
  ApiResponse.created(res, 'User registered successfully', {
    user,
    accessToken,
  });
});

/* ======== Login ======== */
export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const { user, accessToken, refreshToken } = await authService.loginUser(
    email,
    password,
  );

  res.cookie('refresh-token', refreshToken, refreshTokenCookieOptions);
  ApiResponse.success(res, 'Login successful', { user, accessToken });
});

/* ======== Refresh Token ======== */
export const refreshToken = catchAsync(async (req, res) => {
  const refreshToken = req.cookies['refresh-token'];

  const { accessToken } = await authService.refreshAccessToken(refreshToken);

  ApiResponse.success(res, 'Token refreshed successfully', {
    accessToken,
  });
});

/* ======== Get Current User ======== */
export const getCurrentUser = catchAsync<AuthRequest>(async (req, res) => {
  const user = await authService.currentUser(req.user!.id);

  ApiResponse.success(res,  'Current user retrieved successfully', user);
});

/* ======== Logout ======== */
export const logout = catchAsync(async (req, res) => {
  const refreshTokenValue = req.cookies['refresh-token'];

  // if cookie is not present, it means user is already logged out
  if (!refreshTokenValue) {
    throw new AppError('You are already logged out', 400);
  }

  res.clearCookie('refresh-token', cookieOptions);
  ApiResponse.success(res, 'Logged out successfully');
});
