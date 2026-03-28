import { Response } from 'express';
import Chat from '../chat/chat.model';
import Message from './message.model';
import { AuthRequest } from '../../types';

export const sendMessage = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { chatId, text } = req.body;
    const senderId = req.user?.id;

    if (!chatId || !text) {
      res
        .status(400)
        .json({ success: false, message: 'chatId and text are required' });
      return;
    }

    const message = await Message.create({ chatId, senderId, text });

    // Update lastMessage in chat
    await Chat.findByIdAndUpdate(chatId, {
      lastMessage: { text, senderId, createdAt: new Date() },
    });

    res.status(201).json({ success: true, message });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to send message' });
  }
};

export const getMessages = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { chatId } = req.params;

    const messages = await Message.find({ chatId })
      .populate('senderId', 'name avatar')
      .sort({ createdAt: 1 });

    res.status(200).json({ success: true, messages });
  } catch {
    res
      .status(500)
      .json({ success: false, message: 'Failed to fetch messages' });
  }
};
