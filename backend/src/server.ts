import http from 'http';
import { Server } from 'socket.io';
import createApp from './app';
import connectDB from './config/database.config';
import envConfig from './config/env.config';
import { initSocket } from './sockets/socket';

/* ======== Socket.IO & App Setup ======== */
// 1. create temporary server for Socket.IO initialization
const tempServer = http.createServer();
const io = new Server(tempServer, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
});

// 2. create app with io instance
const app = createApp(io);

// 3. close temporary server as we will use the actual server created later
tempServer.close();

/* ======== Create Actual HTTP Server ======== */
const server = http.createServer(app);
io.attach(server); // io কে actual server এ attach করো

/* ======== Init Socket ======== */
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
