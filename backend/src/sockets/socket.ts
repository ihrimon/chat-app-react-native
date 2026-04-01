import { Server, Socket } from 'socket.io';
import User from '../modules/auth/auth.model';
// Map: userId → socketId
const onlineUsers = new Map<string, string>();

/* ======== Socket Initialization ======== */
const initSocket = (io: Server): void => {
  io.on('connection', (socket: Socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    // ─── Setup: user comes online ───────────────────────────────
    socket.on('setup', async (userId: string) => {
      if (!userId) return;

      onlineUsers.set(userId, socket.id);
      socket.join(userId); // personal room

      await User.findByIdAndUpdate(userId, { isOnline: true });

      // Notify others
      socket.broadcast.emit('user_online', { userId });
      console.log(`✅ User online: ${userId}`);
    });

    // ─── Join a chat room ────────────────────────────────────────
    socket.on('join_chat', (chatId: string) => {
      socket.join(chatId);
      console.log(`💬 Joined chat room: ${chatId}`);
    });

    // ─── Send message ────────────────────────────────────────────
    socket.on(
      'send_message',
      (data: {
        chatId: string;
        text: string;
        senderId: string;
        _id?: string;
      }) => {
        const { chatId, text, senderId, _id } = data;

        // Emit to everyone in the chat room except sender
        socket.to(chatId).emit('receive_message', {
          _id,
          chatId,
          text,
          senderId,
          createdAt: new Date(),
        });
      },
    );

    // ─── Typing indicators ───────────────────────────────────────
    socket.on('typing', (data: { chatId: string; userId: string }) => {
      socket.to(data.chatId).emit('typing', { userId: data.userId });
    });

    socket.on('stop_typing', (data: { chatId: string; userId: string }) => {
      socket.to(data.chatId).emit('stop_typing', { userId: data.userId });
    });

    // ─── Disconnect ──────────────────────────────────────────────
    socket.on('disconnect', async () => {
      // Find userId by socketId
      let disconnectedUserId: string | null = null;
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          disconnectedUserId = userId;
          break;
        }
      }

      if (disconnectedUserId) {
        onlineUsers.delete(disconnectedUserId);
        await User.findByIdAndUpdate(disconnectedUserId, { isOnline: false });
        socket.broadcast.emit('user_offline', { userId: disconnectedUserId });
        console.log(`❌ User offline: ${disconnectedUserId}`);
      }

      console.log(`🔌 Socket disconnected: ${socket.id}`);
    });
  });
};

export { initSocket, onlineUsers };
