import { io } from 'socket.io-client';

export const socket = io('http://YOUR_BACKEND_URL', {
  transports: ['websocket'],
  autoConnect: false,
});
