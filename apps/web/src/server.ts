import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine, isMainModule } from '@angular/ssr/node';

import express from 'express';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import xmlbuilder from 'xmlbuilder';

import { HEADER_PATHS, SIDEBAR_PATHS } from './app/shared/constants/routes.constant';
import bootstrap from './main.server';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');
const indexHtml = join(serverDistFolder, 'index.server.html');

const app = express();
const commonEngine = new CommonEngine();

function getAvailableRoutes(): Array<{ path: string; priority: number; changefreq: string }> {
  const routes: Array<{ path: string; priority: number; changefreq: string }> = [];

  routes.push({ path: '/', priority: 1.0, changefreq: 'weekly' });

  HEADER_PATHS.filter(item => item.available).forEach(item => {
    routes.push({
      path: item.path,
      priority: 0.9,
      changefreq: 'weekly',
    });
  });

  SIDEBAR_PATHS.forEach(section => {
    section.data
      .filter(item => item.available)
      .forEach(item => {
        const priority = item.path.includes('/components/') ? 0.8 : 0.7;
        const changefreq = item.path.includes('/components/') ? 'monthly' : 'weekly';

        routes.push({
          path: item.path,
          priority,
          changefreq,
        });
      });
  });

  return routes.filter((route, index, self) => index === self.findIndex(r => r.path === route.path));
}

app.get('/sitemap.xml', (req, res) => {
  const urlWebsite = `https://zardui.com`;

  const root = xmlbuilder.create('urlset', { version: '1.0', encoding: 'UTF-8' });
  root.att('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9');

  const routes = getAvailableRoutes();
  const today = new Date().toISOString().split('T')[0];

  routes.forEach(route => {
    const url = root.ele('url');
    url.ele('loc', `${urlWebsite}${route.path}`);
    url.ele('lastmod', today);
    url.ele('changefreq', route.changefreq);
    url.ele('priority', route.priority);
  });

  res.header('Content-Type', 'application/xml');
  res.send(root.end({ pretty: true }));
});

app.use((req, res, next) => {
  if (req.path === '/sitemap.xml') {
    return next();
  }
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: 'index.html',
  })(req, res, next);
});

app.get('**', (req, res, next) => {
  const { protocol, originalUrl, baseUrl, headers } = req;

  commonEngine
    .render({
      bootstrap,
      documentFilePath: indexHtml,
      url: `${protocol}://${headers.host}${originalUrl}`,
      publicPath: browserDistFolder,
      providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
    })
    .then(html => res.send(html))
    .catch(err => next(err));
});

// Export the Express app for Firebase App Hosting / Cloud Run
export default app;

// Start server when running locally
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}
