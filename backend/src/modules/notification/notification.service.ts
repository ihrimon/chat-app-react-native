import { Server } from 'socket.io';
import { onlineUsers } from '../../sockets/socket';
import { INotification } from './notification.interface';
import Notification from './notification.model';

/* ======== Send In-App Notification ======== */
export const sendNotification = async (
  io: Server,
  recipientId: string,
  senderId: string,
  chatId: string,
  message: string,
): Promise<void> => {
  // Create notification in DB
  const notification = await Notification.create({
    recipientId,
    senderId,
    chatId,
    type: 'message',
    message,
  });

  // Emit to recipient if online
  const recipientSocketId = onlineUsers.get(recipientId);
  if (recipientSocketId) {
    io.to(recipientSocketId).emit('new_notification', {
      _id: notification._id,
      senderId,
      chatId,
      message,
      isRead: false,
      createdAt: notification.createdAt,
    });
  }
};

/* ======== Get User Notifications ======== */
export const getUserNotifications = async (
  userId: string,
): Promise<INotification[]> => {
  return Notification.find({ recipientId: userId })
    .populate('senderId', 'name avatar')
    .populate('chatId', 'members')
    .sort({ createdAt: -1 })
    .limit(20);
};

/* ======== Mark Notification as Read ======== */
export const markAsRead = async (notificationId: string): Promise<void> => {
  await Notification.findByIdAndUpdate(notificationId, { isRead: true });
};

/* ======== Mark All as Read ======== */
export const markAllAsRead = async (userId: string): Promise<void> => {
  await Notification.updateMany(
    { recipientId: userId, isRead: false },
    { isRead: true },
  );
};

/* ======== Get Unread Count ======== */
export const getUnreadCount = async (userId: string): Promise<number> => {
  return Notification.countDocuments({ recipientId: userId, isRead: false });
};
