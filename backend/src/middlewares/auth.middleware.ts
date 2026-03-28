import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../modules/auth/auth.model';
import { AuthRequest, TUserRole } from '../types';
import catchAsync from '../utils/catch-async';
import envConfig from '../config/env.config';

const isAuth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ success: false, message: 'No token provided' });
        return;
      }

      const token = authHeader.split(' ')[1];

      const decoded = jwt.verify(token, envConfig.jwt_access_secret as string) as {
        id: string;
        role: TUserRole;
        email: string;
      };

      const { id, role, email } = decoded;

      if (requiredRoles.length > 0 && !requiredRoles.includes(role)) {
        res
          .status(403)
          .json({ success: false, message: 'You are not authorized!', data:  null });
        return;
      }

      const user = await User.findById(id).select('-password').lean();
      if (!user) {
        res
          .status(401)
          .json({ success: false, message: 'User not found', data: null });
        return;
      }

      req.user = { id, role, email };
      next();
    },
  );
};

export default isAuth;
