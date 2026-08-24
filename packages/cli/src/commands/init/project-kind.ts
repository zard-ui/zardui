/**
 * Which kind of project `init` is configuring.
 *
 * The user answers, in the wizard's first question — the CLI does not decide for
 * them. What the workspace reveals comes afterwards, to fill in the suggested
 * paths for the chosen type; detection only becomes a decision on the headless
 * path, where there is nobody to ask.
 *
 * The differences between the types are not cosmetic: a library has no
 * `app.config.ts` to register providers in and no pre-existing global CSS, Nx
 * keeps the TypeScript paths in a different file, and Analog swaps Angular's
 * build for Vite — and with it the way Tailwind is configured. Concentrating
 * those differences here keeps every step from rediscovering them.
 */

import type { ProjectInfo, WorkspaceProject } from '@cli/utils/get-project-info.js';
import * as path from 'node:path';

export type ProjectKind = 'angular' | 'angular-library' | 'nx' | 'nx-library' | 'analog';

export interface ProjectKindOption {
  readonly value: ProjectKind;
  readonly label: string;
  readonly detail: string;
  /** The ecosystem's colour, so the menu says at a glance which world the type belongs to. */
  readonly color: string;
}

/**
 * The colour of each ecosystem in the menu.
 *
 * Angular stays the base white — it is the default case, and giving it a colour
 * would suggest it is a special option among the others.
 */
const ANGULAR = '#fafafa';
const NX = '#6aa9ff';
const ANALOG = '#fb7185';

/**
 * Menu order: each ecosystem with the application before the library, from the
 * most common to the rarest. Angular opens the list because it is the default.
 */
export const PROJECT_KINDS: readonly ProjectKindOption[] = [
  {
    value: 'angular',
    label: 'Angular',
    detail: 'Application — providers in app.config.ts, tokens in the global CSS.',
    color: ANGULAR,
  },
  {
    value: 'angular-library',
    label: 'Angular Library',
    detail: 'Publishable library — components ship with it, no app providers.',
    color: ANGULAR,
  },
  {
    value: 'nx',
    label: 'Nx',
    detail: 'Application inside an Nx workspace — paths go to tsconfig.base.json.',
    color: NX,
  },
  {
    value: 'nx-library',
    label: 'Nx Library',
    detail: 'Library inside an Nx workspace — lives in libs/, no app providers.',
    color: NX,
  },
  {
    value: 'analog',
    label: 'Analog.js',
    detail: 'Vite-powered Angular app — Tailwind is a Vite plugin, not PostCSS.',
    color: ANALOG,
  },
];

interface KindTraits {
  /** Libraries have no app.config.ts, no global CSS and no app build of their own. */
  readonly isLibrary: boolean;
  /** Quem gerencia o workspace — decide onde os paths do TypeScript vivem. */
  readonly workspace: 'angular' | 'nx';
  /** Quem processa o CSS: o build do Angular (PostCSS) ou o Vite (plugin). */
  readonly bundler: 'angular' | 'vite';
  /** Onde o gerador do ecossistema costuma criar projetos deste tipo. */
  readonly fallbackRoot: string;
}

const TRAITS: Record<ProjectKind, KindTraits> = {
  angular: { isLibrary: false, workspace: 'angular', bundler: 'angular', fallbackRoot: '' },
  analog: { isLibrary: false, workspace: 'angular', bundler: 'vite', fallbackRoot: '' },
  nx: { isLibrary: false, workspace: 'nx', bundler: 'angular', fallbackRoot: 'apps/app' },
  'angular-library': { isLibrary: true, workspace: 'angular', bundler: 'angular', fallbackRoot: 'projects/ui' },
  'nx-library': { isLibrary: true, workspace: 'nx', bundler: 'angular', fallbackRoot: 'libs/ui' },
};

export function isLibraryKind(kind: ProjectKind): boolean {
  return TRAITS[kind].isLibrary;
}

/** Where the TypeScript paths have to be written for the project to see them. */
export function tsconfigFileFor(kind: ProjectKind, projectInfo: ProjectInfo): string {
  // Nx extends a tsconfig.base.json at the root; writing into the tsconfig.json
  // there would reach no project at all. Outside Nx the tsconfig.json itself is
  // the target, unless the workspace already keeps a base — then that one wins.
  if (TRAITS[kind].workspace === 'nx') return 'tsconfig.base.json';

  return projectInfo.tsconfigFile;
}

/** Se o Tailwind entra pelo PostCSS do Angular ou pelo plugin do Vite. */
export function bundlerFor(kind: ProjectKind): 'angular' | 'vite' {
  return TRAITS[kind].bundler;
}

/**
 * The workspace projects that can receive the install.
 *
 * Once the type is chosen, only what matches it makes sense to offer: asking
 * someone who chose "library" to install into an application would offer a
 * target the following steps do not know how to configure.
 */
export function candidateProjects(kind: ProjectKind, projectInfo: ProjectInfo): WorkspaceProject[] {
  const wanted = TRAITS[kind].isLibrary ? 'library' : 'application';

  return projectInfo.projects.filter(project => project.projectType === wanted);
}

/** Default root when the workspace declares no compatible project. */
export function fallbackRootFor(kind: ProjectKind): string {
  return TRAITS[kind].fallbackRoot;
}

/**
 * The type the headless path assumes.
 *
 * With no interactive terminal nobody answers the first question, so here — and
 * only here — the workspace decides: the manager gives the world (Nx or
 * Angular), Analog announces itself through its own dependencies, and the
 * absence of any application is what suggests the target is a library.
 */
export function detectProjectKind(projectInfo: ProjectInfo): ProjectKind {
  const hasApplication = projectInfo.projects.some(project => project.projectType === 'application');
  const hasLibrary = projectInfo.projects.some(project => project.projectType === 'library');
  const isLibraryWorkspace = !hasApplication && hasLibrary;

  if (projectInfo.hasNx) return isLibraryWorkspace ? 'nx-library' : 'nx';
  if (isLibraryWorkspace) return 'angular-library';

  return projectInfo.hasAnalog ? 'analog' : 'angular';
}

/**
 * Where a library's code lives.
 *
 * `src/lib` is the convention for both `ng generate library` and
 * `nx g @nx/angular:library`: `src/` holds the public entry point, and
 * everything it exports sits in `src/lib`.
 */
export function libraryBaseUrl(libraryRoot: string): string {
  return `${trimSlashes(libraryRoot)}/src/lib`;
}

/** The theme CSS the library starts exposing to whoever consumes it. */
export function libraryStylesPath(libraryRoot: string): string {
  return `${trimSlashes(libraryRoot)}/src/styles.css`;
}

/**
 * The project root, derived from `baseUrl`.
 *
 * Both layouts end two levels below the root — `<root>/src/app` in an
 * application, `<root>/src/lib` in a library — so going up two levels gives the
 * directory holding that project's `project.json`, `ng-package.json` and
 * `.postcssrc.json`. A single app at the root gives `.`.
 */
export function projectRootOf(baseUrl: string): string {
  return path.posix.normalize(path.posix.join(toPosix(baseUrl), '..', '..'));
}

/** The project's source directory — where `index.html` and `main.ts` sit. */
export function sourceRootOf(baseUrl: string): string {
  return path.posix.dirname(toPosix(baseUrl));
}

/**
 * Where to look for the project's `index.html`.
 *
 * In Analog it is Vite's entry page and sits at the project root, not in `src/`
 * as in the Angular build — suggesting the wrong path made `add dark-mode` fail
 * right after asking.
 */
export function indexHtmlFor(kind: ProjectKind, baseUrl: string): string {
  if (kind === 'analog') {
    const root = projectRootOf(baseUrl);
    return root === '.' ? 'index.html' : `${root}/index.html`;
  }

  return `${sourceRootOf(baseUrl)}/index.html`;
}

function toPosix(value: string): string {
  return value.replace(/\\/g, '/');
}

function trimSlashes(value: string): string {
  return value.replace(/\/+$/, '');
}
