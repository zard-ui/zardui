import { makeEnvironmentProviders } from '@angular/core';
import type { EnvironmentProviders } from '@angular/core';

import { DEFAULT_LOCALE } from './i18n.constants';
import { ZARD_I18N, ZARD_LOCALE } from './i18n.tokens';
import type { ZardI18nInterface } from './i18n.types';

export function provideZardI18n(locale: ZardI18nInterface | string = DEFAULT_LOCALE): EnvironmentProviders {
  if (typeof locale === 'string') {
    return makeEnvironmentProviders([{ provide: ZARD_LOCALE, useValue: locale }]);
  }
  return makeEnvironmentProviders([
    { provide: ZARD_LOCALE, useValue: locale.locale },
    { provide: ZARD_I18N, useValue: locale },
  ]);
}
