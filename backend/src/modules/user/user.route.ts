import { Router } from 'express';
import { protect } from '../../middlewares/auth.middleware';
import { getAllUsers, getProfile } from './user.controller';

const router = Router();

router.get('/', protect, getAllUsers);
router.get('/profile', protect, getProfile);

export default router;
