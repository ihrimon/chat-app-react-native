import { Router } from 'express';
import isAuth from '../../middlewares/auth.middleware';
import { createOrGetChat, getUserChats } from './chat.controller';

const router = Router();

router.post('/', isAuth(), createOrGetChat);
router.get('/', isAuth(), getUserChats);

export default router;
