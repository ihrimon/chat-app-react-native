import { Request } from 'express';

export type TUserRole = 'user' | 'admin';

export interface AuthRequest extends Request {
  user?: { id: string; role: TUserRole; email: string };
}
