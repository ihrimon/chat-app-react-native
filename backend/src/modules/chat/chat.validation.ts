import { z } from 'zod';

export const createChatSchema = z.object({
  receiverId: z
    .string({ error: 'receiverId is required' })
    .min(1, 'receiverId cannot be empty'),
});
