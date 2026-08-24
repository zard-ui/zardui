import { installComponent } from '@cli/commands/add/component-installer.js';
import { installDependencies } from '@cli/commands/init/dependencies.js';
import { bundlerFor, isLibraryKind, projectRootOf, tsconfigFileFor } from '@cli/commands/init/project-kind.js';
import { applyThemeToStyles, createPostCssConfig } from '@cli/commands/init/tailwind-setup.js';
import { updateTsConfig } from '@cli/commands/init/tsconfig-updater.js';
import { updateAngularConfig } from '@cli/commands/init/update-angular-config.js';
import { setupVitePlugin } from '@cli/commands/init/vite-setup.js';
import { iconFamily } from '@cli/core/icons/index.js';
import { resolveConfigPaths, type Config } from '@cli/utils/config.js';
import { type ProjectInfo } from '@cli/utils/get-project-info.js';
import { iconCatalog } from '@cli/utils/icon-catalog.js';
import { logger } from '@cli/utils/logger.js';
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import * as path from 'node:path';

/**
 * One step of initialization: the label the UI shows and the work it does.
 *
 * The list is built once and consumed by both the wizard and the headless path,
 * so the two run exactly the same sequence — the UI only decides how to present it.
 */
export interface InitStep {
  readonly label: string;
  readonly note: string;
  run(): Promise<void>;
}

export function buildInitSteps(
  cwd: string,
  config: Config,
  projectInfo: ProjectInfo,
  isReInitializing: boolean,
): InitStep[] {
  const kind = config.projectType;
  const isLibrary = isLibraryKind(kind);
  const projectRoot = projectRootOf(config.baseUrl);
  const tsconfigFile = tsconfigFileFor(kind, projectInfo);

  const steps: InitStep[] = [
    {
      label: 'components.json',
      note: 'component & utils aliases',
      run: async () => {
        await writeFile(path.resolve(cwd, 'components.json'), JSON.stringify(config, null, 2), 'utf8');
      },
    },
    {
      label: 'dependencies',
      note: `CDK, CVA, tailwind-merge, ng-icons (${iconFamily(config.icons, iconCatalog())?.label ?? config.icons})`,
      run: () => installDependencies(cwd, config, projectInfo),
    },
  ];

  // Application providers do not belong to the library: the app consuming it
  // registers them, and a library has no app.config.ts to write into.
  if (!isLibrary) {
    steps.push({
      label: config.appConfigFile,
      note: 'zard/ui providers',
      run: () => updateAngularConfig(cwd, config),
    });

    steps.push(tailwindPipelineStep(cwd, projectRoot, kind, projectInfo, isReInitializing));
  }

  steps.push({
    label: config.tailwind.css,
    note: `theme tokens (${config.tailwind.baseColor})`,
    run: () => applyThemeToStyles(cwd, config),
  });

  if (isLibrary) {
    steps.push({
      label: 'ng-package.json',
      note: 'ship the theme with the library',
      run: () => registerStylesAsset(cwd, config),
    });
  }

  steps.push(
    {
      label: tsconfigFile,
      note: 'import path aliases',
      run: () => updateTsConfig(cwd, config, tsconfigFile),
    },
    {
      label: 'core & utils',
      note: 'shared helpers used by every component',
      run: () => installCoreDependencies(cwd, config),
    },
  );

  return steps;
}

/**
 * How Tailwind enters the application build.
 *
 * In Analog it is Vite that compiles, and Tailwind is one of its plugins — a
 * `.postcssrc.json` there would be read by nobody. Everywhere else the Angular
 * build loads PostCSS, and the file goes to the project root: in a workspace
 * with several apps, writing it at the repository root would configure all of
 * them at once.
 */
function tailwindPipelineStep(
  cwd: string,
  projectRoot: string,
  kind: Config['projectType'],
  projectInfo: ProjectInfo,
  isReInitializing: boolean,
): InitStep {
  if (bundlerFor(kind) === 'vite') {
    return {
      label: 'vite.config.ts',
      note: 'Tailwind Vite plugin',
      run: () => setupVitePlugin(cwd),
    };
  }

  const relative = projectRoot === '.' ? '.postcssrc.json' : `${projectRoot}/.postcssrc.json`;

  return {
    label: relative,
    note: 'Tailwind PostCSS plugin',
    // Re-initializing rewrites the file on purpose: it is the chance to correct a
    // `.postcssrc.json` left over from an earlier setup.
    run: () =>
      !projectInfo.hasTailwind || isReInitializing || !existsSync(path.resolve(cwd, relative))
        ? createPostCssConfig(cwd, projectRoot)
        : Promise.resolve(),
  };
}

/**
 * Declares the theme CSS as a library asset.
 *
 * ng-packagr only publishes what the entry point reaches; a loose `.css` in
 * `src/` stays out of the package. Without this entry, the file the previous
 * step wrote would exist only in the repository and never reach whoever
 * installs the library.
 *
 * The asset is declared with `output: '/'` so it lands at the package root.
 * Listing it as a plain path preserves the source folder, and the consumer would
 * end up importing `<lib>/src/styles.css` — a `src/` that is a detail of the
 * library's repository, not something whoever installs it should know.
 */
async function registerStylesAsset(cwd: string, config: Config): Promise<void> {
  const libraryRoot = path.resolve(cwd, projectRootOf(config.baseUrl));
  const ngPackagePath = path.join(libraryRoot, 'ng-package.json');

  if (!existsSync(ngPackagePath)) {
    // An Nx library only gets an ng-package.json when it is publishable; in the
    // others there is no package to assemble and the CSS is consumed straight
    // from the source.
    logger.warn(`ng-package.json not found in ${path.relative(cwd, libraryRoot)}; skipping the theme asset.`);
    return;
  }

  const relative = path.relative(libraryRoot, path.resolve(cwd, config.tailwind.css)).split(path.sep).join('/');
  const input = path.posix.dirname(relative);
  const glob = path.posix.basename(relative);
  const entry = { glob, input, output: '/' };

  const ngPackage = JSON.parse(await readFile(ngPackagePath, 'utf8'));
  const assets: unknown[] = Array.isArray(ngPackage.assets) ? ngPackage.assets : [];

  // Old entries pointing at the same file are replaced, not accumulated: a
  // repeated init would otherwise publish the CSS twice, in two places.
  const others = assets.filter(asset => !describesSameFile(asset, relative, entry));
  const alreadyCorrect = assets.length === others.length + 1 && hasEntry(assets, entry);

  if (alreadyCorrect) return;

  ngPackage.assets = [...others, entry];
  await writeFile(ngPackagePath, `${JSON.stringify(ngPackage, null, 2)}\n`, 'utf8');
}

/** Whether an already-declared asset publishes exactly the same file. */
function describesSameFile(asset: unknown, relative: string, entry: { glob: string; input: string }): boolean {
  if (typeof asset === 'string') return asset.replace(/^\.\//, '') === relative;

  const declared = asset as { glob?: string; input?: string };
  return declared?.glob === entry.glob && declared?.input === entry.input;
}

function hasEntry(assets: unknown[], entry: { glob: string; input: string; output: string }): boolean {
  return assets.some(
    asset =>
      typeof asset === 'object' &&
      asset !== null &&
      (asset as Record<string, unknown>).glob === entry.glob &&
      (asset as Record<string, unknown>).input === entry.input &&
      (asset as Record<string, unknown>).output === entry.output,
  );
}

async function installCoreDependencies(cwd: string, config: Config): Promise<void> {
  const resolvedConfig = await resolveConfigPaths(cwd, config);

  await mkdir(resolvedConfig.resolvedPaths.core, { recursive: true });
  await mkdir(resolvedConfig.resolvedPaths.utils, { recursive: true });

  await installComponent('core', resolvedConfig.resolvedPaths.core, resolvedConfig);
  await installComponent('utils', resolvedConfig.resolvedPaths.utils, resolvedConfig);
}
