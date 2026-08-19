import { Routes } from '@angular/router';

export const UTILS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./utils.page').then(m => m.UtilsPage),
  },
  {
    path: 'scroll-fade',
    loadComponent: () => import('./scroll-fade/scroll-fade.page').then(m => m.ScrollFadePage),
  },
  {
    path: 'shimmer',
    loadComponent: () => import('./shimmer/shimmer.page').then(m => m.ShimmerPage),
  },
  { path: '**', redirectTo: '' },
];
