import { Routes } from '@angular/router';

export const FEATURED_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'youtube',
  },
  {
    path: 'youtube',
    loadComponent: () => import('./youtube/youtube.page').then(c => c.YoutubePage),
  },
  {
    path: 'articles',
    loadComponent: () => import('./articles/articles.page').then(c => c.ArticlesPage),
  },
];
