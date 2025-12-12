import React, { createContext, useContext, useState, useEffect } from "react";
import { translations, Language } from "@/lib/translations";

export type { Language };

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.fr;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const supportedLanguages: Language[] = ['fr', 'en', 'ar', 'es', 'de', 'zh'];

const detectLanguageFromURL = (): Language | null => {
  const pathname = window.location.pathname;
  const pathLang = pathname.split('/')[1]?.toLowerCase();
  
  if (pathLang && supportedLanguages.includes(pathLang as Language)) {
    return pathLang as Language;
  }
  return null;
};

const detectBrowserLanguage = (): Language => {
  // Check navigator language
  const browserLang = navigator.language || (navigator as any).userLanguage;
  const langCode = browserLang?.split('-')[0]?.toLowerCase();
  
  if (supportedLanguages.includes(langCode as Language)) {
    return langCode as Language;
  }
  
  // Check navigator languages array
  const languages = navigator.languages || [];
  for (const lang of languages) {
    const code = lang.split('-')[0].toLowerCase();
    if (supportedLanguages.includes(code as Language)) {
      return code as Language;
    }
  }
  
  // Default to French
  return 'fr';
};

const getInitialLanguage = (): Language => {
  // Priority 1: URL path language (e.g., /en, /ar, /zh)
  const urlLang = detectLanguageFromURL();
  if (urlLang) {
    return urlLang;
  }
  
  // Priority 2: Saved preference in localStorage
  const saved = localStorage.getItem("language");
  if (saved && supportedLanguages.includes(saved as Language)) {
    return saved as Language;
  }
  
  // Priority 3: Browser/system language detection
  return detectBrowserLanguage();
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  // Custom setLanguage that also updates localStorage immediately
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  // Listen for URL changes
  useEffect(() => {
    const urlLang = detectLanguageFromURL();
    if (urlLang && urlLang !== language) {
      setLanguageState(urlLang);
      localStorage.setItem("language", urlLang);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  const value = {
    language,
    setLanguage,
    t: translations[language],
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};