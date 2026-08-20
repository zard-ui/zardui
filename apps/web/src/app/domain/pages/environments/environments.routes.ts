import { Routes } from '@angular/router';

export const ENVIRONMENTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./environments.page').then(m => m.EnvironmentsPage),
  },
  {
    path: ':envName',
    loadChildren: () => import('../install/install.routes').then(m => m.INSTALL_ROUTES),
  },
];
