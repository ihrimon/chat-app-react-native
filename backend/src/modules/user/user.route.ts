import { Router } from 'express';
import isAuth from '../../middlewares/auth.middleware';
import { getAllUsers, getProfile } from './user.controller';

const router = Router();

router.get('/', isAuth('admin'), getAllUsers);
router.get('/profile', isAuth('user', 'admin'), getProfile);

export default router;
