
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../store/auth.store';

class SocketService {
  private socket: Socket | null = null;

  connect() {
    const { token } = useAuthStore.getState();

    if (!token) return;

    this.socket = io(process.env.EXPO_PUBLIC_SOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket Connected');
    });

    this.socket.on('connect_error', (err) => {
      console.log('Socket connection error:', err.message);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket() {
    return this.socket;
  }

  // Example: Join a chat room
  joinRoom(roomId: string) {
    this.socket?.emit('joinRoom', roomId);
  }

  sendMessage(roomId: string, message: string) {
    this.socket?.emit('sendMessage', { roomId, message });
  }
}

export const socketService = new SocketService();
