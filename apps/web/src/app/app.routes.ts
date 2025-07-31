import { Route } from '@angular/router';

import { ShellLayout } from './core/layouts/shell/shell.layout';
import { DocumentationLayout } from './core/layouts/documentation/documentation.layout';
import { DEFAULT_DOC } from './shared/constants/routes.constant';

export const appRoutes: Route[] = [
  {
    path: '',
    component: ShellLayout,
    children: [{ path: '', loadComponent: () => import('./domain/pages/home/home.page').then(m => m.HomePage) }],
  },
  {
    path: 'docs',
    component: DocumentationLayout,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: DEFAULT_DOC,
      },
      {
        path: 'introduction',
        loadComponent: () => import('./domain/pages/introduction/introduction.page').then(m => m.IntroductionPage),
      },
      {
        path: 'theming',
        loadComponent: () => import('./domain/pages/theming/theming.page').then(m => m.ThemingPage),
      },
      {
        path: 'dark-mode',
        loadComponent: () => import('./domain/pages/dark-mode/dark-mode.page').then(m => m.DarkmodePage),
      },
      {
        path: 'installation',
        loadChildren: async () => (await import('./domain/pages/enviroments/enviroments.routes')).ENVIRONMENTS_ROUTES,
      },
      {
        path: 'components',
        loadChildren: async () => (await import('./domain/pages/component/component.routes')).COMPONENTS_ROUTES,
      },
    ],
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
