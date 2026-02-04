import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { translations } from '../i18n.js';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    const stored = localStorage.getItem('himuria_lang');
    return stored && translations[stored] ? stored : 'en';
  });

  useEffect(() => {
    // Keep global direction in sync with language selection.
    document.documentElement.dir = language === 'he' ? 'rtl' : 'ltr';
    localStorage.setItem('himuria_lang', language);
  }, [language]);

  const t = useMemo(() => {
    return (key) => {
      const parts = key.split('.');
      let current = translations[language] || translations.en;
      for (const part of parts) {
        current = current?.[part];
      }
      return current ?? key;
    };
  }, [language]);

  const value = useMemo(() => ({ language, setLanguage, t }), [language, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return ctx;
}
