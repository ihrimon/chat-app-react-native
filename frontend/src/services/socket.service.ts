import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../store/auth.store';
import { ENV } from '@/config';

class SocketService {
  private socket: Socket | null = null;

  connect() {
    const { token } = useAuthStore.getState();
    if (!token) {
      console.log('⚠️ No auth token found for socket');
      return;
    }

    this.socket = io(ENV.SOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      timeout: 10000,
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket Connected Successfully');
    });

    this.socket.on('connect_error', (err) => {
      console.error('❌ Socket Connection Error:', err.message);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('🔌 Socket Disconnected:', reason);
    });

    this.socket.on('receive_message', (data) => {
      console.log('📨 New realtime message:', data);
    });
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }

  joinChat(chatId: string) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('join_chat', { chatId });
      console.log(`Joined chat: ${chatId}`);
    }
  }

  sendMessage(chatId: string, text: string, senderId: string) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('send_message', { chatId, text, senderId });
    }
  }

  getSocket() {
    return this.socket;
  }
}

export const socketService = new SocketService();
