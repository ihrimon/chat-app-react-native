import { AuthRequest } from '../../types';
import { ApiResponse } from '../../utils/api-response.utils';
import catchAsync from '../../utils/catch-async.utils';
import User from '../auth/auth.model';

/* ======== Get All Users ======== */
export const getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find().select('-password');

  ApiResponse.success(res, 'Users retrieved successfully', users);
});

/* ======== Get User Profile ======== */
export const getProfile = catchAsync<AuthRequest>(async (req, res) => {
  const user = await User.findById(req.user?.id);
  if (!user) ApiResponse.notFound(res, 'User not found');

  ApiResponse.success(res, 'Profile retrieved successfully', user);
});
