import { Routes } from '@angular/router';
import { DEFAULT_DOC } from '@zard/shared/constants/routes.constant';

export const DOC_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: DEFAULT_DOC,
  },
  {
    path: ':docName',
    loadComponent: () => import('./doc.page').then(m => m.DocPage),
  },
];
