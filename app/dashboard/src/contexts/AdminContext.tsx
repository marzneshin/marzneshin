import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

type AdminStateType = {
    isLoggedIn: boolean,
    getAuthToken: () => string | null;
    setAuthToken: (token: string) => void;
    removeAuthToken: () => void;
}

export const useAdmin = create(
    subscribeWithSelector<AdminStateType>((set, get) => ({
        isLoggedIn: false,
        getAuthToken: () => {
            return localStorage.getItem('token');
        },
        setAuthToken: (token: string) => {
            localStorage.setItem('token', token);
            set({ isLoggedIn: true });
        },

        removeAuthToken: () => {
            localStorage.removeItem('token');
            set({ isLoggedIn: false });
        },
    }))
)
