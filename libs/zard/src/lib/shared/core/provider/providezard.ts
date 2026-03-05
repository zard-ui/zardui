import { makeEnvironmentProviders, type EnvironmentProviders } from '@angular/core';
import { EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';

import { provideIcons } from '@ng-icons/core';

import { ZARD_ICONS } from '@/shared/components/icon/icons';

import { ZardDebounceEventManagerPlugin } from './event-manager-plugins/zard-debounce-event-manager-plugin';
import { ZardEventManagerPlugin } from './event-manager-plugins/zard-event-manager-plugin';

export function provideZard(): EnvironmentProviders {
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

  return makeEnvironmentProviders([...eventManagerPlugins, provideIcons(ZARD_ICONS)]);
}
