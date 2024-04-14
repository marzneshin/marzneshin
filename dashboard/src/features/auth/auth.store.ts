import { fetch } from '@marzneshin/utils';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

type AdminStateType = {
    isLoggedIn: () => Promise<boolean>,
    getAuthToken: () => string | null;
    setAuthToken: (token: string) => void;
    removeAuthToken: () => void;
}

export const useAuth = create(
    subscribeWithSelector<AdminStateType>(() => ({
        isLoggedIn: async () => {
            try {
                await fetch('/admins');
                return true;
            } catch (error) {
                return false;
            }
        },
        getAuthToken: () => {
            return localStorage.getItem('token');
        },
        setAuthToken: (token: string) => {
            localStorage.setItem('token', token);
        },
        removeAuthToken: () => {
            localStorage.removeItem('token');
        },
    }))
)
