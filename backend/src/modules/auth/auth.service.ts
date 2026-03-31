import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../../utils/token.utils';
import User, { IUser } from './auth.model';

/* ======== Register User ======== */
export const registerUser = async (
  name: string,
  email: string,
  password: string,
): Promise<{ user: IUser; accessToken: string; refreshToken: string }> => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error('Email already in use');

  const user = await User.create({ name, email, password });

  const jwtPayload = {
    id: user._id.toString(),
    role: user.role,
    email: user.email,
  };

  const accessToken = generateAccessToken(jwtPayload);

  const refreshToken = generateRefreshToken(jwtPayload);

  return { user, accessToken, refreshToken };
};

/* ======== Login User ======== */
export const loginUser = async (
  email: string,
  password: string,
): Promise<{ user: IUser; accessToken: string; refreshToken: string }> => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) throw new Error('Invalid email or password');

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new Error('Invalid email or password');

  const jwtPayload = {
    id: user._id.toString(),
    role: user.role,
    email: user.email,
  };

  const accessToken = generateAccessToken(jwtPayload);

  const refreshToken = generateRefreshToken(jwtPayload);

  return { user, accessToken, refreshToken };
};

/* ======== Refresh Access Token ======== */
export const refreshAccessToken = async (
  refreshToken: string,
): Promise<{ accessToken: string }> => {
  if (!refreshToken) throw new Error('Refresh token not provided');

  const decoded = verifyRefreshToken(refreshToken);
  const user = await User.findById(decoded.decoded?.id);
  if (!user) throw new Error('User not found');

  const jwtPayload = {
    id: user._id.toString(),
    role: user.role,
    email: user.email,
  };

  const accessToken = generateAccessToken(jwtPayload);

  return { accessToken };
};
