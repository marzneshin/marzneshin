

import { FormType } from './FormSchema';

export const getDefaultValues = (): FormType => {
  return {
    name: '',
    inbounds: [],
  };
};
