import { inject, type Provider, type Signal } from '@angular/core';

import { type MapLabels, type MapStylesConfig, provideMapLabels, provideMapStyles } from 'ng-mapcn';

import { ZARD_MAP_STYLE_CONFIG, ZardMapStyleService, type ZardMapStyleConfig } from './map-style.service';

type ZardMapSource<T> = T | Signal<T | undefined> | (() => Signal<T | undefined>);

export interface ZardMapConfig extends ZardMapStyleConfig {
  /**
   * A fixed basemap for every `<ng-map>`, one style per theme. A missing theme keeps the Carto default. Pass a signal
   * (or a factory returning one) to swap the basemap yourself. When it is set, `ZardMapStyleService` and
   * `<z-map-style-select>` no longer drive the maps: use `style` / `persist` for the shipped picker instead.
   * A map with its own `[styles]` ignores this.
   */
  styles?: ZardMapSource<MapStylesConfig>;
  /** Translations for the control tooltips, the loader and the popup close button. Missing keys stay English. */
  labels?: ZardMapSource<Partial<MapLabels>>;
}

/**
 * Registers the map defaults. Returns plain providers, so it fits a route's `providers`, a component's `providers` or
 * `app.config.ts`.
 *
 * Register it where the maps live, in the `providers` of the lazy route (or component) that renders them. ng-mapcn is
 * not tree-shakeable: importing it from `app.config.ts` puts the engine and MapLibre (about 1 MB) in the initial
 * bundle of every route. Without overrides it is optional, since ng-mapcn's own defaults are the same Carto pair.
 *
 * The basemap is driven by `ZardMapStyleService`, so `<z-map-style-select>` (or `service.select(id)`) changes every
 * map live. `style` picks the preset to start with, `keys` gives the key-based presets their API keys and `persist`
 * remembers the choice in the browser.
 *
 * The theme is not configured here: `<ng-map>` follows the `dark` class on `<html>`, which `ZardDarkMode`
 * toggles, so the basemap and the chrome switch together.
 */
export function provideZardMap(config: ZardMapConfig = {}): Provider[] {
  const { styles, labels, ...styleConfig } = config;

  return [
    { provide: ZARD_MAP_STYLE_CONFIG, useValue: styleConfig },
    provideMapStyles(
      styles ??
        (() => {
          const service = inject(ZardMapStyleService);
          service.configure(inject(ZARD_MAP_STYLE_CONFIG));
          return service.styles;
        }),
    ),
    ...(labels ? [provideMapLabels(labels)] : []),
  ];
}
