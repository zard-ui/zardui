import { DEFAULT_DOC } from '@zard/shared/constants/routes.contant';
import { Routes } from '@angular/router';

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
