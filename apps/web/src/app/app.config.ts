import { provideMarkdown } from 'ngx-markdown';

import { HttpClient, provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import { appRoutes } from './app.routes';

declare const Prism: any;
function addAngularLanguageMarked() {
  Prism.languages.insertBefore('typescript', 'string', {
    'template-string': {
      pattern: /template[\s]*:[\s]*`(?:\\[\s\S]|[^\\`])*`/,
      greedy: true,
      inside: {
        html: {
          pattern: /`(?:\\[\s\S]|[^\\`])*`/,
          inside: Prism.languages.html,
        },
      },
    },
    'styles-string': {
      pattern: /styles[\s]*:[\s]*\[[\s]*`(?:\\[\s\S]|[^\\`])*`[\s]*\]/,
      greedy: true,
      inside: {
        css: {
          pattern: /`(?:\\[\s\S]|[^\\`])*`/,
          inside: Prism.languages.css,
        },
      },
    },
  });
}

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(BrowserModule),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideHttpClient(),
    provideMarkdown({
      loader: HttpClient,
    }),
    provideAppInitializer(addAngularLanguageMarked),
  ],
};
