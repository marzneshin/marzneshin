import { z } from 'zod';

export const LoginSchema = z.object({
  username: z.string().min(1, 'Username is required.'),
  password: z.string().min(1, 'Password is required.'),
  otp: z.string().optional(),
});