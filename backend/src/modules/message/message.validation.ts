import { z } from 'zod';

export const sendMessageSchema = z.object({
  chatId: z
    .string({ error: 'chatId is required' })
    .min(1, 'chatId cannot be empty'),

  text: z
    .string({ error: 'text is required' })
    .trim()
    .min(1, 'Message cannot be empty')
    .max(2000, 'Message must not exceed 2000 characters'),
});
