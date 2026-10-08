import { InjectionToken } from '@angular/core';

import type { ZardI18nInterface } from './i18n.types';

export const ZARD_LOCALE = new InjectionToken<string>('ZARD_LOCALE');
export const ZARD_I18N = new InjectionToken<ZardI18nInterface>('ZARD_I18N');
