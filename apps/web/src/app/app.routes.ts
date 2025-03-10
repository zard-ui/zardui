import { Route } from '@angular/router';

import { ShellLayout } from './core/layouts/shell/shell.layout';

export const appRoutes: Route[] = [
  { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  {
    path: '',
    component: ShellLayout,
    children: [
      { path: 'components', loadChildren: async () => (await import('./domain/components/components.routes')).COMPONENTS_ROUTES },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];
