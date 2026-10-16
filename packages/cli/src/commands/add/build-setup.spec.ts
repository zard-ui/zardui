jest.mock('@cli/utils/logger.js', () => ({
  logger: { debug: jest.fn(), info: jest.fn(), warn: jest.fn(), error: jest.fn() },
}));

import { setupBuild, type BuildItem, type BuildSetupContext } from '@cli/commands/add/build-setup.js';
import { logger } from '@cli/utils/logger.js';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import * as path from 'node:path';

const warn = logger.warn as jest.Mock;

const WORKER = { glob: 'maplibre-gl-worker.mjs', input: 'node_modules/maplibre-gl/dist', output: '/' };
const SHARED = { glob: 'maplibre-gl-shared.mjs', input: 'node_modules/maplibre-gl/dist', output: '/' };

let root: string;

function write(file: string, content: string): string {
  const target = path.join(root, file);
  mkdirSync(path.dirname(target), { recursive: true });
  writeFileSync(target, content);
  return target;
}

const read = (file: string) => readFileSync(path.join(root, file), 'utf8');

/** What `map` declares in the registry, installed to `<baseUrl>/shared/components/map`. */
function mapItem(baseUrl: string): BuildItem {
  return {
    name: 'map',
    dir: path.join(root, baseUrl, 'shared/components/map'),
    build: {
      styles: [{ import: 'maplibre-gl/dist/maplibre-gl.css' }, { file: 'map.css' }],
      assets: [WORKER, SHARED],
    },
  };
}

function context(overrides: Partial<BuildSetupContext> & Pick<BuildSetupContext, 'projectType' | 'baseUrl'>) {
  return {
    cwd: root,
    workspaceRoot: root,
    globalCss: path.join(root, 'src/styles.css'),
    projects: [{ name: 'demo', root: '', projectType: 'application' as const }],
    ...overrides,
  } satisfies BuildSetupContext;
}

/** MapLibre 6 as npm lays it out: the worker files sit in dist/. */
function installMaplibre(version: 5 | 6 = 6): void {
  write('node_modules/maplibre-gl/dist/maplibre-gl.css', '.maplibregl-map{}');
  write('node_modules/maplibre-gl/dist/maplibre-gl.js', '//');
  if (version === 6) {
    write('node_modules/maplibre-gl/dist/maplibre-gl-worker.mjs', '// worker v1');
    write('node_modules/maplibre-gl/dist/maplibre-gl-shared.mjs', '// shared v1');
  }
}

const ANGULAR_JSON = `{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "projects": {
    "demo": {
      "projectType": "application",
      "root": "",
      "architect": {
        "build": {
          "builder": "@angular/build:application",
          "options": {
            "polyfills": ["zone.js"],
            "assets": [
              {
                "glob": "**/*",
                "input": "public"
              }
            ],
            "styles": ["src/styles.css"]
          }
        }
      }
    }
  }
}
`;

const STYLES = `@import 'tailwindcss';\n@import './shared/core/css/zard.css';\n\nbody { margin: 0; }\n`;

beforeEach(() => {
  jest.clearAllMocks();
  root = mkdtempSync(path.join(tmpdir(), 'zard-build-'));
});

afterEach(() => rmSync(root, { recursive: true, force: true }));

describe('setupBuild — Angular CLI', () => {
  const ctx = () => context({ projectType: 'angular', baseUrl: 'src/app' });

  beforeEach(() => {
    installMaplibre();
    write('angular.json', ANGULAR_JSON);
    write('src/styles.css', STYLES);
  });

  it('imports MapLibre then map.css after the last @import, and registers both worker files', async () => {
    await setupBuild([mapItem('src/app')], ctx());

    expect(read('src/styles.css')).toBe(
      "@import 'tailwindcss';\n@import './shared/core/css/zard.css';\n" +
        "@import 'maplibre-gl/dist/maplibre-gl.css';\n" +
        "@import './app/shared/components/map/map.css';\n\nbody { margin: 0; }\n",
    );

    const assets = JSON.parse(read('angular.json')).projects.demo.architect.build.options.assets;
    expect(assets).toEqual([{ glob: '**/*', input: 'public' }, WORKER, SHARED]);
    expect(warn).not.toHaveBeenCalled();
  });

  it('changes only the assets array of angular.json', async () => {
    await setupBuild([mapItem('src/app')], ctx());

    expect(read('angular.json')).toContain('"polyfills": ["zone.js"]');
    expect(read('angular.json')).toContain('"styles": ["src/styles.css"]');
  });

  it('is idempotent: running again changes neither file', async () => {
    await setupBuild([mapItem('src/app')], ctx());
    const css = read('src/styles.css');
    const json = read('angular.json');

    await setupBuild([mapItem('src/app')], ctx());
    await setupBuild([mapItem('src/app')], ctx());

    expect(read('src/styles.css')).toBe(css);
    expect(read('angular.json')).toBe(json);
    expect(read('angular.json').match(/maplibre-gl-worker\.mjs/g)).toHaveLength(1);
    expect(read('src/styles.css').match(/map\.css/g)).toHaveLength(1);
  });

  it('adds only what is missing when one of the worker files is already registered', async () => {
    write(
      'angular.json',
      ANGULAR_JSON.replace(
        '"input": "public"\n              }',
        `"input": "public"\n              },\n              ${JSON.stringify(WORKER)}`,
      ),
    );

    await setupBuild([mapItem('src/app')], ctx());

    const assets = JSON.parse(read('angular.json')).projects.demo.architect.build.options.assets;
    expect(assets.filter((asset: { glob: string }) => asset.glob === WORKER.glob)).toHaveLength(1);
    expect(assets.filter((asset: { glob: string }) => asset.glob === SHARED.glob)).toHaveLength(1);
  });

  it('puts MapLibre before map.css even when only map.css was imported already', async () => {
    write('src/styles.css', `${STYLES.replace('\nbody', "@import './app/shared/components/map/map.css';\n\nbody")}`);

    await setupBuild([mapItem('src/app')], ctx());

    const css = read('src/styles.css');
    expect(css.indexOf('maplibre-gl.css')).toBeLessThan(css.indexOf('map.css'));
    expect(css.match(/map\.css/g)).toHaveLength(1);
  });

  it('ignores an import that only looks like ours, in a comment', async () => {
    write('src/styles.css', `/* @import 'maplibre-gl/dist/maplibre-gl.css'; */\n${STYLES}`);

    await setupBuild([mapItem('src/app')], ctx());

    expect(read('src/styles.css').match(/^@import 'maplibre-gl/gm)).toHaveLength(1);
  });

  it('keeps CRLF files in CRLF', async () => {
    write('src/styles.css', STYLES.replace(/\n/g, '\r\n'));
    write('angular.json', ANGULAR_JSON.replace(/\n/g, '\r\n'));

    await setupBuild([mapItem('src/app')], ctx());

    expect(read('src/styles.css').replace(/\r\n/g, '')).not.toContain('\n');
    expect(read('angular.json').replace(/\r\n/g, '')).not.toContain('\n');
  });

  it('skips the worker files a MapLibre 5 install does not have', async () => {
    rmSync(path.join(root, 'node_modules'), { recursive: true });
    installMaplibre(5);

    await setupBuild([mapItem('src/app')], ctx());

    expect(read('angular.json')).toBe(ANGULAR_JSON);
    expect(read('src/styles.css')).toContain("@import 'maplibre-gl/dist/maplibre-gl.css';");
  });

  it('prints the exact snippet when angular.json cannot be parsed, and leaves the file alone', async () => {
    write('angular.json', '{ "projects": { oops');

    await setupBuild([mapItem('src/app')], ctx());

    expect(read('angular.json')).toBe('{ "projects": { oops');
    const message = warn.mock.calls.map(call => call[0]).join('\n');
    expect(message).toContain('Could not parse angular.json');
    expect(message).toContain(JSON.stringify(WORKER));
    expect(message).toContain(JSON.stringify(SHARED));
  });

  it('prints the snippet when the build target has no options to add to', async () => {
    write('angular.json', '{ "projects": { "demo": { "architect": { "build": { "builder": "x" } } } } }');

    await setupBuild([mapItem('src/app')], ctx());

    expect(warn.mock.calls.map(call => call[0]).join('\n')).toContain(JSON.stringify(WORKER));
  });

  it('prints the lines to paste when the stylesheet has no @import to anchor to', async () => {
    write('src/styles.css', 'body { margin: 0; }\n');

    await setupBuild([mapItem('src/app')], ctx());

    expect(read('src/styles.css')).toBe('body { margin: 0; }\n');
    const message = warn.mock.calls.map(call => call[0]).join('\n');
    expect(message).toContain("@import 'maplibre-gl/dist/maplibre-gl.css';");
    expect(message).toContain("@import './app/shared/components/map/map.css';");
  });

  it('prints the lines to paste when the stylesheet is missing', async () => {
    rmSync(path.join(root, 'src/styles.css'));

    await setupBuild([mapItem('src/app')], ctx());

    expect(warn.mock.calls.map(call => call[0]).join('\n')).toContain("@import 'maplibre-gl/dist/maplibre-gl.css';");
    expect(existsSync(path.join(root, 'src/styles.css'))).toBe(false);
  });

  it('registers the assets even when MapLibre is not installed yet, since the build is what will look', async () => {
    rmSync(path.join(root, 'node_modules'), { recursive: true });

    await setupBuild([mapItem('src/app')], ctx());

    expect(read('angular.json')).toContain('maplibre-gl-worker.mjs');
  });
});

describe('setupBuild — Nx', () => {
  const ctx = () =>
    context({
      projectType: 'nx',
      baseUrl: 'apps/web/src/app',
      globalCss: path.join(root, 'apps/web/src/styles.css'),
      projects: [{ name: 'web', root: 'apps/web', projectType: 'application' }],
    });

  beforeEach(() => {
    installMaplibre();
    write('nx.json', '{}');
    write('apps/web/src/styles.css', STYLES);
    write(
      'apps/web/project.json',
      JSON.stringify(
        {
          name: 'web',
          targets: { build: { executor: '@angular/build:application', options: { assets: ['apps/web/public'] } } },
        },
        null,
        2,
      ),
    );
  });

  it("registers the assets in the project's own project.json", async () => {
    await setupBuild([mapItem('apps/web/src/app')], ctx());

    const project = JSON.parse(read('apps/web/project.json'));
    expect(project.targets.build.options.assets).toEqual(['apps/web/public', WORKER, SHARED]);
    expect(read('apps/web/src/styles.css')).toContain("@import './app/shared/components/map/map.css';");
  });

  it('is idempotent', async () => {
    await setupBuild([mapItem('apps/web/src/app')], ctx());
    const json = read('apps/web/project.json');

    await setupBuild([mapItem('apps/web/src/app')], ctx());

    expect(read('apps/web/project.json')).toBe(json);
  });

  it('prints the snippet when the project has no project.json', async () => {
    rmSync(path.join(root, 'apps/web/project.json'));

    await setupBuild([mapItem('apps/web/src/app')], ctx());

    expect(warn.mock.calls.map(call => call[0]).join('\n')).toContain('apps/web/project.json not found');
  });
});

describe('setupBuild — Analog', () => {
  const ctx = () => context({ projectType: 'analog', baseUrl: 'src/app' });

  beforeEach(() => {
    installMaplibre();
    write('src/styles.css', STYLES);
    write('vite.config.ts', 'export default defineConfig({ plugins: [analog()] });\n');
  });

  it("copies the worker files into Vite's public directory and wires the stylesheet", async () => {
    await setupBuild([mapItem('src/app')], ctx());

    expect(read('public/maplibre-gl-worker.mjs')).toBe('// worker v1');
    expect(read('public/maplibre-gl-shared.mjs')).toBe('// shared v1');
    expect(read('src/styles.css')).toContain("@import 'maplibre-gl/dist/maplibre-gl.css';");
  });

  it('leaves the copies alone when they are current, and refreshes them when MapLibre moved on', async () => {
    await setupBuild([mapItem('src/app')], ctx());
    const info = logger.info as jest.Mock;

    info.mockClear();
    await setupBuild([mapItem('src/app')], ctx());
    expect(info.mock.calls.map(call => call[0]).join('\n')).toContain('already in public/');

    write('node_modules/maplibre-gl/dist/maplibre-gl-worker.mjs', '// worker v2');
    await setupBuild([mapItem('src/app')], ctx());
    expect(read('public/maplibre-gl-worker.mjs')).toBe('// worker v2');
  });

  it('honours a publicDir declared in the Vite config', async () => {
    write('vite.config.ts', "export default defineConfig({ publicDir: 'static', plugins: [analog()] });\n");

    await setupBuild([mapItem('src/app')], ctx());

    expect(existsSync(path.join(root, 'static/maplibre-gl-worker.mjs'))).toBe(true);
    expect(existsSync(path.join(root, 'public'))).toBe(false);
  });

  it('prints what to copy when the config turns the public directory off', async () => {
    write('vite.config.ts', 'export default defineConfig({ publicDir: false, plugins: [analog()] });\n');

    await setupBuild([mapItem('src/app')], ctx());

    expect(existsSync(path.join(root, 'public'))).toBe(false);
    expect(warn.mock.calls.map(call => call[0]).join('\n')).toContain(
      'node_modules/maplibre-gl/dist/maplibre-gl-worker.mjs',
    );
  });

  it('writes into the project directory of an Nx Analog app, not the workspace root', async () => {
    write('apps/site/vite.config.ts', 'export default defineConfig({ plugins: [analog()] });\n');
    write('apps/site/src/styles.css', STYLES);

    await setupBuild(
      [mapItem('apps/site/src/app')],
      context({
        projectType: 'analog',
        baseUrl: 'apps/site/src/app',
        globalCss: path.join(root, 'apps/site/src/styles.css'),
      }),
    );

    expect(existsSync(path.join(root, 'apps/site/public/maplibre-gl-worker.mjs'))).toBe(true);
  });
});

describe.each(['angular-library', 'nx-library'] as const)('setupBuild — %s', projectType => {
  it('edits nothing and prints the steps for the consuming application', async () => {
    installMaplibre();
    write('angular.json', ANGULAR_JSON);
    write('projects/ui/src/styles.css', STYLES);

    await setupBuild(
      [mapItem('projects/ui/src/lib')],
      context({
        projectType,
        baseUrl: 'projects/ui/src/lib',
        globalCss: path.join(root, 'projects/ui/src/styles.css'),
      }),
    );

    expect(read('angular.json')).toBe(ANGULAR_JSON);
    expect(read('projects/ui/src/styles.css')).toBe(STYLES);
    expect(existsSync(path.join(root, 'public'))).toBe(false);

    const message = warn.mock.calls.map(call => call[0]).join('\n');
    expect(message).toContain("@import 'maplibre-gl/dist/maplibre-gl.css';");
    expect(message).toContain('projects/ui/src/lib/shared/components/map/map.css');
    expect(message).toContain(JSON.stringify(WORKER));
    expect(message).toContain('public directory');
  });
});

describe('setupBuild — nothing to do', () => {
  it('does not touch the project when no item declares a build requirement', async () => {
    write('angular.json', ANGULAR_JSON);

    await setupBuild([], context({ projectType: 'angular', baseUrl: 'src/app' }));

    expect(read('angular.json')).toBe(ANGULAR_JSON);
    expect(warn).not.toHaveBeenCalled();
  });
});
