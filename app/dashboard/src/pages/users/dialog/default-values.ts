
import { FormType } from './form-schema';

export const getDefaultValues = (): FormType => {

  return {
    services: [],
    data_limit: 0,
    expire: null,
    username: '',
    data_limit_reset_strategy: 'no_reset',
    status: 'active',
    note: '',
  };
};
