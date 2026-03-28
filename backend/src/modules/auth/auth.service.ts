import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../../utils/jwt-helpers';
import User, { IUser } from './auth.model';

/* ────── Register User ────── */
export const registerUser = async (
  name: string,
  email: string,
  password: string,
): Promise<{ user: IUser; accessToken: string; refreshToken: string }> => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error('Email already in use');

  const user = await User.create({ name, email, password });
  const accessToken = generateAccessToken(
    user._id.toString(),
    user.role,
    user.email,
  );
  const refreshToken = generateRefreshToken(user._id.toString());

  return { user, accessToken, refreshToken };
};

/* ────── Login User ────── */
export const loginUser = async (
  email: string,
  password: string,
): Promise<{ user: IUser; accessToken: string; refreshToken: string }> => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) throw new Error('Invalid email or password');

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new Error('Invalid email or password');

  const accessToken = generateAccessToken(
    user._id.toString(),
    user.role,
    user.email,
  );
  const refreshToken = generateRefreshToken(user._id.toString());

  return { user, accessToken, refreshToken };
};

/* ────── Refresh Access Token ────── */
export const refreshAccessToken = async (
  refreshToken: string,
): Promise<{ accessToken: string }> => {
  if (!refreshToken) throw new Error('Refresh token not provided');

  const decoded = verifyRefreshToken(refreshToken);
  const user = await User.findById(decoded.id);
  if (!user) throw new Error('User not found');

  const accessToken = generateAccessToken(
    user._id.toString(),
    user.role,
    user.email,
  );
  return { accessToken };
};
