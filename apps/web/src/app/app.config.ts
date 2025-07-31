import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [importProvidersFrom(BrowserModule), provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(appRoutes), provideHttpClient(), provideAnimations()],
};
