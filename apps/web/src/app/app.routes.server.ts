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
  // NOTE: llms.txt is intentionally NOT declared here. It is not an Angular route —
  // it is served as a raw static file (public/llms.txt) and by the Express handler in
  // server.ts. It is kept out of prerendering by update-routes.mjs (which skips
  // `external: true` nav items) plus `prerender.discoverRoutes: false`. Declaring it as a
  // ServerRoute breaks dev/SSR route extraction because it matches no `provideRouter` route.
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
