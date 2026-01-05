import { z } from 'zod';

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters' })
    .max(50, { message: 'Name must not exceed 50 characters' }),
  email: z
    .string()
    .email({ message: 'Please provide a valid email address' })
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' })
    .max(100, { message: 'Password must not exceed 100 characters' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export type RegisterDTO = z.infer<typeof registerSchema>;

