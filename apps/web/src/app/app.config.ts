import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig, inject, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import {
  provideClientHydration,
  withEventReplay,
  withHttpTransferCacheOptions,
  withIncrementalHydration,
} from '@angular/platform-browser';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { provideZard } from '@zard/core/provider/providezard';
import { ZardDarkMode } from '@zard/services/dark-mode';

import { appRoutes } from './app.routes';
import { GithubService } from './shared/services/github.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(withEventReplay(), withHttpTransferCacheOptions({}), withIncrementalHydration()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      appRoutes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
      }),
    ),
    provideHttpClient(withFetch()),
    provideZard(),
    provideAppInitializer(() => {
      inject(ZardDarkMode).init();
      return inject(GithubService).init();
    }),
  ],
};
