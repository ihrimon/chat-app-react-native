import bcrypt from 'bcryptjs';
import mongoose, { Document, Schema } from 'mongoose';
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

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    avatar: { type: String, default: '' },
    isOnline: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const obj = ret as unknown as Record<string, unknown>;
    delete obj.password;
    return obj;
  },
});

export default mongoose.model<IUser>('User', userSchema);
