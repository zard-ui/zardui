import {
  DOCUMENT,
  inject,
  InjectionToken,
  makeEnvironmentProviders,
  provideAppInitializer,
  type EnvironmentProviders,
} from '@angular/core';
import { EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';

import { ZardEventManagerPlugin } from '../zard-event-manager-plugin';
import { ZardPreset, type ZardConfigType } from './config.types';
import { updatePreset } from './update-preset';

export const ZARD_CONFIG = new InjectionToken<ZardConfigType>('ZARD_CONFIG');

/*
  usage:
    - provideZard(): this will use styles.css only
    - provideZard(withSlatePreset()): sets from app.config what base colors are used and
      overrides what is defined in styles.css

    ** Note ** styles.css is still required in order to overriding works
 */
export function provideZard(...zardConfig: ZardConfigType[]): EnvironmentProviders {
  const providers = zardConfig?.map(config => ({
    provide: ZARD_CONFIG,
    useValue: config,
    multi: false,
  }));

  const eventMangerPlugins = [
    {
      provide: EVENT_MANAGER_PLUGINS,
      useClass: ZardEventManagerPlugin,
      multi: true,
    },
  ];

  const themeInitializer = provideAppInitializer(() => {
    const document = inject(DOCUMENT);
    const [config] = zardConfig;
    if (config?.theme?.preset) {
      const styleTag = document.createElement('style');
      styleTag.textContent = updatePreset(config.theme.preset);
      document.head.appendChild(styleTag);
    }
  });

  return makeEnvironmentProviders([...providers, ...eventMangerPlugins, themeInitializer]);
}

export const withGrayPreset = (): ZardConfigType => ({ theme: { preset: ZardPreset.GRAY } }) as const;
export const withNeutralPreset = (): ZardConfigType => ({ theme: { preset: ZardPreset.NEUTRAL } }) as const;
export const withSlatePreset = (): ZardConfigType => ({ theme: { preset: ZardPreset.SLATE } }) as const;
export const withStonePreset = (): ZardConfigType => ({ theme: { preset: ZardPreset.STONE } }) as const;
export const withZincPreset = (): ZardConfigType => ({ theme: { preset: ZardPreset.ZINC } }) as const;
