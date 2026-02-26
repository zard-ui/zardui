import { Route } from '@angular/router';

export const EXAMPLES_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () => import('./examples.page').then(c => c.ExamplesPage),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard-example.page').then(c => c.DashboardExamplePage),
      },
      {
        path: 'tasks',
        loadComponent: () => import('./tasks/tasks-example.page').then(c => c.TasksExamplePage),
      },
      {
        path: 'playground',
        loadComponent: () => import('./playground/playground-example.page').then(c => c.PlaygroundExamplePage),
      },
      {
        path: 'authentication',
        loadComponent: () =>
          import('./authentication/authentication-example.page').then(c => c.AuthenticationExamplePage),
      },
    ],
  },
];
