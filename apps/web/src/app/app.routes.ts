import { Route } from '@angular/router';

import { DocumentationLayout } from './core/layouts/documentation/documentation.layout';
import { DEFAULT_DOC } from './shared/constants/routes.constant';
import { ShellLayout } from './core/layouts/shell/shell.layout';

export const appRoutes: Route[] = [
  {
    path: '',
    component: ShellLayout,
    children: [{ path: '', loadComponent: () => import('./domain/pages/home/home.page').then(m => m.HomePage) }],
  },
  {
    path: 'blocks',
    component: ShellLayout,
    children: [
      {
        path: '',
        loadChildren: async () => (await import('./domain/pages/blocks/blocks.routes')).BLOCKS_ROUTES,
      },
    ],
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
        path: 'installation',
        loadChildren: async () => (await import('./domain/pages/enviroments/enviroments.routes')).ENVIRONMENTS_ROUTES,
      },
      {
        path: 'components-json',
        loadComponent: () => import('./domain/pages/json/json.page').then(m => m.JsonPage),
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
        path: 'cli',
        loadComponent: () => import('./domain/pages/cli/cli.page').then(m => m.CliPage),
      },
      {
        path: 'components',
        loadChildren: async () => (await import('./domain/pages/component/component.routes')).COMPONENTS_ROUTES,
      },
      {
        path: 'about',
        loadComponent: async () => import('./domain/pages/about/about.page').then(m => m.AboutPage),
      },
      {
        path: 'figma',
        loadComponent: async () => import('./domain/pages/figma/figma.page').then(m => m.FigmaPage),
      },
      {
        path: 'changelog',
        loadComponent: async () => import('./domain/pages/change-log/change-log.page').then(m => m.ChangeLogPage),
      },
    ],
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
