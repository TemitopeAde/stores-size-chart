import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { SupportedLocale, LocaleInfo, TranslationParams } from './types';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, normalizeLocale, isRTL } from './config';

// Import all 20 locales statically
import en from './locales/en.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import de from './locales/de.json';
import pt from './locales/pt.json';
import it from './locales/it.json';
import nl from './locales/nl.json';
import pl from './locales/pl.json';
import sv from './locales/sv.json';
import da from './locales/da.json';
import no from './locales/no.json';
import fi from './locales/fi.json';
import ja from './locales/ja.json';
import ko from './locales/ko.json';
import zhCN from './locales/zh-CN.json';
import zhTW from './locales/zh-TW.json';
import ar from './locales/ar.json';
import tr from './locales/tr.json';
import id from './locales/id.json';
import hi from './locales/hi.json';

const dictionaries: Record<SupportedLocale, any> = {
  en,
  es,
  fr,
  de,
  pt,
  it,
  nl,
  pl,
  sv,
  da,
  no,
  fi,
  ja,
  ko,
  'zh-CN': zhCN,
  'zh-TW': zhTW,
  ar,
  tr,
  id,
  hi,
};

function getNestedValue(obj: any, path: string): string | undefined {
  if (!obj || typeof obj !== 'object') return undefined;
  const parts = path.split('.');
  let current: any = obj;
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      return undefined;
    }
  }
  return typeof current === 'string' ? current : undefined;
}

export function translate(
  locale: SupportedLocale,
  key: string,
  params?: TranslationParams
): string {
  const dict = dictionaries[locale] || dictionaries[DEFAULT_LOCALE];
  let template = getNestedValue(dict, key);

  // Fallback to English if key missing in target locale
  if (template === undefined && locale !== DEFAULT_LOCALE) {
    template = getNestedValue(dictionaries[DEFAULT_LOCALE], key);
  }

  if (template === undefined) {
    return key;
  }

  if (!params) {
    return template;
  }

  // Interpolate {{param}} variables
  return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, varName) => {
    const val = params[varName];
    return val !== undefined && val !== null ? String(val) : `{{${varName}}}`;
  });
}

export function formatLocaleDate(date: Date | string | number, locale: SupportedLocale, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'object' ? date : new Date(date);
  if (isNaN(d.getTime())) return String(date);
  try {
    return new Intl.DateTimeFormat(locale, options || { year: 'numeric', month: 'short', day: 'numeric' }).format(d);
  } catch {
    return d.toLocaleDateString();
  }
}

export function formatLocaleNumber(num: number, locale: SupportedLocale, options?: Intl.NumberFormatOptions): string {
  try {
    return new Intl.NumberFormat(locale, options).format(num);
  } catch {
    return String(num);
  }
}

export interface I18nContextValue {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  localeInfo: LocaleInfo;
  dir: 'ltr' | 'rtl';
  t: (key: string, params?: TranslationParams) => string;
  formatDate: (date: Date | string | number, options?: Intl.DateTimeFormatOptions) => string;
  formatNumber: (num: number, options?: Intl.NumberFormatOptions) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export interface I18nProviderProps {
  initialLocale?: string;
  children: ReactNode;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ initialLocale, children }) => {
  const [locale, setLocaleState] = useState<SupportedLocale>(() => normalizeLocale(initialLocale));

  const setLocale = (newLocale: SupportedLocale) => {
    setLocaleState(normalizeLocale(newLocale));
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem('size_chart_locale', newLocale);
      }
    } catch {}
  };

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = window.localStorage.getItem('size_chart_locale');
        if (saved) {
          setLocaleState(normalizeLocale(saved));
        }
      }
    } catch {}
  }, []);

  const dir = isRTL(locale) ? 'rtl' : 'ltr';
  const localeInfo = SUPPORTED_LOCALES[locale] || SUPPORTED_LOCALES[DEFAULT_LOCALE];

  const value = useMemo<I18nContextValue>(() => ({
    locale,
    setLocale,
    localeInfo,
    dir,
    t: (key: string, params?: TranslationParams) => translate(locale, key, params),
    formatDate: (date, options) => formatLocaleDate(date, locale, options),
    formatNumber: (num, options) => formatLocaleNumber(num, locale, options),
  }), [locale, dir, localeInfo]);

  return (
    <I18nContext.Provider value={value}>
      <div dir={dir} className="w-full">
        {children}
      </div>
    </I18nContext.Provider>
  );
};

export function useTranslation() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    // Fallback if rendered outside of provider
    return {
      locale: DEFAULT_LOCALE,
      setLocale: () => {},
      localeInfo: SUPPORTED_LOCALES[DEFAULT_LOCALE],
      dir: 'ltr' as const,
      t: (key: string, params?: TranslationParams) => translate(DEFAULT_LOCALE, key, params),
      formatDate: (d: any, opt: any) => formatLocaleDate(d, DEFAULT_LOCALE, opt),
      formatNumber: (n: any, opt: any) => formatLocaleNumber(n, DEFAULT_LOCALE, opt),
    };
  }
  return ctx;
}

