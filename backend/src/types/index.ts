import { Request } from 'express';

export type TUserRole = 'user' | 'admin';

export type MessageStatus = 'sent' | 'delivered' | 'seen';

export type TTokenPayload = {
  id: string;
  role: TUserRole;
  email: string;
};

export interface AuthRequest extends Request {
  user?: TTokenPayload;
}

export type TVerifyTokenResult = {
  valid: boolean;
  expired: boolean;
  decoded: TTokenPayload | null;
};
