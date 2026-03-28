import { Router } from 'express';
import { protect } from '../../middlewares/auth.middleware';
import { getMessages, sendMessage } from './message.controller';

const router = Router();

router.post('/', protect, sendMessage);
router.get('/:chatId', protect, getMessages);

export default router;
