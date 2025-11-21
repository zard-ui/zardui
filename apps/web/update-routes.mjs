#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const routesFile = join(__dirname, 'src/app/shared/constants/routes.constant.ts');
const content = readFileSync(routesFile, 'utf-8');
const routes = [...content.matchAll(/path:\s*'([^']+)',\s*available:\s*true/g)]
  .filter(m => m[1] !== '/llms.txt')
  .map(m => m[1]);

writeFileSync(join(__dirname, 'prerender-routes.txt'), ['/', ...routes].join('\n'));
