import { Routes } from '@angular/router';

export const INSTALL_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./install.page').then(m => m.InstallPage),
  },
];
