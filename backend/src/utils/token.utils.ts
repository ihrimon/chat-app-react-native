import jwt, { TokenExpiredError } from 'jsonwebtoken';
import envConfig from '../config/env.config';
import { TTokenPayload, TVerifyTokenResult } from '../types';

/* ======== Generate Access Token ======== */
export const generateAccessToken = (payload: TTokenPayload) => {
  return jwt.sign(payload, envConfig.jwt_access_secret as string, {
    expiresIn: envConfig.jwt_access_expires_in,
  });
};

/* ======== Verify Access Token ======== */
export const verifyAccessToken = (token: string): TVerifyTokenResult => {
  try {
    return {
      valid: true,
      expired: false,
      decoded: jwt.verify(
        token,
        envConfig.jwt_access_secret as string,
      ) as TTokenPayload,
    };
  } catch (err: unknown) {
    return {
      valid: false,
      expired: err instanceof TokenExpiredError,
      decoded: null,
    };
  }
};

/* ======== Generate Refresh Token ======== */
export const generateRefreshToken = (payload: TTokenPayload) => {
  return jwt.sign(payload, envConfig.jwt_refresh_secret as string, {
    expiresIn: envConfig.jwt_refresh_expires_in,
  });
};

/* ======== Verify Refresh Token ======== */
export const verifyRefreshToken = (token: string): TVerifyTokenResult => {
  try {
    return {
      valid: true,
      expired: false,
      decoded: jwt.verify(
        token,
        envConfig.jwt_refresh_secret as string,
      ) as TTokenPayload,
    };
  } catch (err: unknown) {
    return {
      valid: false,
      expired: err instanceof TokenExpiredError,
      decoded: null,
    };
  }
};
