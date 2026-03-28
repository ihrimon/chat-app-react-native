import catchAsync from '../../utils/catch-async';
import User from '../auth/auth.model';

export const getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find().select('-password');
  res.status(200).json({ success: true, message: 'Users retrieved successfully', data: users });
});

export const getProfile = catchAsync(async (req, res) => {
  const user = await User.findById(req.user?.id);
  if (!user) {
    res.status(404).json({ success: false, message: 'User not found' });
    return;
  }
  res.status(200).json({ success: true, message: 'Profile retrieved successfully', data: user });
});
