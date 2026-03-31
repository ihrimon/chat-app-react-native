import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { getMessages, sendMessage } from './message.controller';

const router = Router();

router.post('/', authenticate, sendMessage);
router.get('/:chatId', authenticate, getMessages);

export const messageRoutes = router;
