import { HomeAssistant } from 'custom-card-helpers';
import { Language, TranslatableString } from '../types';
import * as en from './languages/en.json';
import * as pl from './languages/pl.json';

const languages: Record<string, unknown> = {
  en: en,
  pl: pl
};

function localizeString(string: string, search = '', replace = '', lang: Language = '', fallback = string): string {
  const defaultLang = 'en';
  if (!lang) {
    try {
      lang = JSON.parse(localStorage.getItem('selectedLanguage') || `"${defaultLang}"`);
    } catch {
      lang = (localStorage.getItem('selectedLanguage') || defaultLang).replace(/['"]+/g, '');
    }
  }

  let translated: string | undefined;

  try {
    translated = evaluateForLanguage(string, lang ?? defaultLang);
  } catch (e) {
    translated = evaluateForLanguage(string, defaultLang);
  }

  if (translated === undefined) translated = evaluateForLanguage(string, defaultLang);

  translated = translated ?? fallback;
  if (search !== '' && replace !== '') {
    translated = translated.replace(search, replace);
  }
  return translated;
}

function evaluateForLanguage(string: string, lang: string): string | undefined {
  try {
    return string.split('.').reduce((o, i) => (o as Record<string, unknown>)[i], languages[lang]) as string;
  } catch (_) {
    return undefined;
  }
}

export function localize(ts: TranslatableString, lang?: Language, fallback?: string): string {
  if (typeof ts === 'string') {
    return localizeString(ts as string, '', '', lang, fallback);
  } else {
    return localizeString(...ts, lang, fallback);
  }
}

export function localizeWithHass(ts: TranslatableString, hass?: HomeAssistant, fallback?: string): string {
  return localize(ts, hass?.locale?.language, fallback);
}
