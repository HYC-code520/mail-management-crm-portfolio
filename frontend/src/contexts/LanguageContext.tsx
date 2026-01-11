import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

type LanguageMode = 'EN' | 'CN' | 'BOTH';

interface LanguageContextType {
  language: LanguageMode;
  setLanguage: (lang: LanguageMode) => void;
  t: (key: string, options?: Record<string, unknown>) => string;
  tBoth: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { t: i18nT, i18n } = useTranslation();
  const [language, setLanguageState] = useState<LanguageMode>(() => {
    return (localStorage.getItem('appLanguage') as LanguageMode) || 'EN';
  });

  const setLanguage = (lang: LanguageMode) => {
    setLanguageState(lang);
    localStorage.setItem('appLanguage', lang);

    // Update i18next language
    if (lang === 'CN') {
      i18n.changeLanguage('zh');
    } else {
      // For EN and BOTH, default to English as base
      i18n.changeLanguage('en');
    }
  };

  // Bilingual helper: "English / 中文"
  const tBoth = (key: string): string => {
    const enText = i18n.t(key, { lng: 'en' });
    const zhText = i18n.t(key, { lng: 'zh' });
    return `${enText} / ${zhText}`;
  };

  // Smart translation based on mode
  const translate = (key: string, options?: Record<string, unknown>): string => {
    if (language === 'BOTH') {
      const enText = i18n.t(key, { ...options, lng: 'en' });
      const zhText = i18n.t(key, { ...options, lng: 'zh' });
      return `${enText} / ${zhText}`;
    }
    return i18nT(key, options);
  };

  useEffect(() => {
    // Sync i18n on mount based on stored preference
    if (language === 'CN') {
      i18n.changeLanguage('zh');
    } else {
      i18n.changeLanguage('en');
    }
  }, [i18n, language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translate, tBoth }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
