import { Response } from 'express';
import Chat from './chat.model';
import { AuthRequest } from '../../types';

/* ======== Create or Get Chat ======== */
export const createOrGetChat = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { receiverId } = req.body;
    const senderId = req.user?.id;

    if (!receiverId) {
      res
        .status(400)
        .json({ success: false, message: 'receiverId is required' });
      return;
    }

    // Check if chat already exists
    let chat = await Chat.findOne({
      members: { $all: [senderId, receiverId] },
    }).populate('members', '-password');

    if (!chat) {
      chat = await Chat.create({ members: [senderId, receiverId] });
      chat = await chat.populate('members', '-password');
    }

    res.status(200).json({ success: true, chat });
  } catch {
    res
      .status(500)
      .json({ success: false, message: 'Failed to create/get chat' });
  }
};

/* ======== Get User Chats ======== */
export const getUserChats = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const chats = await Chat.find({ members: { $in: [req.user?.id] } })
      .populate('members', '-password')
      .sort({ updatedAt: -1 });

    res.status(200).json({ success: true, chats });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch chats' });
  }
};
