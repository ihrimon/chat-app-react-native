import { AppError } from '../../utils/app-error.utils';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../../utils/token.utils';
import { IUser } from './auth.interface';
import userModel from './auth.model';

/* ======== Register User ======== */
export const registerUser = async (
  name: string,
  email: string,
  password: string,
): Promise<{ user: IUser; accessToken: string; refreshToken: string }> => {
  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    throw new AppError('Email already in use', 409);
  }

  const user = await userModel.create({ name, email, password });

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
  const user = await userModel.findOne({ email }).select('+password');
  if (!user) throw new AppError('User not found', 401);

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new AppError('Invalid email or password', 401);

  const jwtPayload = {
    id: user._id.toString(),
    role: user.role,
    email: user.email,
  };

  const accessToken = generateAccessToken(jwtPayload);

  const refreshToken = generateRefreshToken(jwtPayload);

  return { user, accessToken, refreshToken };
};

/* ======== Get Current User ======== */
export const currentUser = async (userId: string): Promise<IUser> => {
  const user = await userModel.findById(userId).select('-password');
  
  if (!user) throw new AppError('User not found', 404);
  return user;
};

/* ======== Refresh Access Token ======== */
export const refreshAccessToken = async (
  refreshToken: string,
): Promise<{ accessToken: string }> => {
  if (!refreshToken) throw new AppError('Refresh token not provided', 400);

  const decoded = verifyRefreshToken(refreshToken);
  const user = await userModel.findById(decoded.decoded?.id);
  if (!user) throw new AppError('User not found', 404);

  const jwtPayload = {
    id: user._id.toString(),
    role: user.role,
    email: user.email,
  };

  const accessToken = generateAccessToken(jwtPayload);

  return { accessToken };
};
