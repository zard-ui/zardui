import {
  DOCUMENT,
  inject,
  InjectionToken,
  makeEnvironmentProviders,
  provideAppInitializer,
  type EnvironmentProviders,
} from '@angular/core';
import { EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';

import { ZardPreset, type ZardConfigType } from './config.types';
import { updatePreset } from './update-preset';
import { ZardDebounceEventManagerPlugin } from '../event-manager-plugins/zard-debounce-event-manager-plugin';
import { ZardEventManagerPlugin } from '../event-manager-plugins/zard-event-manager-plugin';

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
    {
      provide: EVENT_MANAGER_PLUGINS,
      useClass: ZardDebounceEventManagerPlugin,
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

export const checkForProperZardInitialization = (): void => {
  const eventPlugins = inject(EVENT_MANAGER_PLUGINS);
  const zardProperlyInitialized = eventPlugins.some(plugin => plugin instanceof ZardEventManagerPlugin);
  if (!zardProperlyInitialized) {
    throw new Error("Zard: Initialization missing. Please call `provideZard()` in your app's root providers.");
  }
};
