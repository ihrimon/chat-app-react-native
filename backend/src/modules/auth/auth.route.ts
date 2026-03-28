import { Router } from 'express';
import * as authController from './auth.controller';
import { validateRegister, validateLogin } from './auth.validation';
import isAuth from '../../middlewares/auth.middleware';

const router = Router();

router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', isAuth(), authController.logout);

export default router;
