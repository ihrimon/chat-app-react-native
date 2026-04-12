import express from 'express';
import { Server } from 'socket.io';
import { authRoutes } from '../modules/auth/auth.route';
import { chatRoutes } from '../modules/chat/chat.route';
import { createMessageRoutes } from '../modules/message/message.route';
import { notificationRoutes } from '../modules/notification/notification.route';
import { userRoutes } from '../modules/user/user.route';

const createRouter = (io: Server) => {
  const router = express.Router();

  const moduleRoutes = [
    { path: '/auth', route: authRoutes },
    { path: '/users', route: userRoutes },
    { path: '/chats', route: chatRoutes },
    { path: '/messages', route: createMessageRoutes(io) },
    { path: '/notifications', route: notificationRoutes },
  ];

  moduleRoutes.forEach((route) => router.use(route.path, route.route));

  return router;
};

export default createRouter;
