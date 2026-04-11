import mongoose, { Document, Schema } from 'mongoose';
import { IMessage } from './message.interface';
import { TMessageStatus } from '../../types';

const messageSchema = new Schema<IMessage>(
  {
    chatId: { type: Schema.Types.ObjectId, ref: 'Chat', required: true },
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['sent', 'delivered'] as TMessageStatus[],
      default: 'sent',
    },
  },
  { timestamps: true },
);

export default mongoose.model<IMessage>('Message', messageSchema);
