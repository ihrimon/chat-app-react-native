import { Router } from 'express';
import { getMessages, sendMessage } from './message.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/', authenticate, sendMessage);
router.get('/:chatId', authenticate, getMessages);

export default router;
