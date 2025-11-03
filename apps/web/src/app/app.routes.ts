import { Route } from '@angular/router';

import { DocumentationLayout } from './core/layouts/documentation/documentation.layout';
import { ShellLayout } from './core/layouts/shell/shell.layout';
import { DEFAULT_DOC } from './shared/constants/routes.constant';

export const appRoutes: Route[] = [
  {
    path: '',
    component: ShellLayout,
    children: [{ path: '', loadComponent: () => import('./domain/pages/home/home.page').then(c => c.HomePage) }],
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
  // {
  //   path: 'colors',
  //   component: ShellLayout,
  //   children: [
  //     {
  //       path: '',
  //       loadComponent: () => import('./domain/pages/colors/colors.page').then(c => c.ColorsPage),
  //     },
  //   ],
  // },
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
        loadComponent: () => import('./domain/pages/introduction/introduction.page').then(c => c.IntroductionPage),
      },
      {
        path: 'installation',
        loadChildren: async () => (await import('./domain/pages/enviroments/enviroments.routes')).ENVIRONMENTS_ROUTES,
      },
      {
        path: 'components-json',
        loadComponent: () => import('./domain/pages/json/json.page').then(c => c.JsonPage),
      },
      {
        path: 'theming',
        loadComponent: () => import('./domain/pages/theming/theming.page').then(c => c.ThemingPage),
      },
      {
        path: 'blocks',
        loadComponent: () => import('./domain/pages/blocks/block-instructions/block-instructions.page').then(c => c.BlocksInstructionPage),
      },
      {
        path: 'dark-mode',
        loadComponent: () => import('./domain/pages/dark-mode/dark-mode.page').then(c => c.DarkmodePage),
      },
      {
        path: 'cli',
        loadComponent: () => import('./domain/pages/cli/cli.page').then(c => c.CliPage),
      },
      {
        path: 'components',
        loadChildren: async () => (await import('./domain/pages/component/component.routes')).COMPONENTS_ROUTES,
      },
      {
        path: 'about',
        loadComponent: async () => import('./domain/pages/about/about.page').then(c => c.AboutPage),
      },
      {
        path: 'figma',
        loadComponent: async () => import('./domain/pages/figma/figma.page').then(c => c.FigmaPage),
      },
      {
        path: 'roadmap',
        loadComponent: async () => import('./domain/pages/roadmap/roadmap.page').then(c => c.RoadmapPage),
      },
      {
        path: 'pre-processors',
        loadComponent: async () => import('./domain/pages/pre-processors/pre-processors.page').then(c => c.PreProcessorsPage),
      },
      {
        path: 'changelog',
        loadComponent: async () => import('./domain/pages/change-log/change-log.page').then(c => c.ChangeLogPage),
      },
    ],
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
