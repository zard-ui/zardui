import { Routes } from '@angular/router';

/**
 * The utilities have no index page — the sidebar section lists them directly, so
 * `/docs/utils` is only ever an address someone types, not one the site links to.
 * It lands on the first utility instead of dead-ending.
 */
export const UTILS_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'scroll-fade' },
  {
    path: 'scroll-fade',
    loadComponent: () => import('./scroll-fade/scroll-fade.page').then(m => m.ScrollFadePage),
  },
  {
    path: 'shimmer',
    loadComponent: () => import('./shimmer/shimmer.page').then(m => m.ShimmerPage),
  },
  { path: '**', redirectTo: 'scroll-fade' },
];
