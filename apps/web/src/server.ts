import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine, isMainModule } from '@angular/ssr/node';

import express from 'express';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import xmlbuilder from 'xmlbuilder';

import {
  HEADER_PATHS,
  SIDEBAR_PATHS,
  SECTIONS,
  DOCS_PATH,
  COMPONENTS_PATH,
} from './app/shared/constants/routes.constant';
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

function generateLlmsTxt(): string {
  const baseUrl = 'https://zardui.com';
  const sections: string[] = [];

  sections.push('# Zard UI\n');
  sections.push(
    '> Zard UI is a collection of beautifully-designed, accessible Angular components built with TypeScript, TailwindCSS v4, and Class Variance Authority (CVA). Inspired by shadcn/ui, it provides a modern component library with signal-based inputs, OnPush change detection, and type-safe styling variants. Open Source. Open Code. AI-Ready.\n',
  );

  sections.push('## Overview\n');
  SECTIONS.data
    .filter(item => item.available)
    .forEach(item => {
      sections.push(`- [${item.name}](${baseUrl}${item.path}): ${getDescriptionForRoute(item.path)}`);
    });
  sections.push('');

  sections.push('## Get Started\n');
  DOCS_PATH.data
    .filter(item => item.available)
    .forEach(item => {
      sections.push(`- [${item.name}](${baseUrl}${item.path}): ${getDescriptionForRoute(item.path)}`);
    });
  sections.push('');

  sections.push('## Components\n');
  const componentsByCategory = categorizeComponents();

  Object.entries(componentsByCategory).forEach(([category, components]) => {
    sections.push(`### ${category}\n`);
    components.forEach(component => {
      sections.push(
        `- [${component.name}](${baseUrl}${component.path}): ${component.name} component for Angular applications.`,
      );
    });
    sections.push('');
  });

  return sections.join('\n');
}

function getDescriptionForRoute(path: string): string {
  const descriptions: Record<string, string> = {
    '/docs/introduction': 'Core principles, architecture overview, and getting started with Zard UI.',
    '/docs/components': 'Browse all available components in the Zard UI library.',
    '/docs/roadmap': 'Public roadmap showing our vision, current progress, and future goals.',
    '/docs/changelog': 'Release notes, version history, and updates.',
    '/docs/installation': 'Step-by-step guide to install Zard UI in your Angular project.',
    '/docs/components-json': 'Configuration file for customizing the CLI and component installation.',
    '/docs/theming': 'Guide to customizing colors, typography, and design tokens with TailwindCSS v4.',
    '/docs/pre-processors':
      'Understanding SCSS/Sass integration with Tailwind v4 - risks, limitations, and alternatives.',
    '/docs/dark-mode': 'Implementing dark mode in your Angular application.',
    '/docs/cli': 'Command-line tool for installing and managing Zard UI components.',
    '/docs/figma': 'Figma design resources and component library.',
    '/llms.txt': 'LLM-optimized documentation format for AI assistants.',
    '/docs/about': 'Credits, project information, and acknowledgments.',
  };

  return descriptions[path] || 'Documentation and guides for Zard UI.';
}

function categorizeComponents(): Record<string, Array<{ name: string; path: string }>> {
  const categories: Record<string, Array<{ name: string; path: string }>> = {
    'Form & Input': [],
    'Layout & Navigation': [],
    'Overlays & Dialogs': [],
    'Feedback & Status': [],
    'Display & Media': [],
    Misc: [],
  };

  COMPONENTS_PATH.data
    .filter(item => item.available)
    .forEach(item => {
      const component = { name: item.name, path: item.path };

      if (
        [
          'Button',
          'Input',
          'Checkbox',
          'Radio',
          'Select',
          'Switch',
          'Slider',
          'Calendar',
          'Date Picker',
          'Combobox',
          'Form',
          'Input Group',
        ].includes(item.name)
      ) {
        categories['Form & Input'].push(component);
      } else if (['Accordion', 'Breadcrumb', 'Menu', 'Tabs', 'Divider', 'Resizable'].includes(item.name)) {
        categories['Layout & Navigation'].push(component);
      } else if (['Dialog', 'Alert Dialog', 'Sheet', 'Popover', 'Tooltip', 'Dropdown', 'Command'].includes(item.name)) {
        categories['Overlays & Dialogs'].push(component);
      } else if (['Alert', 'Toast', 'Progress Bar', 'Loader', 'Skeleton', 'Badge', 'Empty'].includes(item.name)) {
        categories['Feedback & Status'].push(component);
      } else if (['Avatar', 'Card', 'Table', 'Icon'].includes(item.name)) {
        categories['Display & Media'].push(component);
      } else {
        categories['Misc'].push(component);
      }
    });

  Object.keys(categories).forEach(key => {
    if (categories[key].length === 0) {
      delete categories[key];
    }
  });

  return categories;
}

app.get('/llms.txt', (req, res) => {
  const content = generateLlmsTxt();
  res.header('Content-Type', 'text/plain; charset=utf-8');
  res.send(content);
});

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

app.use(
  '/r',
  express.static(join(browserDistFolder, 'r'), {
    maxAge: '1y',
    immutable: true,
    setHeaders: (res, path) => {
      if (path.endsWith('.json') && !path.endsWith('registry.json')) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      }
      if (path.endsWith('registry.json')) {
        res.setHeader('Cache-Control', 'public, max-age=3600, must-revalidate');
      }
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
    },
  }),
);

app.use((req, res, next) => {
  if (req.url === '/sitemap.xml' || req.url === '/llms.txt') {
    return next();
  }
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: 'index.html',
  })(req, res, next);
});

app.use((req, res, next) => {
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

export default app;

if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}
