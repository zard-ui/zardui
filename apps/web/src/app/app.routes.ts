import { Route } from '@angular/router';

import { ShellLayout } from './core/layouts/shell/shell.layout';

export const appRoutes: Route[] = [
  {
    path: '',
    component: ShellLayout,
    children: [
      { path: '', loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage) },
      {
        path: 'components',
        loadChildren: async () => (await import('./domain/pages/component/component.routes')).COMPONENTS_ROUTES,
      },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];
