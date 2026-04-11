import { AuthRequest } from '../../types';
import { ApiResponse } from '../../utils/api-response.utils';
import catchAsync from '../../utils/catch-async.utils';
import * as chatService from './chat.service';

/* ======== Create or Get Chat ======== */
export const createOrGetChat = catchAsync<AuthRequest>(async (req, res) => {
  const { receiverId } = req.body;
  const senderId = req.user!.id;

  const chat = await chatService.createOrGetChat(senderId, receiverId);
  ApiResponse.success(res, 'Chat retrieved successfully', chat);
});

/* ======== Get User Chats ======== */
export const getUserChats = catchAsync<AuthRequest>(async (req, res) => {
  const chats = await chatService.getUserChats(req.user!.id);
  ApiResponse.success(res, 'Chats retrieved successfully', chats);
});
