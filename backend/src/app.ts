import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import morgan from 'morgan';
import { Server } from 'socket.io';
import {
  globalErrorHandler,
  notFoundHandler,
} from './middlewares/error.middleware';
import createRouter from './routes';

const createApp = (io: Server): Application => {
  const app: Application = express();

  /* ======== Middlewares ======== */
  app.use(cors({ origin: '*', credentials: true }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(
    morgan((tokens, req, res) => {
      return [
        '📌',
        tokens.method(req, res),
        tokens.url(req, res),
        '| Status:',
        tokens.status(req, res),
        '| Time:',
        tokens['response-time'](req, res),
        'ms',
        '| Size:',
        tokens.res(req, res, 'content-length'),
      ].join(' ');
    }),
  );

  /* ======== Routes ======== */
  app.use('/api/v1', createRouter(io));

  /* ======== Health Check ======== */
  app.get('/', (_req: Request, res: Response) => {
    res.json({ success: true, message: 'Real Time Chat App API is running' });
  });

  /* ======== Error Handling Middleware ======== */
  app.use(notFoundHandler);
  app.use(globalErrorHandler);

  return app;
};

export default createApp;
