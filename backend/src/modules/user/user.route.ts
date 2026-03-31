import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/auth.middleware';
import { getAllUsers, getProfile } from './user.controller';

const router = Router();

router.get('/profile', authenticate, getProfile);

// Only admin can access the list of all users
router.get('/', authenticate, authorize('admin'), getAllUsers);

export default router;
