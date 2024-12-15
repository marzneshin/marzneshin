
import { FetchOptions, ofetch } from 'ofetch';
import { useAuth } from '@marzneshin/modules/auth';

export const $fetch = ofetch.create({
    baseURL: import.meta.env.VITE_BASE_API,
});

export const fetcher = <T = any>(
    url: string,
    ops: FetchOptions<'json'> = {}
) => {
    const token = useAuth.getState().getAuthToken();
    if (token) {
        ops['headers'] = {
            ...(ops?.headers || {}),
            Authorization: `Bearer ${token}`,
        };
    }
    return $fetch<T>(url, ops);
};

export const fetch = fetcher;
