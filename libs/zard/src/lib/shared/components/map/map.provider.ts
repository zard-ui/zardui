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
 * Registers the map defaults, driven by `ZardMapStyleService` so `<z-map-style-select>` changes every map live.
 *
 * ng-mapcn is not tree-shakeable: import this from a routes file loaded with `loadChildren` (or from the map's own
 * component), never from `app.config.ts` or an eager `app.routes.ts`, or MapLibre (about 1 MB) lands in the initial
 * bundle. The theme follows the `dark` class on `<html>`.
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
