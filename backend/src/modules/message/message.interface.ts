import { Types } from 'mongoose';
import { TMessageStatus } from '../../types';

export interface IMessage {
  chatId: Types.ObjectId;
  senderId: Types.ObjectId;
  text: string;
  status: TMessageStatus;
  createdAt: Date;
  updatedAt: Date;
}
