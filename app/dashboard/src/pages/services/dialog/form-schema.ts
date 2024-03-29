
import { z } from 'zod';
import { ServiceCreate } from 'types';

export type FormType = Pick<ServiceCreate, 'name' | 'inbounds'>;
export const schema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  inbounds: z.array(z.number()).nonempty({ message: 'At least one inbounds is required' }),
});
