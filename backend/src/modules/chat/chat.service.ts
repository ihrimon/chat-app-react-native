import { AppError } from '../../utils/app-error.utils';
import { IChat } from './chat.interface';
import chatModel from './chat.model';

const memberPopulate = {
  path: 'members',
  select: 'name avatar isOnline',
};

/* ======== Create or Get 1-to-1 Chat ======== */
export const createOrGetChat = async (
  senderId: string,
  receiverId: string,
): Promise<IChat> => {
  if (senderId === receiverId) {
    throw new AppError('You cannot chat with yourself', 400);
  }

  // Already existing chat check
  const existingChat = await chatModel.findOne({
    members: { $all: [senderId, receiverId] },
  }).populate(memberPopulate);

  if (existingChat) return existingChat;

  // create new chat
  const newChat = await chatModel.create({ members: [senderId, receiverId] });
  return chatModel.findById(newChat._id).populate(
    memberPopulate,
  ) as Promise<IChat>;
};

/* ======== Get User's All Chats ======== */
export const getUserChats = async (
  userId: string,
): Promise<IChat[]> => {
  return chatModel.find({ members: { $in: [userId] } })
    .populate(memberPopulate)
    .sort({ updatedAt: -1 });
};
