import { AuthRequest, TUserRole } from '../types';
import { ApiResponse } from '../utils/api-response.utils';
import catchAsync from '../utils/catch-async.utils';
import { verifyAccessToken } from '../utils/token.utils';

/* ======== Authentication Middleware ======== */
export const authenticate = catchAsync<AuthRequest>(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    ApiResponse.unauthorized(res, 'No token provided');
    return;
  }

  const token = authHeader.split(' ')[1];

  const { valid, expired, decoded } = verifyAccessToken(token);

  if (expired) {
    ApiResponse.unauthorized(res, 'Access token expired');
    return;
  }

  if (!valid) {
    ApiResponse.unauthorized(res, 'Invalid token');
    return;
  }

  req.user = decoded ?? undefined;
  next();
});

/* ======== Role-based Access Control ======== */
export const authorize = (...roles: TUserRole[]) => {
  return catchAsync<AuthRequest>(async (req, res, next) => {
    if (!req.user) {
      ApiResponse.unauthorized(res, 'Unauthorized Access');
      return;
    }

    if (!roles.includes(req.user.role)) {
      ApiResponse.forbidden(res, 'You do not have permission');
      return;
    }

    next();
  });
};
