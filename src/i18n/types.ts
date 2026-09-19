export type SupportedLocale =
  | 'en'
  | 'es'
  | 'fr'
  | 'de'
  | 'pt'
  | 'it'
  | 'nl'
  | 'pl'
  | 'sv'
  | 'da'
  | 'no'
  | 'fi'
  | 'ja'
  | 'ko'
  | 'zh-CN'
  | 'zh-TW'
  | 'ar'
  | 'tr'
  | 'id'
  | 'hi';

export type TextDirection = 'ltr' | 'rtl';

export interface LocaleInfo {
  code: SupportedLocale;
  name: string;
  nativeName: string;
  dir: TextDirection;
}

export interface TranslationParams {
  [key: string]: string | number | boolean | undefined | null;
}
