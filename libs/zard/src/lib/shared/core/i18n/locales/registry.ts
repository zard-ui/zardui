import type { ZardI18nInterface } from '../i18n.types';
import { de_DE } from './de-de';
import { en_US } from './en-us';
import { es_ES } from './es-es';
import { fr_FR } from './fr-fr';
import { it_IT } from './it-it';
import { pt_BR } from './pt-br';
import { pt_PT } from './pt-pt';

export const STANDARD_LOCALES: Record<string, ZardI18nInterface> = {
  'en-US': en_US,
  en: en_US,
  'fr-FR': fr_FR,
  fr: fr_FR,
  'es-ES': es_ES,
  es: es_ES,
  'de-DE': de_DE,
  de: de_DE,
  'it-IT': it_IT,
  it: it_IT,
  'pt-BR': pt_BR,
  'pt-PT': pt_PT,
  pt: pt_BR,
};

export function getPresetLocale(locale: string): ZardI18nInterface | undefined {
  if (!locale) {
    return undefined;
  }
  return (
    STANDARD_LOCALES[locale] ??
    STANDARD_LOCALES[locale.toLowerCase()] ??
    STANDARD_LOCALES[locale.split(/[-_]/)[0].toLowerCase()]
  );
}
