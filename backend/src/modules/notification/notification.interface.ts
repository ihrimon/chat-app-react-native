import { Types } from 'mongoose';

export type TNotificationType = 'message' | 'system';

export interface INotification {
  recipientId: Types.ObjectId;
  senderId: Types.ObjectId;
  chatId: Types.ObjectId;
  type: TNotificationType;
  message: string;
  isRead: boolean;
  createdAt: Date;
}
