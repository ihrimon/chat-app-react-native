import jwt from 'jsonwebtoken';
import User, { IUser } from './auth.model';

const generateToken = (userId: string): string => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET as string,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    } as jwt.SignOptions,
  );
};

export const registerUser = async (
  name: string,
  email: string,
  password: string,
): Promise<{ user: IUser; token: string }> => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('Email already in use');
  }

  const user = await User.create({ name, email, password });
  const token = generateToken(user._id.toString());

  return { user, token };
};

export const loginUser = async (
  email: string,
  password: string,
): Promise<{ user: IUser; token: string }> => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  const token = generateToken(user._id.toString());
  return { user, token };
};
