import mongoose, { Document } from 'mongoose';
import { MessageStatus } from '../../types';

export interface IMessage extends Document {
  chatId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  text: string;
  status: MessageStatus;
  createdAt: Date;
}
