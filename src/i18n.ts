import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import kk from './i18n/kk';

void i18n.use(initReactI18next).init({
  resources: {
    kk: {
      translation: kk,
    },
  },
  lng: 'kk',
  fallbackLng: 'kk',
  supportedLngs: ['kk'],
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
