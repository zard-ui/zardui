#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const routesFile = join(__dirname, 'src/app/shared/constants/routes.constant.ts');
const content = readFileSync(routesFile, 'utf-8');
// Collect `path: '...'` of every `available: true` item, but skip those flagged `external: true`
// (e.g. llms.txt): those are raw static files/external links, not prerenderable Angular routes.
// Prerendering them would create a directory that collides with the static asset (EEXIST).
const routes = [...content.matchAll(/path:\s*'([^']+)',\s*available:\s*true(?![^}]*external:\s*true)/g)].map(m => m[1]);

writeFileSync(join(__dirname, 'prerender-routes.txt'), ['/', ...routes].join('\n'));
