import { Route } from '@angular/router';

export const CREATE_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () => import('./create.page').then(c => c.CreatePage),
  },
];
