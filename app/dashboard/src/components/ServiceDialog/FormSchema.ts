
import { z } from 'zod';
import { ServiceCreate } from 'types/Service';

export type FormType = Pick<ServiceCreate, keyof ServiceCreate>;
export const schema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  inbounds: z.array(z.number()).nonempty({ message: 'At least one inbounds is required' }),
});
