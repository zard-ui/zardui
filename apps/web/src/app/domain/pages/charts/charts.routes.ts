import { Route } from '@angular/router';

export const CHARTS_ROUTES: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./charts.page').then(m => m.ChartsPage),
  },
  {
    path: ':category',
    loadComponent: () => import('./charts.page').then(m => m.ChartsPage),
  },
];
