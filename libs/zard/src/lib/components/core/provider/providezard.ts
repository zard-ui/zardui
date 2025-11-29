import { DOCUMENT } from '@angular/common';
import {
  inject,
  InjectionToken,
  makeEnvironmentProviders,
  provideAppInitializer,
  type EnvironmentProviders,
} from '@angular/core';
import { EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';

import { ZardPreset, type ZardConfigType } from './config/config.types';
import { updatePreset } from './config/update-preset';
import { ZardDebounceEventManagerPlugin } from './event-manager-plugins/zard-debounce-event-manager-plugin';
import { ZardEventManagerPlugin } from './event-manager-plugins/zard-event-manager-plugin';

export const ZARD_CONFIG = new InjectionToken<ZardConfigType>('ZARD_CONFIG');

/*
    usage:
    - provideZard(): uses the theme defined in styles.css only
    - provideZard(withSlatePreset()): selects a base color preset from app.config and
      overrides what is defined in styles.css

      ** Note ** styles.css from CLI is still required for overrides to work.
 */
export function provideZard(zardConfig?: ZardConfigType): EnvironmentProviders {
  const zardConfigProvider = zardConfig ? [{ provide: ZARD_CONFIG, useValue: zardConfig }] : [];

  const eventManagerPlugins = [
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
    const existingTag = document.head.querySelector('style[data-zard-theme]');

    if (zardConfig?.theme?.preset) {
      try {
        if (existingTag) {
          existingTag.textContent = updatePreset(zardConfig.theme.preset);
        } else {
          const styleTag = document.createElement('style');
          styleTag.setAttribute('data-zard-theme', '');
          styleTag.textContent = updatePreset(zardConfig.theme.preset);
          document.head.appendChild(styleTag);
        }
      } catch (error) {
        console.error('Failed to apply Zard theme preset:', error);
      }
    } else if (existingTag) {
      existingTag.remove();
    }
  });

  return makeEnvironmentProviders([...zardConfigProvider, ...eventManagerPlugins, themeInitializer]);
}

export const withGrayPreset = (): ZardConfigType => ({ theme: { preset: ZardPreset.GRAY } }) as const;
export const withNeutralPreset = (): ZardConfigType => ({ theme: { preset: ZardPreset.NEUTRAL } }) as const;
export const withSlatePreset = (): ZardConfigType => ({ theme: { preset: ZardPreset.SLATE } }) as const;
export const withStonePreset = (): ZardConfigType => ({ theme: { preset: ZardPreset.STONE } }) as const;
export const withZincPreset = (): ZardConfigType => ({ theme: { preset: ZardPreset.ZINC } }) as const;

export const checkForProperZardInitialization = (): void => {
  const eventPlugins = inject(EVENT_MANAGER_PLUGINS, { optional: true }) ?? [];
  const zardProperlyInitialized = eventPlugins.some(
    plugin => plugin instanceof ZardEventManagerPlugin || plugin instanceof ZardDebounceEventManagerPlugin,
  );
  if (!zardProperlyInitialized) {
    throw new Error("Zard: Initialization missing. Please call `provideZard()` in your app's root providers.");
  }
};
