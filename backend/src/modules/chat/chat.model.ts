import mongoose, { Document, Schema } from 'mongoose';

export interface IChat extends Document {
  members: mongoose.Types.ObjectId[];
  lastMessage?: {
    text: string;
    senderId: mongoose.Types.ObjectId;
    createdAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const chatSchema = new Schema<IChat>(
  {
    members: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
    lastMessage: {
      text: { type: String },
      senderId: { type: Schema.Types.ObjectId, ref: 'User' },
      createdAt: { type: Date },
    },
  },
  { timestamps: true },
);

export default mongoose.model<IChat>('Chat', chatSchema);
