import { Routes } from '@angular/router';

import { provideMapLibreStyles } from '@doc/shared/utils/maplibre-styles';

import { provideZardMap } from '@zard/components/map/map.provider';

/**
 * The map docs pages: the shared component page, with the map providers registered on these routes only. This file is
 * the only place that pulls ng-mapcn, and it is lazy, so no other route pays for MapLibre.
 */
const mapDocsRoutes = (componentName: string): Routes => [
  {
    path: '',
    providers: [provideMapLibreStyles(), provideZardMap({ persist: true })],
    data: { componentName },
    loadComponent: () => import('./component.page').then(m => m.ComponentPage),
  },
];

export const MAP_DOCS_ROUTES = mapDocsRoutes('map');
export const MAP_DRAW_DOCS_ROUTES = mapDocsRoutes('map-draw');
export const MAP_STYLE_SELECT_DOCS_ROUTES = mapDocsRoutes('map-style-select');
