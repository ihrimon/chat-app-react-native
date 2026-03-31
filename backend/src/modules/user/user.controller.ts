import { AuthRequest } from '../../types';
import catchAsync from '../../utils/catch-async.utils';
import User from '../auth/auth.model';

/* ======== Get All Users ======== */
export const getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find().select('-password');
  res.status(200).json({
    success: true,
    message: 'Users retrieved successfully',
    data: users,
  });
});

/* ======== Get User Profile ======== */
export const getProfile = catchAsync<AuthRequest>(async (req, res) => {
  const user = await User.findById(req.user?.id);
  if (!user) {
    res.status(404).json({ success: false, message: 'User not found' });
    return;
  }
  res.status(200).json({
    success: true,
    message: 'Profile retrieved successfully',
    data: user,
  });
});
