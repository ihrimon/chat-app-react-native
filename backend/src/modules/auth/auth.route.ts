import { Router } from 'express';
import { protect } from '../../middlewares/auth.middleware';
import * as authController from './auth.controller';
import { validateLogin, validateRegister } from './auth.validation';

const router = Router();

router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);
router.post('/logout', protect, authController.logout);

export default router;
