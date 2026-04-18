import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import validate from '../../middlewares/validate.middleware';
import { getCurrentUser, login, logout, refreshToken, register } from './auth.controller';
import { loginSchema, registerSchema } from './auth.validation';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/me', authenticate, getCurrentUser);
router.post('/logout', authenticate, logout);
router.post('/refresh-token', refreshToken);

export const authRoutes = router;
