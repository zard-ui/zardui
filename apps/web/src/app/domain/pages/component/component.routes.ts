import { Routes } from '@angular/router';
import { DEFAULT_COMPONENT } from '@zard/shared/constants/routes.constant';

export const COMPONENTS_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: DEFAULT_COMPONENT,
  },
  {
    path: ':componentName',
    loadComponent: () => import('./component.page').then(m => m.ComponentPage),
  },
];
