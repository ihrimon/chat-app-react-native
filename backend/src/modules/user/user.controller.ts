import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import User from '../auth/auth.model';

export const getAllUsers = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    // Return all users except the logged-in user
    const users = await User.find({ _id: { $ne: req.user?.id } }).select(
      '-password',
    );
    res.status(200).json({ success: true, users });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
};

export const getProfile = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }
    res.status(200).json({ success: true, user });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to get profile' });
  }
};
