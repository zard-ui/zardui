import { Route } from '@angular/router';

import { DocumentationLayout } from './core/layouts/documentation/documentation.layout';
import { ShellLayout } from './core/layouts/shell/shell.layout';
import { DEFAULT_DOC } from './shared/constants/routes.constant';

export const appRoutes: Route[] = [
  {
    path: '',
    component: ShellLayout,
    children: [
      {
        path: '',
        loadComponent: () => import('./domain/pages/home/home.page').then(c => c.HomePage),
      },
    ],
  },
  {
    path: 'blocks/preview/:id',
    loadComponent: () => import('./domain/pages/blocks/block-preview/block-preview.page').then(c => c.BlockPreviewPage),
  },
  {
    path: 'blocks',
    component: ShellLayout,
    children: [
      {
        path: '',
        loadChildren: () => import('./domain/pages/blocks/blocks.routes').then(m => m.BLOCKS_ROUTES),
      },
    ],
  },
  {
    path: 'charts',
    component: ShellLayout,
    children: [
      {
        path: '',
        loadChildren: () => import('./domain/pages/charts/charts.routes').then(m => m.CHARTS_ROUTES),
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
        loadComponent: () => import('./domain/pages/introduction/introduction.page').then(c => c.IntroductionPage),
      },
      {
        path: 'installation',
        loadChildren: () => import('./domain/pages/environments/environments.routes').then(m => m.ENVIRONMENTS_ROUTES),
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
        path: 'typeset',
        loadComponent: () => import('./domain/pages/typeset-docs/typeset-docs.page').then(c => c.TypesetDocsPage),
      },
      {
        path: 'forms',
        loadChildren: () => import('./domain/pages/forms/forms.routes').then(m => m.FORMS_ROUTES),
      },
      {
        path: 'utils',
        loadChildren: async () => (await import('./domain/pages/utils/utils.routes')).UTILS_ROUTES,
      },
      {
        path: 'dark-mode',
        loadComponent: () => import('./domain/pages/dark-mode/dark-mode.page').then(c => c.DarkModePage),
      },
      {
        path: 'cli',
        loadComponent: () => import('./domain/pages/cli/cli.page').then(c => c.CliPage),
      },
      {
        path: 'registry',
        loadComponent: () => import('./domain/pages/registry/registry.page').then(c => c.RegistryPage),
      },
      {
        path: 'mcp',
        loadComponent: () => import('./domain/pages/mcp/mcp.page').then(c => c.McpPage),
      },
      {
        path: 'monorepo',
        loadComponent: () => import('./domain/pages/monorepo/monorepo.page').then(c => c.MonorepoPage),
      },
      {
        path: 'skills',
        loadComponent: () => import('./domain/pages/skills/skills.page').then(c => c.SkillsPage),
      },
      {
        path: 'components',
        loadChildren: () => import('./domain/pages/component/component.routes').then(m => m.COMPONENTS_ROUTES),
      },
      {
        path: 'contribute',
        loadChildren: () => import('./domain/pages/contribute/contribute.routes').then(m => m.CONTRIBUTE_ROUTES),
      },
      {
        path: 'version-support',
        loadComponent: () =>
          import('./domain/pages/version-support/version-support.page').then(c => c.VersionSupportPage),
      },
      {
        path: 'about',
        loadComponent: () => import('./domain/pages/about/about.page').then(c => c.AboutPage),
      },
      {
        path: 'figma',
        loadComponent: () => import('./domain/pages/figma/figma.page').then(c => c.FigmaPage),
      },
      {
        path: 'roadmap',
        loadComponent: () => import('./domain/pages/roadmap/roadmap.page').then(c => c.RoadmapPage),
      },
      {
        path: 'pre-processors',
        loadComponent: async () =>
          import('./domain/pages/pre-processors/pre-processors.page').then(c => c.PreProcessorsPage),
      },
      {
        path: 'changelog',
        loadComponent: () => import('./domain/pages/change-log/change-log.page').then(c => c.ChangeLogPage),
      },
      {
        path: 'featured',
        loadChildren: () => import('./domain/pages/featured/featured.routes').then(m => m.FEATURED_ROUTES),
      },
    ],
  },
  {
    path: 'create',
    component: ShellLayout,
    children: [
      {
        path: '',
        loadChildren: async () => (await import('./domain/pages/create/create.routes')).CREATE_ROUTES,
      },
    ],
  },
  {
    path: 'themes',
    component: ShellLayout,
    children: [
      {
        path: '',
        loadComponent: () => import('./domain/pages/themes/themes.page').then(c => c.ThemesPage),
      },
    ],
  },
  {
    path: 'typeset/preview',
    loadComponent: () => import('./domain/pages/typeset/preview/typeset-preview.page').then(c => c.TypesetPreviewPage),
  },
  {
    path: 'typeset',
    component: ShellLayout,
    children: [
      {
        path: '',
        loadComponent: () => import('./domain/pages/typeset/typeset.page').then(c => c.TypesetPage),
      },
    ],
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
