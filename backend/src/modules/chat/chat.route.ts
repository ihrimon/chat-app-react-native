import { Router } from 'express';
import { createOrGetChat, getUserChats } from './chat.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/', authenticate, createOrGetChat);
router.get('/', authenticate, getUserChats);

export const chatRoutes = router;
