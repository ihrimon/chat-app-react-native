import { Router } from 'express';
import * as authController from './auth.controller';
import { validateLogin, validateRegister } from './auth.validation';

const router = Router();

router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authController.logout);

export default router;
