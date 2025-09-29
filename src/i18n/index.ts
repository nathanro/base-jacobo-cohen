import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import enTranslation from '../locales/en/translation.json';
import esTranslation from '../locales/es/translation.json';

const resources = {
  en: {
    translation: enTranslation
  },
  es: {
    translation: esTranslation
  }
};

i18n.
use(initReactI18next).
init({
  resources,
  lng: localStorage.getItem('language') || 'en', // Default language
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false // React already does escaping
  }
});

export default i18n;