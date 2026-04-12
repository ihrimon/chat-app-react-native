import { Server } from 'socket.io';
import { AppError } from '../../utils/app-error.utils';
import Chat from '../chat/chat.model';
import { sendNotification } from '../notification/notification.service';
import { IMessage } from './message.interface';
import messageModel from './message.model';

const senderPopulate = { path: 'senderId', select: 'name avatar' };

/* ======== Send Message ======== */
export const sendMessage = async (
  io: Server,
  chatId: string,
  senderId: string,
  text: string,
): Promise<IMessage> => {
  const chat = await Chat.findOne({
    _id: chatId,
    members: { $in: [senderId] },
  });
  if (!chat) throw new AppError('Chat not found', 404);

  const message = await messageModel.create({ chatId, senderId, text });

  // Update chat's last message and timestamp
  await Chat.findByIdAndUpdate(chatId, {
    lastMessage: { text, senderId, createdAt: new Date() },
    updatedAt: new Date(),
  });

  const populatedMessage = (await messageModel
    .findById(message._id)
    .populate(senderPopulate)) as IMessage;

  // Find the other member in the chat
  const receiverId = chat.members
    .map((m) => m.toString())
    .find((id) => id !== senderId);

  if (receiverId) {
    await sendNotification(
      io,
      receiverId,
      senderId,
      chatId,
      text.length > 50 ? `${text.substring(0, 50)}...` : text,
    );
  }

  return populatedMessage;
};

/* ======== Get Messages ======== */
export const getMessages = async (
  chatId: string,
  senderId: string,
): Promise<IMessage[]> => {
  const chat = await Chat.findOne({
    _id: chatId,
    members: { $in: [senderId] },
  });
  if (!chat) throw new AppError('Chat not found', 404);

  // Mark all sender's sent messages as delivered
  await messageModel.updateMany(
    { chatId, senderId: { $ne: senderId }, status: 'sent' },
    { status: 'delivered' },
  );

  return messageModel
    .find({ chatId })
    .populate(senderPopulate)
    .sort({ createdAt: 1 });
};
