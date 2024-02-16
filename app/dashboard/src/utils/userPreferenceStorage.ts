const NUM_USERS_PER_PAGE_LOCAL_STORAGE_KEY = 'marzban-num-users-per-page';
const NUM_SERVICES_PER_PAGE_LOCAL_STORAGE_KEY = 'marzban-num-services-per-page';
const NUM_NODES_PER_PAGE_LOCAL_STORAGE_KEY = 'marzban-num-nodes-per-page';
const NUM_USERS_PER_PAGE_DEFAULT = 10;
const NUM_NODES_PER_PAGE_DEFAULT = 10;
const NUM_SERVICES_PER_PAGE_DEFAULT = 10;

export const getUsersPerPageLimitSize = () => {
  const numUsersPerPage =
    localStorage.getItem(NUM_USERS_PER_PAGE_LOCAL_STORAGE_KEY) ||
    NUM_USERS_PER_PAGE_DEFAULT.toString(); // this catches `null` values
  return parseInt(numUsersPerPage) || NUM_USERS_PER_PAGE_DEFAULT; // this catches NaN values
};

export const setUsersPerPageLimitSize = (value: string) => {
  return localStorage.setItem(NUM_USERS_PER_PAGE_LOCAL_STORAGE_KEY, value);
};


export const getServicesPerPageLimitSize = () => {
  const numServicesPerPage =
    localStorage.getItem(NUM_SERVICES_PER_PAGE_LOCAL_STORAGE_KEY) ||
    NUM_SERVICES_PER_PAGE_DEFAULT.toString(); // this catches `null` values
  return parseInt(numServicesPerPage) || NUM_SERVICES_PER_PAGE_DEFAULT; // this catches NaN values
};

export const setServicesPerPageLimitSize = (value: string) => {
  return localStorage.setItem(NUM_SERVICES_PER_PAGE_LOCAL_STORAGE_KEY, value);
};

export const getNodesPerPageLimitSize = () => {
  const numNodesPerPage =
    localStorage.getItem(NUM_NODES_PER_PAGE_LOCAL_STORAGE_KEY) ||
    NUM_NODES_PER_PAGE_DEFAULT.toString(); // this catches `null` values
  return parseInt(numNodesPerPage) || NUM_NODES_PER_PAGE_DEFAULT; // this catches NaN values
};

export const setNodesPerPageLimitSize = (value: string) => {
  return localStorage.setItem(NUM_NODES_PER_PAGE_LOCAL_STORAGE_KEY, value);
};
