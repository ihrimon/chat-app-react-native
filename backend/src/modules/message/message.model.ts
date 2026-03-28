import mongoose, { Document, Schema } from 'mongoose';

export type MessageStatus = 'sent' | 'delivered' | 'seen';

export interface IMessage extends Document {
  chatId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  text: string;
  status: MessageStatus;
  createdAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    chatId: { type: Schema.Types.ObjectId, ref: 'Chat', required: true },
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['sent', 'delivered', 'seen'],
      default: 'sent',
    },
  },
  { timestamps: true },
);

export default mongoose.model<IMessage>('Message', messageSchema);
