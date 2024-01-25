import { fetch } from '../../service/http';
import { getAuthToken } from '../../utils/authStorage';

export const fetchAdminLoader = () => {
  return fetch('/admin', {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });
};
