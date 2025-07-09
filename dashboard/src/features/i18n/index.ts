import dayjs from 'dayjs';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

declare module 'i18next' {
    interface CustomTypeOptions {
        returnNull: false;
    }
}

i18n
    .use(LanguageDetector)
    .use(HttpApi)
    .use(initReactI18next)
    .init({
        debug: process.env.NODE_ENV === 'development',
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
        react: {
            useSuspense: false,
        },
        load: 'languageOnly',
        detection: {
            order: ['localStorage', 'sessionStorage', 'cookie', 'navigator'],
        },
        backend: {
            loadPath: `/locales/{{lng}}.json`,
        },
        supportedLngs: ['en', 'kur', 'kmr', 'ckb', 'fa', 'ru', 'ar'],
    })
    .then(() => {
        dayjs.locale(i18n.language);
        document.documentElement.lang = i18n.language;
    });

i18n.on('languageChanged', (lng) => {
    dayjs.locale(lng);
    document.documentElement.lang = lng;
});

export default i18n;
