import { Server, Socket } from 'socket.io';
import User from '../modules/auth/auth.model';
import { SOCKET_EVENTS } from './socket.events';

// Map: userId → socketId
const onlineUsers = new Map<string, string>();

// Metrics
let activeUsers = 0;
let totalMessages = 0;

/* ======== Socket Initialization ======== */
const initSocket = (io: Server): void => {
  io.on('connection', (socket: Socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    // Active user count increase
    activeUsers++;
    console.log(`Active users: ${activeUsers}`);

    /* ======== Setup — User Online ======== */
    socket.on('setup', async (userId: string) => {
      if (!userId) return;

      onlineUsers.set(userId, socket.id);
      socket.join(userId);

      await User.findByIdAndUpdate(userId, { isOnline: true });

      socket.broadcast.emit(SOCKET_EVENTS.USER_ONLINE, { userId });
      console.log(`User online: ${userId}`);
    });

    /* ======== Join Chat Room ======== */
    socket.on(SOCKET_EVENTS.JOIN_CHAT, (chatId: string) => {
      socket.join(chatId);
      console.log(`Joined chat: ${chatId}`);
    });

    /* ======== Leave Chat Room ======== */
    socket.on(SOCKET_EVENTS.LEAVE_CHAT, (chatId: string) => {
      socket.leave(chatId);
      console.log(`Left chat: ${chatId}`);
    });

    /* ======== Send Message ======== */
    socket.on(
      SOCKET_EVENTS.SEND_MESSAGE,
      (data: {
        chatId: string;
        message: {
          _id: string;
          text: string;
          senderId: { _id: string; name: string; avatar: string };
          createdAt: Date;
          status: string;
        };
      }) => {
        const { chatId, message } = data;

        // Count messages
        totalMessages++;
        console.log(`📨 Total messages: ${totalMessages}`);

        // Emit to others in chat
        socket.to(chatId).emit(SOCKET_EVENTS.RECEIVE_MESSAGE, {
          chatId,
          message,
        });

        // Delivery confirmation
        const receiverSocketId = getReceiverSocketId(
          message.senderId._id,
          onlineUsers,
        );

        if (receiverSocketId) {
          io.to(receiverSocketId).emit(SOCKET_EVENTS.MESSAGE_DELIVERED, {
            messageId: message._id,
            chatId,
          });
        }
      },
    );

    /* ======== Typing ======== */
    socket.on(
      SOCKET_EVENTS.TYPING,
      (data: { chatId: string; userId: string }) => {
        socket.to(data.chatId).emit(SOCKET_EVENTS.TYPING, data);
      },
    );

    /* ======== Stop Typing ======== */
    socket.on(
      SOCKET_EVENTS.STOP_TYPING,
      (data: { chatId: string; userId: string }) => {
        socket.to(data.chatId).emit(SOCKET_EVENTS.STOP_TYPING, data);
      },
    );

    /* ======== Disconnect ======== */
    socket.on('disconnect', async () => {
      let disconnectedUserId: string | null = null;

      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          disconnectedUserId = userId;
          break;
        }
      }

      if (disconnectedUserId) {
        onlineUsers.delete(disconnectedUserId);

        await User.findByIdAndUpdate(disconnectedUserId, {
          isOnline: false,
        });

        socket.broadcast.emit(SOCKET_EVENTS.USER_OFFLINE, {
          userId: disconnectedUserId,
        });

        console.log(`❌ User offline: ${disconnectedUserId}`);
      }

      // Active user decrease
      activeUsers--;
      console.log(`🔴 Active users: ${activeUsers}`);

      console.log(`🔌 Socket disconnected: ${socket.id}`);
    });
  });
};

/* ======== Helper ======== */
const getReceiverSocketId = (
  userId: string,
  onlineUsers: Map<string, string>,
): string | undefined => {
  return onlineUsers.get(userId);
};

export { initSocket, onlineUsers, activeUsers, totalMessages };
