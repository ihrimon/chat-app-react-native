import { Router } from 'express';
import { protect } from '../../middlewares/auth.middleware';
import { createOrGetChat, getUserChats } from './chat.controller';

const router = Router();

router.post('/', protect, createOrGetChat);
router.get('/', protect, getUserChats);

export default router;
