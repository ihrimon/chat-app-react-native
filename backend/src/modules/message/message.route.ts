import { Router } from 'express';
import isAuth from '../../middlewares/auth.middleware';
import { getMessages, sendMessage } from './message.controller';

const router = Router();

router.post('/', isAuth(), sendMessage);
router.get('/:chatId', isAuth(), getMessages);

export default router;
