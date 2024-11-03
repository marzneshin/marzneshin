import { fetch } from '@marzneshin/common/utils';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

type AdminStateType = {
    isLoggedIn: () => Promise<boolean>,
    getAuthToken: () => string | null;
    isSudo: () => boolean;
    setAuthToken: (token: string) => void;
    removeAuthToken: () => void;
    setSudo: (isSudo: boolean) => void;
}

export const useAuth = create(
    subscribeWithSelector<AdminStateType>(() => ({
        isLoggedIn: async () => {
            try {
                await fetch('/admins/current');
                return true;
            } catch (error) {
                return false;
            }
        },
        getAuthToken: () => {
            return localStorage.getItem('token');
        },
        isSudo: () => {
            const isSudo = localStorage.getItem('is-sudo')
            return isSudo === "true";
        },
        setSudo: (isSudo) => {
            localStorage.setItem('is-sudo', String(isSudo));
        },
        setAuthToken: (token: string) => {
            localStorage.setItem('token', token);
        },
        removeAuthToken: () => {
            localStorage.removeItem('token');
        },
    }))
)
