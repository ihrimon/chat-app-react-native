import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/auth.middleware';
import validate from '../../middlewares/validate.middleware';
import { createOrGetChat, getUserChats } from './chat.controller';
import { createChatSchema } from './chat.validation';

const router = Router();

router.post(
  '/',
  authenticate,
  authorize('user', 'admin'),
  validate(createChatSchema),
  createOrGetChat,
);
router.get('/', authenticate, authorize('user', 'admin'), getUserChats);

export const chatRoutes = router;
