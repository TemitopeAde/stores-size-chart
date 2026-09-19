# Localization & Multi-Language Guide

This document details the multi-language architecture, supported locales, translation engine, and bidirectional (RTL) support for the **Stores Size Chart & Fit Guide** application.

---

## 1. Supported Languages (20 Locales)

The application provides 100% complete translations for **20 major global languages** across both the merchant dashboard and shopper-facing storefront:

| Code | Language | Native Name | Script Direction |
| :--- | :--- | :--- | :---: |
| `en` | English | English | LTR |
| `es` | Spanish | Español | LTR |
| `fr` | French | Français | LTR |
| `de` | German | Deutsch | LTR |
| `pt` | Portuguese | Português | LTR |
| `it` | Italian | Italiano | LTR |
| `nl` | Dutch | Nederlands | LTR |
| `pl` | Polish | Polski | LTR |
| `sv` | Swedish | Svenska | LTR |
| `da` | Danish | Dansk | LTR |
| `no` | Norwegian | Norsk | LTR |
| `fi` | Finnish | Suomi | LTR |
| `ja` | Japanese | 日本語 | LTR |
| `ko` | Korean | 한국어 | LTR |
| `zh-CN` | Chinese (Simplified) | 简体中文 | LTR |
| `zh-TW` | Chinese (Traditional) | 繁體中文 | LTR |
| `ar` | Arabic | العربية | **RTL** |
| `tr` | Turkish | Türkçe | LTR |
| `id` | Indonesian | Bahasa Indonesia | LTR |
| `hi` | Hindi | हिन्दी | LTR |

---

## 2. Translation Engine Architecture

### 2.1 Locale Detection & Normalization

The translation engine automatically detects and normalizes language codes from:
1. Shopper storefront language attribute (`<html lang="...">` or `locale` attribute).
2. Wix Dashboard merchant language preferences.
3. Fallback to default (`en`) if unsupported.

```ts
import { normalizeLocale } from './i18n/config';

normalizeLocale('fr-CA'); // -> 'fr'
normalizeLocale('es_ES'); // -> 'es'
normalizeLocale('zh_Hans'); // -> 'zh-CN'
```

### 2.2 Interpolation & Parameter Replacement

Translations support dynamic token replacement:

```json
// en.json
{
  "charts.deleteConfirmDesc": "Are you sure you want to delete \"{name}\"? This action cannot be undone."
}
```

```tsx
t('charts.deleteConfirmDesc', { name: chart.name })
```

---

## 3. Bidirectional (RTL) Support

* For Arabic (`ar`), the dashboard and storefront plugins automatically apply `dir="rtl"` attributes and CSS mirrored layouts.
* Alignment, icons, margins, and tooltips adjust appropriately to maintain natural reading ergonomics.

---

## 4. Zero Hardcoded Strings Policy

Every user-facing label, button, modal title, placeholder, tooltip, and error message is strictly localized through `src/i18n/locales/*.json`. All 20 locale files maintain identical key structures.

