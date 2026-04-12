import { Server, Socket } from 'socket.io';
import User from '../modules/auth/auth.model';
import { SOCKET_EVENTS } from './socket.events';

// Map: userId → socketId map (online users tracking)
const onlineUsers = new Map<string, string>();

/* ======== Socket Initialization ======== */
const initSocket = (io: Server): void => {
  io.on('connection', (socket: Socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    /* ======== Setup — User Online ======== */
    socket.on('setup', async (userId: string) => {
      if (!userId) return;

      onlineUsers.set(userId, socket.id);
      socket.join(userId); // personal room

      // online status update in DB
      await User.findByIdAndUpdate(userId, { isOnline: true });

      // Notify others
      socket.broadcast.emit(SOCKET_EVENTS.USER_ONLINE, { userId });
      console.log(`✅ User online: ${userId}`);
    });

    /* ======== Join Chat Room ======== */
    socket.on(SOCKET_EVENTS.JOIN_CHAT, (chatId: string) => {
      socket.join(chatId);
      console.log(`💬 Joined chat: ${chatId}`);
    });

    /* ======== Leave Chat Room ======== */
    socket.on(SOCKET_EVENTS.LEAVE_CHAT, (chatId: string) => {
      socket.leave(chatId);
      console.log(`🚪 Left chat: ${chatId}`);
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

        // Emit to everyone in the chat room except sender
        socket.to(chatId).emit(SOCKET_EVENTS.RECEIVE_MESSAGE, {
          chatId,
          message,
        });

        // Emit to sender's personal room for delivery confirmation
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
        socket.to(data.chatId).emit(SOCKET_EVENTS.TYPING, {
          chatId: data.chatId,
          userId: data.userId,
        });
      },
    );

    /* ======== Stop Typing ======== */
    socket.on(
      SOCKET_EVENTS.STOP_TYPING,
      (data: { chatId: string; userId: string }) => {
        socket.to(data.chatId).emit(SOCKET_EVENTS.STOP_TYPING, {
          chatId: data.chatId,
          userId: data.userId,
        });
      },
    );

    /* ======== Disconnect ======== */
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

        // online status (offline) update in DB
        await User.findByIdAndUpdate(disconnectedUserId, { isOnline: false });

        // Notify others this user is offline
        socket.broadcast.emit(SOCKET_EVENTS.USER_OFFLINE, {
          userId: disconnectedUserId,
        });
        console.log(`❌ User offline: ${disconnectedUserId}`);
      }

      console.log(`🔌 Socket disconnected: ${socket.id}`);
    });
  });
};

/* ======== Helper: Get Receiver Socket ID ======== */
const getReceiverSocketId = (
  userId: string,
  onlineUsers: Map<string, string>,
): string | undefined => {
  return onlineUsers.get(userId);
};

export { initSocket, onlineUsers };
