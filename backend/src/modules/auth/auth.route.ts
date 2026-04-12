import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import validate from '../../middlewares/validate.middleware';
import { login, logout, refreshToken, register } from './auth.controller';
import { loginSchema, registerSchema } from './auth.validation';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/refresh-token', refreshToken);
router.post('/logout', authenticate, logout);

export const authRoutes = router;
