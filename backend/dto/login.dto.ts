import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .email({ message: 'Please provide a valid email address' })
    .toLowerCase()
    .trim(),
  password: z.string().min(1, { message: 'Password is required' }),
});

export type LoginDTO = z.infer<typeof loginSchema>;

