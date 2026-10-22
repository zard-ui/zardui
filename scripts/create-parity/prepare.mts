/**
 * create-parity / prepare — turns a project made by `zard-cli create` (+ `add --all`) into a harness that renders the
 * very same canvases and component examples the `/create` preview shows.
 *
 *   npx tsx scripts/create-parity/prepare.mts <project-dir> [--no-build]
 *
 * What it does, in the project (never in the repo):
 *  - copies `apps/web/src/app/domain/pages/create/{canvas,examples,lib/preview-design.context.ts}` and the CLI's design
 *    module into `src/app/parity/`, pointing `@zard/*` imports at the project's own aliases (`components.json`);
 *  - runs the CLI's own `transformStyle` over them, so a marker written straight into an example template
 *    (`cn-empty-icon`...) becomes the same classes the installer would have written;
 *  - adds the `parity/:item` route, the `style-*` custom variants the canvas wrappers use, and `style-<id>` on `<body>`
 *    (only the wrappers read it: the components under test carry plain classes, as installed);
 *  - builds it (`ng build`), so `compare.mts` can serve `dist/<name>/browser`.
 *
 * The principle behind it: what `/create` shows equals what `create` / `init --preset` installs.
 */
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { LOCAL_STYLE_CATALOG, STYLE_IDS, transformStyle } from '../../packages/cli/src/core/styles/index.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const createDir = join(root, 'apps/web/src/app/domain/pages/create');
const designDir = join(root, 'packages/cli/src/core/design');

const args = process.argv.slice(2);
const projectArg = args.find(arg => !arg.startsWith('--'));
if (!projectArg) {
  console.error('usage: prepare.mts <project-dir> [--no-build]');
  process.exit(2);
}
const project = resolve(projectArg);
const components = JSON.parse(readFileSync(join(project, 'components.json'), 'utf8'));
const style: string = components.style;
const menu = { menuColor: components.menuColor, menuAppearance: components.menuAppearance };
const aliases: Record<string, string> = components.aliases;

const parity = join(project, 'src/app/parity');
rmSync(parity, { recursive: true, force: true });
mkdirSync(join(parity, 'lib'), { recursive: true });

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap(name => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

/** `@zard/...` in the repo is `@/shared/...` (or whatever `components.json` says) in the project. */
function retarget(source: string): string {
  return source
    .replaceAll(/'@zard\/components\//g, `'${aliases['components']}/`)
    .replaceAll(/'@zard\/utils\//g, `'${aliases['utils']}/`)
    .replaceAll(/'@zard\/services\//g, `'${aliases['services']}/`)
    .replaceAll(/'@zard\/design'/g, `'@/parity/design'`);
}

function copyTree(from: string, to: string): void {
  for (const file of walk(from)) {
    if (!file.endsWith('.ts') || file.endsWith('.spec.ts')) continue;
    const target = join(to, relative(from, file));
    mkdirSync(dirname(target), { recursive: true });
    const source = retarget(readFileSync(file, 'utf8'));
    writeFileSync(target, transformStyle(source, style as never, LOCAL_STYLE_CATALOG, menu as never));
  }
}

copyTree(join(createDir, 'canvas'), join(parity, 'canvas'));
copyTree(join(createDir, 'examples'), join(parity, 'examples'));
copyTree(designDir, join(parity, 'design'));
writeFileSync(
  join(parity, 'lib/preview-design.context.ts'),
  retarget(readFileSync(join(createDir, 'lib/preview-design.context.ts'), 'utf8')),
);

// The loader table: shadcn's example name → the class, read from the same registry /create uses.
const examplesSource = readFileSync(join(createDir, 'lib/create-examples.ts'), 'utf8');
const loaders = [
  ...examplesSource.matchAll(/name: '([^']+)'[\s\S]*?examples\/([\w.-]+)'\)\s*\.then\(\s*m => m\.(\w+)/g),
].map(([, name, file, cls]) => `  'component:${name}': () => import('./examples/${file}').then(m => m.${cls}),`);
if (loaders.length < 50) throw new Error(`only ${loaders.length} example loaders parsed from create-examples.ts`);

writeFileSync(
  join(parity, 'parity-host.component.ts'),
  `import { NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal, type Type } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { decodePreset } from '@/parity/design';
import { PreviewDesignContext } from '@/parity/lib/preview-design.context';

const LOADERS: Record<string, () => Promise<Type<unknown>>> = {
  'preview-01': () => import('./canvas/canvas-01.component').then(m => m.CanvasOneComponent),
  'preview-02': () => import('./canvas/canvas-02.component').then(m => m.CanvasTwoComponent),
${loaders.join('\n')}
};

/** The same wrapper /create's preview page puts around a canvas or an example. */
@Component({
  selector: 'z-parity-host',
  imports: [NgComponentOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <main class="bg-background text-foreground" data-item="parity">
      @if (component(); as c) {
        <ng-container *ngComponentOutlet="c" />
      }
    </main>
  \`,
})
export class ParityHostComponent {
  protected readonly component = signal<Type<unknown> | null>(null);

  constructor() {
    inject(PreviewDesignContext).design.set(decodePreset(${JSON.stringify(components.preset)}));
    const item = inject(ActivatedRoute).snapshot.paramMap.get('item') ?? 'preview-01';
    void LOADERS[item]?.().then(c => this.component.set(c));
  }
}
`,
);

writeFileSync(
  join(project, 'src/app/app.routes.ts'),
  `import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'parity/:item',
    loadComponent: () => import('./parity/parity-host.component').then(m => m.ParityHostComponent),
  },
];
`,
);

// The generated app shell is a welcome page with its own <style>: only the router outlet stays.
writeFileSync(join(project, 'src/app/app.html'), '<router-outlet />\n');
writeFileSync(join(project, 'src/app/app.css'), '');

// Charts need their provider, as the docs app registers it (and as a user adding `chart` must).
const configPath = join(project, 'src/app/app.config.ts');
let config = readFileSync(configPath, 'utf8');
if (!config.includes('provideZardCharts')) {
  config =
    `import { provideZardCharts } from '${aliases['components']}/chart/chart-echarts.provider';\n${config}`.replace(
      'provideZard(),',
      'provideZard(),\n    provideZardCharts(),',
    );
  writeFileSync(configPath, config);
}

// `style-lyra:md:w-[2600px]` and friends in the canvas wrappers; and the class that switches them on.
const stylesPath = join(project, 'src/styles.css');
let styles = readFileSync(stylesPath, 'utf8').replace(/\n\/\* create-parity:start[\s\S]*?create-parity:end \*\/\n/, '');
styles += `\n/* create-parity:start */\n${STYLE_IDS.map(id => `@custom-variant style-${id} (&:is(.style-${id} *));`).join('\n')}\n/* create-parity:end */\n`;
writeFileSync(stylesPath, styles);

const indexPath = join(project, 'src/index.html');
writeFileSync(indexPath, readFileSync(indexPath, 'utf8').replace(/<body[^>]*>/, `<body class="style-${style}">`));

if (!args.includes('--no-build')) {
  const build = spawnSync('npx', ['ng', 'build', '--configuration', 'production'], {
    cwd: project,
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, NG_FORCE_AUTOCOMPLETE: 'false', NG_CLI_ANALYTICS: 'false' },
  });
  if (build.status !== 0) process.exit(build.status ?? 1);
  if (!existsSync(join(project, 'dist'))) throw new Error('ng build produced no dist/');
}
console.log(`prepared ${project} (${style}, ${loaders.length} examples)`);
