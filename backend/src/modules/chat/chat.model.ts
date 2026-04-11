import mongoose, { Document, Schema } from 'mongoose';
import { IChat } from './chat.interface';

const chatSchema = new Schema<IChat>(
  {
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    lastMessage: {
      text: { type: String },
      senderId: { type: Schema.Types.ObjectId, ref: 'User' },
      createdAt: { type: Date },
    },
  },
  { timestamps: true },
);

export default mongoose.model<IChat>('Chat', chatSchema);
