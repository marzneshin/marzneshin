import { fetch } from '@marzneshin/utils';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

type AdminStateType = {
    isLoggedIn: () => Promise<boolean>,
    getAuthToken: () => string | null;
    setAuthToken: (token: string) => void;
    removeAuthToken: () => void;
    setSudo: (isSudo: boolean) => void;
    isSudo: boolean;
}

export const useAuth = create(
    subscribeWithSelector<AdminStateType>((set) => ({
        isSudo: false,
        isLoggedIn: async () => {
            try {
                await fetch('/admins/current');
                return true;
            } catch (error) {
                return false;
            }
        },
        getAuthToken: () => {
            const token = localStorage.getItem('token');
            return token;
        },
        setSudo: (isSudo) => {
            set(() => ({ isSudo: isSudo }));
        },
        setAuthToken: (token: string) => {
            localStorage.setItem('token', token);
        },
        removeAuthToken: () => {
            localStorage.removeItem('token');
        },
    }))
);
