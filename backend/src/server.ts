import http from 'http';
import { Server } from 'socket.io';
import app from './app';
import connectDB from './config/database.config';
import envConfig from './config/env.config';
import { initSocket } from './sockets/socket';

/* ======== Create HTTP Server ======== */
const server = http.createServer(app);

/* ======== Socket.IO Setup ======== */
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

initSocket(io);

/* ======== Start Server ======== */
const start = async (): Promise<void> => {
  await connectDB();

  server.listen(envConfig.port, () => {
    console.log(`Server running on http://localhost:${envConfig.port}`);
    console.log(`Environment: ${envConfig.node_env}`);
  });
};

start();
