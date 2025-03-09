import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'components', loadComponent: () => import('./pages/components/components.page').then(m => m.ComponentsPage) },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
