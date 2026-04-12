import mongoose, { Schema } from 'mongoose';
import { INotification, TNotificationType } from './notification.interface';

const notificationSchema = new Schema<INotification>(
  {
    recipientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    chatId: { type: Schema.Types.ObjectId, ref: 'Chat', required: true },
    type: {
      type: String,
      enum: ['message', 'system'] as TNotificationType[],
      default: 'message',
    },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default mongoose.model<INotification>(
  'Notification',
  notificationSchema,
);
