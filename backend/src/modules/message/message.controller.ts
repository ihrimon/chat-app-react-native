import { AuthRequest } from '../../types';
import { ApiResponse } from '../../utils/api-response.utils';
import catchAsync from '../../utils/catch-async.utils';
import Chat from '../chat/chat.model';
import Message from './message.model';

/* ======== Send Message ======== */
export const sendMessage = catchAsync<AuthRequest>(async (req, res) => {
  const { chatId, text } = req.body;
  const senderId = req.user?.id;

  if (!chatId || !text)
    ApiResponse.badRequest(res, 'chatId and text are required');

  const message = await Message.create({ chatId, senderId, text });

  // Update lastMessage in chat
  await Chat.findByIdAndUpdate(chatId, {
    lastMessage: { text, senderId, createdAt: new Date() },
  });

  ApiResponse.created(res, 'Message sent successfully', message);
});

/* ======== Get Messages ======== */
export const getMessages = catchAsync<AuthRequest>(async (req, res) => {
  const { chatId } = req.params;

  const messages = await Message.find({ chatId })
    .populate('senderId', 'name avatar')
    .sort({ createdAt: 1 });

  ApiResponse.success(res, 'Messages retrieved successfully', messages);
});
