import { Router } from 'express';
import { authorize } from '../../middlewares/auth.middleware';
import validate from '../../middlewares/validate.middleware';
import { createOrGetChat, getUserChats } from './chat.controller';
import { createChatSchema } from './chat.validation';

const router = Router();

router.post(
  '/',
  authorize('user', 'admin'),
  validate(createChatSchema),
  createOrGetChat,
);
router.get('/', authorize('user', 'admin'), getUserChats);

export const chatRoutes = router;
