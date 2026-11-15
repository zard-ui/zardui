import { Route } from '@angular/router';

import { provideMapLibreStyles } from '@doc/shared/utils/maplibre-styles';

import { provideZardMap } from '@zard/components/map/map.provider';

/**
 * `/maps` and `/maps/<category>`. The map providers live here, on the lazy route, and not in `app.config.ts`: ng-mapcn
 * is not tree-shakeable, so registering it app-wide would put all of MapLibre in the initial bundle of every page.
 * `persist` keeps the basemap choice between this gallery and the map docs page.
 */
export const MAPS_ROUTES: Route[] = [
  {
    path: '',
    providers: [provideMapLibreStyles(), provideZardMap({ persist: true })],
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./maps.page').then(m => m.MapsPage),
      },
      {
        path: ':category',
        loadComponent: () => import('./maps.page').then(m => m.MapsPage),
      },
    ],
  },
];
