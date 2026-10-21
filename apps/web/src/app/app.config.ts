import { PlatformLocation } from '@angular/common';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig, inject, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import {
  provideClientHydration,
  withEventReplay,
  withHttpTransferCacheOptions,
  withIncrementalHydration,
} from '@angular/platform-browser';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { provideZardCharts } from '@zard/components/chart/chart-echarts.provider';
import { provideZard } from '@zard/core/provider/providezard';
import { ZardDarkMode } from '@zard/services/dark-mode';

import { appRoutes } from './app.routes';
import { provideEventReplayRelease } from './core/hydration/release-event-replay';
import { isPreviewUrl } from './core/routing/preview-routes';
import { GithubService } from './shared/services/github.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(withEventReplay(), withHttpTransferCacheOptions({}), withIncrementalHydration()),
    provideEventReplayRelease(),
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
    provideZardCharts(),
    provideAppInitializer(() => {
      inject(ZardDarkMode).init();
      // The star count and contributors feed the header and footer, which a preview frame does not render.
      if (isPreviewUrl(inject(PlatformLocation).pathname)) return;
      return inject(GithubService).init();
    }),
  ],
};
