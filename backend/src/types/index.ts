import { Request } from 'express';

export type TUserRole = 'user' | 'admin';

export type TMessageStatus = 'sent' | 'delivered';

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
