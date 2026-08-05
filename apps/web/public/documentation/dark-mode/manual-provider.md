```angular-ts title="src/app/shared/core/provider/providezard.ts" showLineNumbers copyButton {1,4,23}
import { inject, makeEnvironmentProviders, provideAppInitializer, type EnvironmentProviders } from '@angular/core';
import { EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';

import { ZardDarkMode } from '@/shared/services/dark-mode';

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

  return makeEnvironmentProviders([provideAppInitializer(() => inject(ZardDarkMode).init()), ...eventManagerPlugins]);
}
```

```angular-ts title="src/app/app.config.ts" showLineNumbers copyButton {1,3,6}
import { ApplicationConfig, inject, provideAppInitializer } from '@angular/core';

import { ZardDarkMode } from '@/shared/services/dark-mode';

export const appConfig: ApplicationConfig = {
  providers: [provideAppInitializer(() => inject(ZardDarkMode).init())],
};
```
