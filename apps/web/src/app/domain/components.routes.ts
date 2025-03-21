import { DEFAULT_COMPONENT } from '@zard/shared/constants/routes.contant';
import { Routes } from '@angular/router';

export const COMPONENTS_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: DEFAULT_COMPONENT,
  },
  {
    path: ':componentName',
    loadComponent: () => import('./pages/dynamic/dynamic.component').then(m => m.DynamicComponent),
  },
];
