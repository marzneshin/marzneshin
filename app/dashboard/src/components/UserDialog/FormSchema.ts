
import { z } from 'zod';
import { UserCreate } from 'types/User';

export type FormType = Pick<UserCreate, keyof UserCreate>;
export const schema = z.object({
  username: z.string().min(1, { message: 'Username is required' }),
  note: z.string().nullable(),
  data_limit: z
    .string()
    .min(0, 'The minimum number is 0')
    .or(z.number())
    .nullable()
    .transform((str) => {
      if (str) return Number((parseFloat(String(str)) * 1073741824).toFixed(5));
      return 0;
    }),
  expire: z.number().nullable(),
  data_limit_reset_strategy: z.string(),
  status: z.string(),
  services: z.array(z.number()).nonempty({ message: 'At least one service is required' }),
});
