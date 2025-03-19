import { Routes } from '@angular/router';

export const COMPONENTS_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'badge',
  },
  {
    path: ':componentName',
    loadComponent: () => import('./pages/dynamic/dynamic.component').then(m => m.DynamicComponent),
  },
];
