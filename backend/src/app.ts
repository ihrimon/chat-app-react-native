import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import notFound from './middlewares/not-found.middleware';
import authRoutes from './modules/auth/auth.route';
import chatRoutes from './modules/chat/chat.route';
import messageRoutes from './modules/message/message.route';
import userRoutes from './modules/user/user.route';

const app: Application = express();

/* ────── Middlewares ────── */
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* ────── Routes ────── */
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/messages', messageRoutes);

/* ────── Health Check ────── */
app.get('/', (_req: Request, res: Response) => {
  res.json({ success: true, message: 'Real Time Chat App API is running' });
});

/* ────── Not Found (404) Middleware ────── */
app.use(notFound);

export default app;
