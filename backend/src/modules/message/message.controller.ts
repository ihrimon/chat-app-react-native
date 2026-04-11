import { AuthRequest } from '../../types';
import { ApiResponse } from '../../utils/api-response.utils';
import catchAsync from '../../utils/catch-async.utils';
import * as messageService from './message.service';

/* ======== Send Message ======== */
export const sendMessage = catchAsync<AuthRequest>(async (req, res) => {
  const { chatId, text } = req.body;
  const senderId = req.user!.id;

  const message = await messageService.sendMessage(chatId, senderId, text);
  ApiResponse.created(res, 'Message sent successfully', message);
});

/* ======== Get Messages ======== */
export const getMessages = catchAsync<AuthRequest>(async (req, res) => {
  const { chatId } = req.params;
  const senderId = req.user!.id;

  const messages = await messageService.getMessages(chatId, senderId);
  ApiResponse.success(res, 'Messages retrieved successfully', messages);
});
