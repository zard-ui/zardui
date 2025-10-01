import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'docs/introduction',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'docs/installation',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'docs/installation/angular',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'docs/installation/manual',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'docs/components-json',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'docs/theming',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'docs/dark-mode',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'docs/cli',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'docs/about',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'docs/figma',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'docs/changelog',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'docs/components/**',
    renderMode: RenderMode.Prerender,
  },
  {
    path: '**',
    renderMode: RenderMode.Server,
  },
];
