import type { Routes } from '@angular/router';

export const ENVIRONMENTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./enviroments.page').then(m => m.EnviromentsPage),
  },
  {
    path: ':envName',
    loadChildren: () => import('../install/install.routes').then(m => m.INSTALL_ROUTES),
  },
];
