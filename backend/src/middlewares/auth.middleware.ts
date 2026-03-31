import { AuthRequest, TUserRole } from '../types';
import catchAsync from '../utils/catch-async.utils';
import { verifyAccessToken } from '../utils/token.utils';

/* ======== Authentication Middleware ======== */
export const authenticate = catchAsync<AuthRequest>(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'No token provided' });
    return;
  }

  const token = authHeader.split(' ')[1];

  const { valid, expired, decoded } = verifyAccessToken(token);

  if (expired) {
    res.status(401).json({
      success: false,
      message: 'Access token expired',
      code: 'TOKEN_EXPIRED',
    });
    return;
  }

  if (!valid) {
    res.status(403).json({
      success: false,
      message: 'Invalid token',
    });
    return;
  }

  req.user = decoded ?? undefined;
  next();
});

/* ======== Role-based Access Control ======== */
export const authorize = (...roles: TUserRole[]) => {
  return catchAsync<AuthRequest>(async (req, res, next) => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: 'You do not have permission',
      });
      return;
    }

    next();
  });
};
