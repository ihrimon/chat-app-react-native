import { AppError } from '../../utils/app-error.utils';
import chatModel from '../chat/chat.model';
import { IMessage } from './message.interface';
import messageModel from './message.model';

const senderPopulate = { path: 'senderId', select: 'name avatar' };

/* ======== Send Message ======== */
export const sendMessage = async (
  chatId: string,
  senderId: string,
  text: string,
): Promise<IMessage> => {
  // check chat exist and is sender member of the chat
  const chat = await chatModel.findOne({
    _id: chatId,
    members: { $in: [senderId] },
  });
  if (!chat) throw new AppError('Chat not found', 404);

  const message = await messageModel.create({ chatId, senderId, text });

  // last message update
  await chatModel.findByIdAndUpdate(chatId, {
    lastMessage: { text, senderId, createdAt: new Date() },
    updatedAt: new Date(),
  });

  return messageModel.findById(message._id).populate(
    senderPopulate,
  ) as Promise<IMessage>;
};

/* ======== Get Messages ======== */
export const getMessages = async (
  chatId: string,
  senderId: string,
): Promise<IMessage[]> => {
  const chat = await chatModel.findOne({
    _id: chatId,
    members: { $in: [senderId] },
  });
  if (!chat) throw new AppError('Chat not found', 404);

  // sent → delivered mark 
  await messageModel.updateMany(
    { chatId, senderId: { $ne: senderId }, status: 'sent' },
    { status: 'delivered' },
  );

  return messageModel.find({ chatId })
    .populate(senderPopulate)
    .sort({ createdAt: 1 });
};
