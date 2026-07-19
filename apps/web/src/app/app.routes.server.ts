import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'docs/**',
    renderMode: RenderMode.Prerender,
  },
  {
    // Served as a raw static file (public/llms.txt) and by the Express handler in
    // server.ts. Must NOT be prerendered: doing so would try to create a
    // `browser/llms.txt` directory that collides with the static file (EEXIST).
    path: 'llms.txt',
    renderMode: RenderMode.Server,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
