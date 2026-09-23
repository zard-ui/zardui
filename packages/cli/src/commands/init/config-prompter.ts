import {
  candidateProjects,
  detectProjectKind,
  fallbackRootFor,
  isLibraryKind,
  libraryBaseUrl,
  libraryStylesPath,
  type ProjectKind,
} from '@cli/commands/init/project-kind.js';
import { SOURCE_ICON_FAMILY } from '@cli/core/icons/index.js';
import { type Config } from '@cli/utils/config.js';
import { type ProjectInfo, type WorkspaceProject } from '@cli/utils/get-project-info.js';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import * as path from 'node:path';
import { z } from 'zod';

export const SCHEMA_URL = 'https://zardui.com/schema.json';

export const configSchema = z.object({
  $schema: z.string(),
  style: z.enum(['css']),
  icons: z.string(),
  rtl: z.boolean(),
  projectType: z.enum(['angular', 'angular-library', 'nx', 'nx-library', 'analog']),
  appConfigFile: z.string(),
  packageManager: z.enum(['npm', 'yarn', 'pnpm', 'bun']),
  tailwind: z.object({
    css: z.string(),
    baseColor: z.string(),
  }),
  baseUrl: z.string(),
  aliases: z.object({
    components: z.string(),
    utils: z.string(),
    core: z.string(),
    services: z.string(),
  }),
});

/** As respostas do wizard, antes de virarem um `components.json`. */
export interface InitAnswers {
  kind: ProjectKind;
  /** Root of the chosen project, relative to the workspace; empty for a single app. */
  projectRoot: string;
  appConfig: string;
  theme: string;
  globalCss: string;
  componentsAlias: string;
  utilsAlias: string;
}

/**
 * The project the chosen type suggests as the target.
 *
 * When more than one is compatible the wizard asks — but something has to be
 * preselected when the list opens, and the first declared project is the least
 * surprising answer.
 */
function targetProject(
  projectInfo: ProjectInfo,
  kind: ProjectKind,
  projectRoot?: string,
): WorkspaceProject | undefined {
  const candidates = candidateProjects(kind, projectInfo);

  return candidates.find(project => project.root === projectRoot) ?? candidates[0];
}

/**
 * The paths suggested for the type the user chose.
 *
 * They come from the project declared in the workspace whenever there is one —
 * the build target's `styles` is where the global CSS actually lives, and
 * guessing it was what made init suggest paths that did not exist in monorepo
 * layouts.
 */
export function defaultAnswers(
  projectInfo: ProjectInfo,
  kind = detectProjectKind(projectInfo),
  projectRoot?: string,
): InitAnswers {
  const project = targetProject(projectInfo, kind, projectRoot);
  const root = project?.root ?? fallbackRootFor(kind);

  const shared = {
    kind,
    projectRoot: root,
    theme: 'neutral',
    componentsAlias: '@/shared/components',
    utilsAlias: '@/shared/utils',
  };

  if (isLibraryKind(kind)) {
    return {
      ...shared,
      // A library has no app.config; the field stays empty in components.json.
      appConfig: '',
      globalCss: libraryStylesPath(root),
    };
  }

  const sourceRoot = project?.sourceRoot ?? (root ? `${root}/src` : 'src');

  return {
    ...shared,
    appConfig: `${sourceRoot}/app/app.config.ts`,
    globalCss: project?.styles[0] ?? `${sourceRoot}/styles.css`,
  };
}

/**
 * Where the components are written, derived from `app.config.ts`.
 *
 * Hardcoding `src/app` broke every layout that was not a single app at the root:
 * in a workspace the app.config lives in `apps/<app>/src/app`, and the components
 * ended up in a root `src/app` that belongs to no project. The directory holding
 * app.config is exactly the root of the app's code.
 *
 * Separators are normalized before `dirname`, not after: on POSIX `path.dirname`
 * does not treat `\` as a separator, so a Windows-style path collapsed to `.`
 * and silently fell back to `src/app`.
 */
export function deriveBaseUrl(appConfigFile: string): string {
  const dir = path.posix.dirname(appConfigFile.replace(/\\/g, '/'));
  return dir === '.' ? 'src/app' : dir;
}

/** In a library there is no app.config, so the library root decides. */
function baseUrlFor(answers: InitAnswers): string {
  return isLibraryKind(answers.kind) ? libraryBaseUrl(answers.projectRoot) : deriveBaseUrl(answers.appConfig);
}

export function buildConfig(answers: InitAnswers, packageManager: 'npm' | 'yarn' | 'pnpm' | 'bun'): Config {
  const sharedBase = path.posix.dirname(answers.componentsAlias.replace(/\\/g, '/'));

  return configSchema.parse({
    $schema: SCHEMA_URL,
    style: 'css',
    // Neither is asked in the wizard: today there is only one icon family, and
    // RTL does not change what init writes. They go into the file with their
    // default so they can be edited later, which is what makes them configurable.
    icons: SOURCE_ICON_FAMILY,
    rtl: false,
    projectType: answers.kind,
    appConfigFile: answers.appConfig,
    packageManager,
    tailwind: {
      css: answers.globalCss,
      baseColor: answers.theme,
    },
    baseUrl: baseUrlFor(answers),
    aliases: {
      components: answers.componentsAlias,
      utils: answers.utilsAlias,
      core: `${sharedBase}/core`,
      services: `${sharedBase}/services`,
    },
  });
}

/**
 * State of the global CSS file the user pointed at.
 *
 * init overwrites that file with the theme tokens, so the wizard has to know,
 * before going on, whether it exists and whether there is content to lose.
 */
export type CssFileState = 'missing' | 'empty' | 'has-content';

export async function inspectCssFile(cwd: string, relativePath: string): Promise<CssFileState> {
  const cssPath = path.join(cwd, relativePath);

  if (!existsSync(cssPath)) return 'missing';

  const content = await readFile(cssPath, 'utf8');
  return content.trim().length > 0 ? 'has-content' : 'empty';
}
