import { access, readdir, readFile } from 'node:fs/promises';
import * as path from 'path';
import { z } from 'zod';

async function pathExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readJson(filePath: string): Promise<any> {
  const content = await readFile(filePath, 'utf-8');
  return JSON.parse(content);
}

const packageJsonSchema = z.object({
  name: z.string(),
  version: z.string().optional(),
  dependencies: z.record(z.string(), z.string()).optional(),
  devDependencies: z.record(z.string(), z.string()).optional(),
});

/**
 * Which toolchain compiles the project.
 *
 * Analog swaps Angular's build for Vite, and with it where Tailwind is
 * configured: a plugin in `vite.config.ts` instead of `.postcssrc.json`.
 */
export type ProjectFlavor = 'angular' | 'analog';

/** Um projeto declarado no workspace — `angular.json` ou `project.json` do Nx. */
export type WorkspaceProject = {
  name: string;
  projectType: 'application' | 'library';
  /** Project root, relative to the workspace (`apps/web`, or `''` for a single app). */
  root: string;
  sourceRoot: string;
  flavor: ProjectFlavor;
  /** Os `styles` do target de build, relativos ao workspace. */
  styles: string[];
  /** The build target's `index`, when declared. */
  index: string | null;
};

export type ProjectInfo = {
  framework: 'angular' | 'unknown';
  /** Onde o package.json foi encontrado — a raiz do workspace. */
  root: string;
  /** Quem gerencia o workspace: define onde os projetos e os paths do TS vivem. */
  workspace: 'angular' | 'nx';
  hasTypeScript: boolean;
  hasTailwind: boolean;
  hasNx: boolean;
  hasAnalog: boolean;
  /** O tsconfig que guarda `compilerOptions.paths` — `tsconfig.base.json` no Nx. */
  tsconfigFile: string;
  angularVersion: string | null;
  angularVersionRaw: string | null;
  /** What the workspace declares, in the order it appears. Empty when there is none. */
  projects: WorkspaceProject[];
};

async function findPackageJson(startDir: string): Promise<string | null> {
  let dir = path.resolve(startDir);
  const root = path.parse(dir).root;

  while (dir !== root) {
    const candidate = path.join(dir, 'package.json');
    if (await pathExists(candidate)) {
      return candidate;
    }
    dir = path.dirname(dir);
  }

  return null;
}

/** Normalizes separators to the form the configuration files use. */
function toPosix(value: string): string {
  return value.split(path.sep).join('/');
}

/**
 * What the build target says about the project.
 *
 * `angular.json` calls it `architect`/`builder` and Nx calls it
 * `targets`/`executor`, but the option shape is the same — so one read serves both.
 */
function readBuildTarget(targets: any): { tool: string; styles: string[]; index: string | null } {
  const build = targets?.build ?? {};
  const options = build.options ?? {};
  const index = options.index;

  return {
    tool: String(build.builder ?? build.executor ?? ''),
    styles: Array.isArray(options.styles) ? options.styles.filter((style: unknown) => typeof style === 'string') : [],
    index: typeof index === 'string' ? index : typeof index?.input === 'string' ? index.input : null,
  };
}

/** Analog replaces Angular's builder with its own; that is how it announces itself. */
function flavorOf(tool: string): ProjectFlavor {
  return tool.startsWith('@analogjs/') ? 'analog' : 'angular';
}

/**
 * Reads the projects out of `angular.json`.
 *
 * It is what tells an application from a library — package.json does not say. A
 * workspace with no `angular.json` (or an unreadable one) returns an empty list,
 * and the caller decides what to do with that.
 */
async function readAngularProjects(workspaceRoot: string): Promise<WorkspaceProject[]> {
  try {
    const workspace = await readJson(path.join(workspaceRoot, 'angular.json'));

    return Object.entries(workspace.projects ?? {}).map(([name, project]) => {
      const config = project as { projectType?: string; root?: string; sourceRoot?: string; architect?: any };
      const root = config.root === '.' ? '' : (config.root ?? '');
      const build = readBuildTarget(config.architect);

      return {
        name,
        projectType: config.projectType === 'library' ? ('library' as const) : ('application' as const),
        root,
        sourceRoot: config.sourceRoot ?? (root ? `${root}/src` : 'src'),
        flavor: flavorOf(build.tool),
        styles: build.styles,
        index: build.index,
      };
    });
  } catch {
    return [];
  }
}

/**
 * Where to look for `project.json`.
 *
 * Nx does not mandate a layout, but it generates into `apps/` and `libs/` (or
 * wherever `workspaceLayout` says), and package monorepos use `packages/`.
 * Looking only in those places avoids scanning the whole repository for config.
 */
async function nxSearchRoots(workspaceRoot: string): Promise<string[]> {
  try {
    const nxConfig = await readJson(path.join(workspaceRoot, 'nx.json'));
    const layout = nxConfig.workspaceLayout ?? {};

    return [...new Set([layout.appsDir ?? 'apps', layout.libsDir ?? 'libs', 'packages'])];
  } catch {
    return ['apps', 'libs', 'packages'];
  }
}

/**
 * Directories holding a `project.json`, up to two levels below the search root.
 *
 * A project does not contain another, so finding the config ends the descent —
 * which also keeps a project's `node_modules` from becoming a second project.
 */
async function findProjectDirs(baseDir: string, depth: number): Promise<string[]> {
  if (await pathExists(path.join(baseDir, 'project.json'))) {
    return [baseDir];
  }

  if (depth === 0) return [];

  let entries;
  try {
    entries = await readdir(baseDir, { withFileTypes: true });
  } catch {
    return [];
  }

  const found = await Promise.all(
    entries
      .filter(entry => entry.isDirectory() && entry.name !== 'node_modules' && !entry.name.startsWith('.'))
      .map(entry => findProjectDirs(path.join(baseDir, entry.name), depth - 1)),
  );

  return found.flat();
}

/**
 * Reads the projects of an Nx workspace.
 *
 * Nx has no `angular.json`: each project describes itself in its own
 * `project.json`, and the project root is the directory that file sits in.
 */
async function readNxProjects(workspaceRoot: string): Promise<WorkspaceProject[]> {
  const searchRoots = await nxSearchRoots(workspaceRoot);
  const dirs = (await Promise.all(searchRoots.map(dir => findProjectDirs(path.join(workspaceRoot, dir), 2)))).flat();

  const projects = await Promise.all(
    dirs.map(async (dir): Promise<WorkspaceProject | null> => {
      try {
        const config = await readJson(path.join(dir, 'project.json'));
        const root = toPosix(path.relative(workspaceRoot, dir));
        const name = config.name ?? path.basename(dir);

        if (await isE2eProject(dir, name)) return null;

        const build = readBuildTarget(config.targets);

        return {
          name,
          projectType: nxProjectType(config),
          root,
          sourceRoot: config.sourceRoot ?? `${root}/src`,
          flavor: flavorOf(build.tool),
          styles: build.styles,
          index: build.index,
        };
      } catch {
        return null;
      }
    }),
  );

  // Filesystem order is arbitrary; sorting gives the menu a list that is stable
  // between runs.
  return projects
    .filter((project): project is WorkspaceProject => project !== null)
    .sort((a, b) => a.root.localeCompare(b.root));
}

/**
 * Application or library, when `project.json` does not say.
 *
 * A `serve` target only exists for something that is served; no library has one.
 * That is the distinction left when the explicit field is missing.
 */
function nxProjectType(config: any): 'application' | 'library' {
  if (config.projectType === 'library' || config.projectType === 'application') {
    return config.projectType;
  }

  return config.targets?.serve ? 'application' : 'library';
}

/** Configuration files that only exist in an end-to-end test project. */
const E2E_CONFIGS = ['playwright.config.ts', 'playwright.config.js', 'cypress.config.ts', 'cypress.config.js'];

/**
 * Whether the project exists only to run end-to-end tests.
 *
 * The Nx generator creates `<app>-e2e` declaring `projectType: "application"`,
 * and with that it showed up in the list of apps that can receive components —
 * but there is no `app.config.ts`, no global CSS and no build to configure in
 * there. The suffix is Nx's convention; the runner's config file confirms the
 * cases where the project was renamed.
 */
async function isE2eProject(projectDir: string, name: string): Promise<boolean> {
  if (name.endsWith('-e2e') || name.endsWith('-e2e-ct')) return true;

  const configs = await Promise.all(E2E_CONFIGS.map(file => pathExists(path.join(projectDir, file))));
  return configs.some(Boolean);
}

export async function getProjectInfo(cwd: string): Promise<ProjectInfo> {
  const packageJsonPath = await findPackageJson(cwd);

  if (!packageJsonPath) {
    throw new Error('No package.json found. Please run this command in your project root.');
  }

  const workspaceRoot = path.dirname(packageJsonPath);
  const packageJson = packageJsonSchema.parse(await readJson(packageJsonPath));
  const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

  const hasAngular = !!deps['@angular/core'];
  const hasTypeScript = !!deps['typescript'];
  const hasTailwind = !!deps['tailwindcss'];
  const hasNx = !!deps['nx'] || !!deps['@nx/workspace'];
  const hasAnalog =
    !!deps['@analogjs/platform'] || !!deps['@analogjs/router'] || !!deps['@analogjs/vite-plugin-angular'];

  // An Nx workspace can have both files; `angular.json` only describes projects
  // that existed before the migration, so Nx has the final word.
  const projects = hasNx ? await readNxProjects(workspaceRoot) : await readAngularProjects(workspaceRoot);

  const angularVersionRaw = (deps['@angular/core'] as string) || null;
  const angularVersion = angularVersionRaw?.replace(/[^0-9.]/g, '') || null;

  // Nx keeps the paths in a tsconfig.base.json the projects extend; writing into
  // the root tsconfig.json would reach none of them.
  const tsconfigFile = (await pathExists(path.join(workspaceRoot, 'tsconfig.base.json')))
    ? 'tsconfig.base.json'
    : 'tsconfig.json';

  return {
    framework: hasAngular ? 'angular' : 'unknown',
    root: workspaceRoot,
    workspace: hasNx ? 'nx' : 'angular',
    hasTypeScript,
    hasTailwind,
    hasNx,
    hasAnalog,
    tsconfigFile,
    angularVersion,
    angularVersionRaw,
    projects,
  };
}
