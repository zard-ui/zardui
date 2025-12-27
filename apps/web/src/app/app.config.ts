import { provideHttpClient, withFetch } from '@angular/common/http';
import {
  ApplicationConfig,
  importProvidersFrom,
  inject,
  provideAppInitializer,
  provideZoneChangeDetection,
} from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { provideZard } from '@zard/core/provider/providezard';
import { ZardDarkMode } from '@zard/services/dark-mode';

import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(withEventReplay()),
    importProvidersFrom(BrowserModule),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      appRoutes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'disabled',
      }),
    ),
    provideHttpClient(withFetch()),
    provideZard(),
    provideAppInitializer(() => inject(ZardDarkMode).init()),
  ],
};
