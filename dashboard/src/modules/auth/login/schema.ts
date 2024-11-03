import { z } from 'zod';
export const LoginSchema = z.object({
    username: z.string().nonempty('Username is required'),
    password: z.string().nonempty('Password is required'),
});
