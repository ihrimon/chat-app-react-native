import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/auth.middleware';
import { getMessages, sendMessage } from './message.controller';

const router = Router();

router.post('/', authenticate, authorize('user', 'admin'), sendMessage);
router.get('/:chatId', authenticate, authorize('user', 'admin'), getMessages);

export const messageRoutes = router;
