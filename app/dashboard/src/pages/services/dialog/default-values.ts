

import { FormType } from './form-schema';

export const getDefaultValues = (): FormType => {
  return {
    name: '',
    inbounds: [],
  };
};
