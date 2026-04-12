import { Router } from 'express';
import { Server } from 'socket.io';
import { authenticate, authorize } from '../../middlewares/auth.middleware';
import { createMessageController } from './message.controller';

/* ======== Create Message Routes-> IO inject ======== */
export const createMessageRoutes = (io: Server): Router => {
  const { sendMessage, getMessages } = createMessageController(io);
  const router = Router();

  router.post('/', authenticate, authorize('user', 'admin'), sendMessage);
  router.get('/:chatId', authenticate, authorize('user', 'admin'), getMessages);

  return router;
};
