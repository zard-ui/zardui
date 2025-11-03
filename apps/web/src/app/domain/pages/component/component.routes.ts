import { Routes } from '@angular/router';

export const COMPONENTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./components-list/components-list.page').then(c => c.ComponentsListPage),
  },
  {
    path: ':componentName',
    loadComponent: () => import('./component.page').then(m => m.ComponentPage),
  },
];
