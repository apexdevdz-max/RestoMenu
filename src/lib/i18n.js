import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import fr from '../locales/fr.json';
import ar from '../locales/ar.json';
import en from '../locales/en.json';

const RTL_LANGUAGES = ['ar'];

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      fr: { translation: fr },
      ar: { translation: ar },
      en: { translation: en },
    },
    fallbackLng: 'fr',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'elmawid_lang',
    },
  });

// Apply RTL/LTR direction on language change
function applyDirection(lng) {
  const base = (lng || 'fr').slice(0, 2);
  const isRTL = RTL_LANGUAGES.includes(base);
  document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  document.documentElement.lang = base;
}

// Apply on init
applyDirection(i18n.language);

// Apply on change
i18n.on('languageChanged', applyDirection);

export default i18n;
