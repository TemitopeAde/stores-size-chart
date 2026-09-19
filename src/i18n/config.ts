import { SupportedLocale, LocaleInfo } from './types';

export const DEFAULT_LOCALE: SupportedLocale = 'en';

export const SUPPORTED_LOCALES: Record<SupportedLocale, LocaleInfo> = {
  en: { code: 'en', name: 'English', nativeName: 'English', dir: 'ltr' },
  es: { code: 'es', name: 'Spanish', nativeName: 'Español', dir: 'ltr' },
  fr: { code: 'fr', name: 'French', nativeName: 'Français', dir: 'ltr' },
  de: { code: 'de', name: 'German', nativeName: 'Deutsch', dir: 'ltr' },
  pt: { code: 'pt', name: 'Portuguese', nativeName: 'Português', dir: 'ltr' },
  it: { code: 'it', name: 'Italian', nativeName: 'Italiano', dir: 'ltr' },
  nl: { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', dir: 'ltr' },
  pl: { code: 'pl', name: 'Polish', nativeName: 'Polski', dir: 'ltr' },
  sv: { code: 'sv', name: 'Swedish', nativeName: 'Svenska', dir: 'ltr' },
  da: { code: 'da', name: 'Danish', nativeName: 'Dansk', dir: 'ltr' },
  no: { code: 'no', name: 'Norwegian', nativeName: 'Norsk', dir: 'ltr' },
  fi: { code: 'fi', name: 'Finnish', nativeName: 'Suomi', dir: 'ltr' },
  ja: { code: 'ja', name: 'Japanese', nativeName: '日本語', dir: 'ltr' },
  ko: { code: 'ko', name: 'Korean', nativeName: '한국어', dir: 'ltr' },
  'zh-CN': { code: 'zh-CN', name: 'Simplified Chinese', nativeName: '简体中文', dir: 'ltr' },
  'zh-TW': { code: 'zh-TW', name: 'Traditional Chinese', nativeName: '繁體中文', dir: 'ltr' },
  ar: { code: 'ar', name: 'Arabic', nativeName: 'العربية', dir: 'rtl' },
  tr: { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', dir: 'ltr' },
  id: { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', dir: 'ltr' },
  hi: { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', dir: 'ltr' },
};

export function normalizeLocale(rawLocale?: string | null): SupportedLocale {
  if (!rawLocale) return DEFAULT_LOCALE;
  const clean = rawLocale.trim().replace('_', '-');
  const lower = clean.toLowerCase();

  // Chinese special cases
  if (lower.startsWith('zh-tw') || lower.startsWith('zh-hk') || lower.startsWith('zh-mo') || lower === 'zh-hant') {
    return 'zh-TW';
  }
  if (lower.startsWith('zh')) {
    return 'zh-CN';
  }

  // Exact match
  if (clean in SUPPORTED_LOCALES) {
    return clean as SupportedLocale;
  }

  // Base language match
  const base = lower.split('-')[0];
  if (base in SUPPORTED_LOCALES) {
    return base as SupportedLocale;
  }

  return DEFAULT_LOCALE;
}

export function isRTL(locale: SupportedLocale): boolean {
  return SUPPORTED_LOCALES[locale]?.dir === 'rtl';
}
