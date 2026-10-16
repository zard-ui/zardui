import { Routes } from '@angular/router';

export const COMPONENTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./components-list/components-list.page').then(c => c.ComponentsListPage),
  },
  {
    path: 'layout',
    pathMatch: 'full',
    redirectTo: 'sidebar',
  },
  {
    // The map pages have a lazy boundary of their own: ng-mapcn is not tree-shakeable, so everything that touches it
    // (the providers and the demos the page loads) stays out of the chunk the other components share.
    path: 'map',
    loadChildren: () => import('./map-docs.routes').then(m => m.MAP_DOCS_ROUTES),
  },
  {
    path: 'map-draw',
    loadChildren: () => import('./map-docs.routes').then(m => m.MAP_DRAW_DOCS_ROUTES),
  },
  {
    path: 'map-style-select',
    loadChildren: () => import('./map-docs.routes').then(m => m.MAP_STYLE_SELECT_DOCS_ROUTES),
  },
  {
    path: ':componentName',
    loadComponent: () => import('./component.page').then(m => m.ComponentPage),
  },
];
