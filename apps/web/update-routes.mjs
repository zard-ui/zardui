#!/usr/bin/env node
import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const routesFile = join(__dirname, 'src/app/shared/constants/routes.constant.ts');
const content = readFileSync(routesFile, 'utf-8');
// Collect `path: '...'` of every `available: true` item, but skip those flagged `external: true`
// (e.g. llms.txt): those are raw static files/external links, not prerenderable Angular routes.
// Prerendering them would create a directory that collides with the static asset (EEXIST).
const routes = [...content.matchAll(/path:\s*'([^']+)',\s*available:\s*true(?![^}]*external:\s*true)/g)].map(m => m[1]);

// Installation environment sub-pages (e.g. /docs/installation/angular) live in a
// separate file and list `icon` between `path` and `available`, so they need
// their own pass. Only prerender the `available: true` ones.
const envFile = join(__dirname, 'src/app/domain/pages/environments/environments.page.ts');
const envContent = readFileSync(envFile, 'utf-8');
const envRoutes = [...envContent.matchAll(/path:\s*'(\/docs\/installation\/[^']+)'[^}]*?available:\s*true/g)].map(
  m => m[1],
);

// Every map category is a page of its own (/maps/logistics, ...). The first one is /maps itself, already listed above.
// The ids are read from MAP_CATEGORIES so a new category is prerendered without touching this file.
const mapsFile = join(__dirname, 'src/app/domain/services/maps.service.ts');
const mapsContent = readFileSync(mapsFile, 'utf-8');
const categoriesBlock = mapsContent.match(/MAP_CATEGORIES[^=]*=\s*\[([\s\S]*?)\n\];/)?.[1] ?? '';
const mapRoutes = [...categoriesBlock.matchAll(/id:\s*'([^']+)'/g)].slice(1).map(m => `/maps/${m[1]}`);

// Every changelog entry has a page of its own (/docs/changelog/<slug>), the link the RSS feed points to.
// The slugs are read from the entry files so a new entry is prerendered without touching this file.
const changelogDir = join(__dirname, 'src/app/domain/pages/change-log/entries');
const changelogRoutes = readdirSync(changelogDir, { recursive: true })
  .filter(file => /\d{4}[\\/][a-z0-9-]+\.ts$/.test(file) && !file.endsWith('.examples.ts'))
  .flatMap(file => [...readFileSync(join(changelogDir, file), 'utf-8').matchAll(/slug:\s*'([^']+)'/g)])
  .map(m => `/docs/changelog/${m[1]}`)
  .sort();

writeFileSync(
  join(__dirname, 'prerender-routes.txt'),
  ['/', ...routes, ...mapRoutes, ...envRoutes, ...changelogRoutes].join('\n'),
);
