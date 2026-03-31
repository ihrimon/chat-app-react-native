import { AuthRequest } from '../../types';
import { ApiResponse } from '../../utils/api-response.utils';
import catchAsync from '../../utils/catch-async.utils';
import Chat from './chat.model';

/* ======== Create or Get Chat ======== */
export const createOrGetChat = catchAsync<AuthRequest>(async (req, res) => {
  const { receiverId } = req.body;
  const senderId = req.user?.id;

  if (!receiverId) ApiResponse.badRequest(res, 'receiverId is required');

  // Check if chat already exists
  let chat = await Chat.findOne({
    members: { $all: [senderId, receiverId] },
  }).populate('members', '-password');

  if (!chat) {
    chat = await Chat.create({ members: [senderId, receiverId] });
    chat = await chat.populate('members', '-password');
  }

  ApiResponse.success(res, 'Chat retrieved successfully', chat);
});

/* ======== Get User Chats ======== */
export const getUserChats = catchAsync<AuthRequest>(async (req, res) => {
  const chats = await Chat.find({ members: { $in: [req.user?.id] } })
    .populate('members', '-password')
    .sort({ updatedAt: -1 });

  res.status(200).json({ success: true, chats });

  ApiResponse.success(res, 'Chats retrieved successfully', chats);
});
