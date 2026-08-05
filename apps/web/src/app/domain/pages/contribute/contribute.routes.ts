import { Routes } from '@angular/router';

export const CONTRIBUTE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./overview/overview.page').then(m => m.ContributeOverviewPage),
  },
  {
    path: 'setup',
    loadComponent: () => import('./setup/setup.page').then(m => m.ContributeSetupPage),
  },
  {
    path: 'architecture',
    loadComponent: () => import('./architecture/architecture.page').then(m => m.ContributeArchitecturePage),
  },
  {
    path: 'project-structure',
    loadComponent: () =>
      import('./project-structure/project-structure.page').then(m => m.ContributeProjectStructurePage),
  },
  {
    path: 'components',
    loadComponent: () => import('./components/components.page').then(m => m.ContributeComponentsPage),
  },
  {
    path: 'blocks',
    loadComponent: () => import('./blocks/blocks.page').then(m => m.ContributeBlocksPage),
  },
  {
    path: 'documentation',
    loadComponent: () => import('./documentation/documentation.page').then(m => m.ContributeDocumentationPage),
  },
  {
    path: 'testing',
    loadComponent: () => import('./testing/testing.page').then(m => m.ContributeTestingPage),
  },
  {
    path: 'workflow',
    loadComponent: () => import('./workflow/workflow.page').then(m => m.ContributeWorkflowPage),
  },
  {
    path: 'release',
    loadComponent: () => import('./release/release.page').then(m => m.ContributeReleasePage),
  },
  {
    path: 'faq',
    loadComponent: () => import('./faq/faq.page').then(m => m.ContributeFaqPage),
  },
];
