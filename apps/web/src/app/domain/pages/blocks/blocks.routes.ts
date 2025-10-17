import { Route } from '@angular/router';

export const BLOCKS_ROUTES: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./blocks.page').then(m => m.BlocksPage),
  },
  {
    path: ':category',
    loadComponent: () => import('./blocks.page').then(m => m.BlocksPage),
  },
];
