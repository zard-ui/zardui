import { DOCUMENT } from '@angular/common';
import { inject, provideEnvironmentInitializer, type EnvironmentProviders } from '@angular/core';

const LINK_ATTRIBUTE = 'data-maplibre-css';

/**
 * Links MapLibre's stylesheet (about 90 kB, mostly inlined icons) once, and only for the routes that render maps.
 *
 * Importing it from `styles.css` would put it in the initial bundle of every page. It ships as a build asset
 * (`maplibre-gl.css` at the app root, next to the worker files) and this adds the `<link>` when a map route is
 * created. It runs on the server too, so the prerendered HTML already carries the link.
 */
export function provideMapLibreStyles(): EnvironmentProviders {
  return provideEnvironmentInitializer(() => {
    const document = inject(DOCUMENT);
    if (document.head.querySelector(`link[${LINK_ATTRIBUTE}]`)) {
      return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    // Relative on purpose: it resolves against <base href>, the same way the worker files do.
    link.href = 'maplibre-gl.css';
    link.setAttribute(LINK_ATTRIBUTE, '');
    document.head.appendChild(link);
  });
}
