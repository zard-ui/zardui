import { Routes } from '@angular/router';

export const AI_ELEMENTS_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./overview/ai-elements-overview.page').then(m => m.AiElementsOverviewPage),
  },
  {
    path: ':pattern',
    loadComponent: () => import('./pattern/ai-element.page').then(m => m.AiElementPage),
  },
];
