import jwt from 'jsonwebtoken';
import envConfig from '../config/env.config';
import { TUserRole } from '../types';

/* ────── Token Generator (no expiry) ────── */
export const generateAccessToken = (userId: string, role: TUserRole, email: string): string => {
  return jwt.sign({ id: userId, role, email }, envConfig.jwt_access_secret as string);
};

export const generateRefreshToken = (userId: string): string => {
  return jwt.sign({ id: userId }, envConfig.jwt_refresh_secret as string, {
    expiresIn: '30d',
  });
};

export const verifyRefreshToken = (refreshToken: string) => {
  return jwt.verify(refreshToken, envConfig.jwt_refresh_secret as string) as { id: string };
};

export default {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
};
