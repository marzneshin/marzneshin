import { ReadyState } from 'react-use-websocket';
import { joinPaths } from '@remix-run/router';
import { getAuthToken } from 'service/auth-storage';

export const getStatus = (status: string) => {
  return {
    [ReadyState.CONNECTING]: 'connecting',
    [ReadyState.OPEN]: 'connected',
    [ReadyState.CLOSING]: 'closed',
    [ReadyState.CLOSED]: 'closed',
    [ReadyState.UNINSTANTIATED]: 'closed',
  }[status];
};

export const getWebsocketUrl = (node_id: number) => {
  try {
    let baseURL = new URL(
      import.meta.env.VITE_BASE_API.startsWith('/')
        ? window.location.origin + import.meta.env.VITE_BASE_API
        : import.meta.env.VITE_BASE_API
    );

    return (
      (baseURL.protocol === 'https:' ? 'wss://' : 'ws://') +
            joinPaths([baseURL.host + baseURL.pathname, `/nodes/${node_id}/logs`]) +
            '?interval=1&token=' +
            getAuthToken()
    );
  } catch (e) {
    console.error('Unable to generate websocket url');
    console.error(e);
    return null;
  }
};
