import { Types } from 'mongoose';

export interface ILastMessage {
  text: string;
  senderId: Types.ObjectId;
  createdAt: Date;
}

export interface IChat {
  members: Types.ObjectId[];
  lastMessage?: ILastMessage;
  createdAt: Date;
  updatedAt: Date;
}
