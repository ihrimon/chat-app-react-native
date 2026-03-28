import catchAsync from '../../utils/catch-async';
import cookieOptions from '../../utils/cookie-option';
import * as authService from './auth.service';

/* ────── Register ────── */
export const register = catchAsync(async (req, res) => {
  const { name, email, password } = req.body;
  const { user, accessToken, refreshToken } = await authService.registerUser(
    name,
    email,
    password,
  );

  // refreshToken → HTTP-only cookie
  res.cookie('refresh-token', refreshToken, cookieOptions);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    accessToken, // store in client(memory/state)
    data: user,
  });
});

/* ────── Login ────── */
export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const { user, accessToken, refreshToken } = await authService.loginUser(
    email,
    password,
  );

  // refreshToken → HTTP-only cookie
  res.cookie('refresh-token', refreshToken, cookieOptions);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    accessToken, // store in client(memory/state)
    data: user,
  });
});

/* ────── Refresh Token ────── */
export const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const { accessToken } = await authService.refreshAccessToken(refreshToken);

  res.status(200).json({
    success: true,
    message: 'Token refreshed successfully',
    accessToken,
    data: null,
  });
});

/* ────── Logout ────── */
export const logout = catchAsync(async (_req, res) => {
  // Cookie clear → refreshToken invalid
  res.clearCookie('refresh-token', cookieOptions);

  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
    data: null,
  });
});
