import { Request } from 'express';
import { Server } from 'socket.io';
import { AuthRequest } from '../../types';
import { ApiResponse } from '../../utils/api-response.utils';
import catchAsync from '../../utils/catch-async.utils';
import * as messageService from './message.service';

// Message Controller Factory
export const createMessageController = (io: Server) => {
  /* ======== Send Message ======== */
  const sendMessage = catchAsync<AuthRequest>(async (req: AuthRequest, res) => {
    const { chatId, text } = req.body;
    const senderId = req.user!.id;

    const message = await messageService.sendMessage(
      io,
      chatId,
      senderId,
      text,
    );
    ApiResponse.created(res, 'Message sent successfully', message);
  });

  /* ======== Get Messages ======== */
  const getMessages = catchAsync<AuthRequest>(async (req: AuthRequest, res) => {
    const { chatId } = req.params;
    const senderId = req.user!.id;

    const messages = await messageService.getMessages(chatId, senderId);
    ApiResponse.success(res, 'Messages retrieved successfully', messages);
  });

  return { sendMessage, getMessages };
};
