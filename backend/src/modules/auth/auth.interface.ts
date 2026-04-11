import { Document } from 'mongoose';
import { TUserRole } from '../../types';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar?: string;
  isOnline: boolean;
  role: TUserRole;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}
