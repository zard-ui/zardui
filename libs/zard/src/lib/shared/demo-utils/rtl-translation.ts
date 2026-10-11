/**
 * Docs-only helper behind the RTL examples (`demo/rtl.ts`) and the RTL preview of the docs site.
 *
 * It is NOT part of the library: it is not exported from `index.ts` and not listed in the CLI registry, so it never
 * reaches a user's project. Demo files import it with `@/shared/demo-utils/rtl-translation`.
 *
 * The docs site renders an RTL example inside a wrapper that sets `dir` (CDK `Dir`) and `data-lang`, and provides the
 * language picked in the preview header through {@link ZARD_RTL_LANGUAGE}. A demo calls {@link injectRtlTranslation}
 * with its own `en` / `ar` / `he` strings and reads them from the returned signals.
 */
import { computed, inject, InjectionToken, type Signal, signal } from '@angular/core';

export type ZardRtlLanguage = 'en' | 'ar' | 'he';

export type ZardRtlDirection = 'ltr' | 'rtl';

/** One language of an example: the direction it is written in, and the strings of the example. */
export interface ZardRtlTranslation<T> {
  dir: ZardRtlDirection;
  values: T;
}

/** The translations every RTL example carries: English, Arabic and Hebrew. */
export type ZardRtlTranslations<T> = Record<ZardRtlLanguage, ZardRtlTranslation<T>>;

/** The languages offered by the RTL preview, in the order of its selector. */
export const ZARD_RTL_LANGUAGES: readonly { code: ZardRtlLanguage; label: string; dir: ZardRtlDirection }[] = [
  { code: 'en', label: 'English', dir: 'ltr' },
  { code: 'ar', label: 'Arabic (العربية)', dir: 'rtl' },
  { code: 'he', label: 'Hebrew (עברית)', dir: 'rtl' },
];

/** What the preview starts with, and what a demo falls back to when it is rendered outside the RTL preview. */
export const ZARD_RTL_DEFAULT_LANGUAGE: ZardRtlLanguage = 'ar';

/**
 * Provided by the RTL preview of the docs site (`z-code-box`) with the language chosen in its header.
 * Outside of it the token falls back to {@link ZARD_RTL_DEFAULT_LANGUAGE} (Arabic).
 */
export const ZARD_RTL_LANGUAGE = new InjectionToken<Signal<ZardRtlLanguage>>('ZARD_RTL_LANGUAGE', {
  factory: () => signal(ZARD_RTL_DEFAULT_LANGUAGE),
});

export interface ZardRtlTranslationRef<T> {
  /** The selected language. */
  language: Signal<ZardRtlLanguage>;
  /** The direction of the selected language. */
  dir: Signal<ZardRtlDirection>;
  /** The strings of the selected language: `t().title`. */
  t: Signal<T>;
}

/**
 * Reads the selected language and the matching strings. Call it from an injection context (a field initializer).
 *
 * @example
 * private readonly i18n = injectRtlTranslation(translations);
 * // template: {{ i18n.t().title }}
 */
export function injectRtlTranslation<T>(translations: ZardRtlTranslations<T>): ZardRtlTranslationRef<T> {
  const language = inject(ZARD_RTL_LANGUAGE);

  return {
    language,
    dir: computed(() => translations[language()].dir),
    t: computed(() => translations[language()].values),
  };
}
