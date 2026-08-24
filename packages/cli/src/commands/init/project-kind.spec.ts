/**
 * What changes from one project type to another.
 *
 * The differences are not cosmetic: a library has no `app.config.ts` to register
 * providers in and no pre-existing global CSS, Nx keeps the TypeScript paths in
 * a different file and lives under `apps/`, and Analog compiles with Vite —
 * where nobody reads a `.postcssrc.json`. Each of those assumptions broke a step
 * of init when the Angular-application flow was applied to it.
 */

// `steps.ts` reaches the package-manager, which imports @antfu/ni — ESM, which
// Jest does not parse. Only the list of steps matters here; none of them run.
jest.mock('@antfu/ni', () => ({ detect: jest.fn() }));

import { buildConfig, defaultAnswers, type InitAnswers } from '@cli/commands/init/config-prompter.js';
import {
  candidateProjects,
  detectProjectKind,
  indexHtmlFor,
  isLibraryKind,
  libraryBaseUrl,
  libraryStylesPath,
  projectRootOf,
  PROJECT_KINDS,
  sourceRootOf,
  tsconfigFileFor,
  type ProjectKind,
} from '@cli/commands/init/project-kind.js';
import { buildInitSteps } from '@cli/commands/init/steps.js';
import type { ProjectInfo, WorkspaceProject } from '@cli/utils/get-project-info.js';

function projectInfo(projects: WorkspaceProject[] = [], over: Partial<ProjectInfo> = {}): ProjectInfo {
  return {
    framework: 'angular',
    root: '/proj',
    workspace: 'angular',
    hasTypeScript: true,
    hasTailwind: false,
    hasNx: false,
    hasAnalog: false,
    tsconfigFile: 'tsconfig.json',
    angularVersion: '22.0.0',
    angularVersionRaw: '^22.0.0',
    projects,
    ...over,
  };
}

function project(over: Partial<WorkspaceProject> = {}): WorkspaceProject {
  return {
    name: 'angular-app',
    projectType: 'application',
    root: '',
    sourceRoot: 'src',
    flavor: 'angular',
    styles: [],
    index: null,
    ...over,
  };
}

const application = project();

const library = project({ name: 'ui', projectType: 'library', root: 'projects/ui', sourceRoot: 'projects/ui/src' });

const nxApplication = project({
  name: 'nx-app',
  root: 'apps/nx-app',
  sourceRoot: 'apps/nx-app/src',
  styles: ['apps/nx-app/src/styles.css'],
});

const nxLibrary = project({
  name: 'ui',
  projectType: 'library',
  root: 'libs/ui',
  sourceRoot: 'libs/ui/src',
});

const nxWorkspace = projectInfo([nxApplication, nxLibrary], { workspace: 'nx', hasNx: true });

describe('PROJECT_KINDS', () => {
  // Menu order: each ecosystem together, with the application before the
  // library, and Angular opening the list because it is the default.
  it('should group every supported type by ecosystem, Angular first', () => {
    expect(PROJECT_KINDS.map(kind => kind.value)).toEqual(['angular', 'angular-library', 'nx', 'nx-library', 'analog']);
  });

  it('should describe each type so the choice is not a guess', () => {
    expect(PROJECT_KINDS.every(kind => kind.detail.length > 0)).toBe(true);
  });

  // The colour says at a glance which world the type belongs to, and it would
  // not if it varied between an ecosystem's application and its library.
  it('should paint both flavours of an ecosystem with the same colour', () => {
    const colorOf = (value: string) => PROJECT_KINDS.find(kind => kind.value === value)?.color;

    expect(colorOf('angular')).toBe(colorOf('angular-library'));
    expect(colorOf('nx')).toBe(colorOf('nx-library'));
    expect(new Set(PROJECT_KINDS.map(kind => kind.color)).size).toBe(3);
  });
});

describe('isLibraryKind', () => {
  it('should hold for both library flavours and for neither application', () => {
    expect(PROJECT_KINDS.filter(kind => isLibraryKind(kind.value)).map(kind => kind.value)).toEqual([
      'angular-library',
      'nx-library',
    ]);
  });
});

/**
 * Detection does not drive the wizard — the user picks the type, in the first
 * question. It only decides on the headless path, where nobody can answer.
 */
describe('detectProjectKind', () => {
  it('should pick the Nx application when the workspace is managed by Nx', () => {
    expect(detectProjectKind(nxWorkspace)).toBe('nx');
  });

  it('should pick the Nx library when Nx declares no application at all', () => {
    expect(detectProjectKind(projectInfo([nxLibrary], { workspace: 'nx', hasNx: true }))).toBe('nx-library');
  });

  it('should pick Analog when the project depends on it', () => {
    expect(detectProjectKind(projectInfo([application], { hasAnalog: true }))).toBe('analog');
  });

  it('should default to application when the workspace has one', () => {
    expect(detectProjectKind(projectInfo([application, library]))).toBe('angular');
  });

  it('should suggest library when there is no application at all', () => {
    expect(detectProjectKind(projectInfo([library]))).toBe('angular-library');
  });

  it('should default to application when the workspace declares nothing', () => {
    expect(detectProjectKind(projectInfo([]))).toBe('angular');
  });
});

describe('candidateProjects', () => {
  it('should offer only what the chosen type knows how to configure', () => {
    expect(candidateProjects('nx', nxWorkspace).map(candidate => candidate.name)).toEqual(['nx-app']);
    expect(candidateProjects('nx-library', nxWorkspace).map(candidate => candidate.name)).toEqual(['ui']);
  });

  it('should list the libraries in workspace order', () => {
    const second = project({ ...library, name: 'icons', root: 'projects/icons' });

    expect(candidateProjects('angular-library', projectInfo([application, library, second])).map(p => p.name)).toEqual([
      'ui',
      'icons',
    ]);
  });
});

describe('tsconfigFileFor', () => {
  // The tsconfig.json at the root of an Nx workspace is inherited by no project:
  // an alias written there would resolve in the editor and break in the build.
  it('should target tsconfig.base.json on Nx, whatever the workspace reports', () => {
    expect(tsconfigFileFor('nx', projectInfo())).toBe('tsconfig.base.json');
    expect(tsconfigFileFor('nx-library', projectInfo())).toBe('tsconfig.base.json');
  });

  it('should follow the workspace outside Nx', () => {
    expect(tsconfigFileFor('angular', projectInfo())).toBe('tsconfig.json');
    expect(tsconfigFileFor('analog', projectInfo([], { tsconfigFile: 'tsconfig.base.json' }))).toBe(
      'tsconfig.base.json',
    );
  });
});

describe('defaultAnswers', () => {
  it('should read the app paths from the project the workspace declares', () => {
    const answers = defaultAnswers(nxWorkspace, 'nx');

    expect(answers.projectRoot).toBe('apps/nx-app');
    expect(answers.appConfig).toBe('apps/nx-app/src/app/app.config.ts');
    // The build target's `styles` is where the global CSS actually lives.
    expect(answers.globalCss).toBe('apps/nx-app/src/styles.css');
  });

  it('should honour the project asked for, not just the first candidate', () => {
    const second = project({ name: 'admin', root: 'apps/admin', sourceRoot: 'apps/admin/src' });
    const answers = defaultAnswers(projectInfo([nxApplication, second], { hasNx: true }), 'nx', 'apps/admin');

    expect(answers.appConfig).toBe('apps/admin/src/app/app.config.ts');
    expect(answers.globalCss).toBe('apps/admin/src/styles.css');
  });

  it('should target src/lib inside the detected library', () => {
    const answers = defaultAnswers(projectInfo([library]), 'angular-library');

    expect(answers.projectRoot).toBe('projects/ui');
    expect(answers.globalCss).toBe('projects/ui/src/styles.css');
    // A library has no app.config; the field stays empty instead of pointing nowhere.
    expect(answers.appConfig).toBe('');
  });

  it('should fall back to where each ecosystem generates projects', () => {
    expect(defaultAnswers(projectInfo([application]), 'angular-library').projectRoot).toBe('projects/ui');
    expect(defaultAnswers(projectInfo([]), 'nx-library').projectRoot).toBe('libs/ui');
    expect(defaultAnswers(projectInfo([]), 'nx').projectRoot).toBe('apps/app');
  });

  it('should keep the single-app defaults untouched', () => {
    const answers = defaultAnswers(projectInfo([application]), 'angular');

    expect(answers.appConfig).toBe('src/app/app.config.ts');
    expect(answers.globalCss).toBe('src/styles.css');
    expect(answers.projectRoot).toBe('');
  });
});

describe('buildConfig', () => {
  const libraryAnswers: InitAnswers = {
    kind: 'angular-library',
    projectRoot: 'projects/ui',
    appConfig: '',
    theme: 'neutral',
    globalCss: 'projects/ui/src/styles.css',
    componentsAlias: '@/shared/components',
    utilsAlias: '@/shared/utils',
  };

  it('should derive baseUrl from the library root, not from app.config', () => {
    const config = buildConfig(libraryAnswers, 'bun');

    expect(config.baseUrl).toBe('projects/ui/src/lib');
    expect(config.projectType).toBe('angular-library');
  });

  it('should derive baseUrl from an Nx library root too', () => {
    const config = buildConfig({ ...libraryAnswers, kind: 'nx-library', projectRoot: 'libs/ui' }, 'npm');

    expect(config.baseUrl).toBe('libs/ui/src/lib');
  });

  it('should record the project type for an application too', () => {
    const config = buildConfig(
      { ...libraryAnswers, kind: 'nx', appConfig: 'apps/nx-app/src/app/app.config.ts' },
      'bun',
    );

    expect(config.projectType).toBe('nx');
    expect(config.baseUrl).toBe('apps/nx-app/src/app');
  });
});

describe('buildInitSteps', () => {
  const answersFor = (kind: ProjectKind): InitAnswers => {
    const shared = { kind, theme: 'neutral', componentsAlias: '@/shared/components', utilsAlias: '@/shared/utils' };

    if (isLibraryKind(kind)) {
      const root = kind === 'nx-library' ? 'libs/ui' : 'projects/ui';
      return { ...shared, projectRoot: root, appConfig: '', globalCss: `${root}/src/styles.css` };
    }

    const root = kind === 'nx' ? 'apps/nx-app' : '';
    const sourceRoot = root ? `${root}/src` : 'src';

    return {
      ...shared,
      projectRoot: root,
      appConfig: `${sourceRoot}/app/app.config.ts`,
      globalCss: `${sourceRoot}/styles.css`,
    };
  };

  const labelsFor = (kind: ProjectKind, info = projectInfo([library])): string[] =>
    buildInitSteps('/proj', buildConfig(answersFor(kind), 'bun'), info, false).map(step => step.label);

  it('should not touch app.config.ts on a library', () => {
    for (const kind of ['angular-library', 'nx-library'] as const) {
      expect(labelsFor(kind).some(label => label.endsWith('app.config.ts'))).toBe(false);
    }
  });

  // .postcssrc configures an application's build; a library is compiled by
  // ng-packagr and Tailwind is processed by the project consuming it.
  it('should not write a postcss config on a library', () => {
    expect(labelsFor('angular-library')).not.toContain('.postcssrc.json');
    expect(labelsFor('angular')).toContain('.postcssrc.json');
  });

  // Writing it at the repository root would configure every app in the workspace.
  it('should write the postcss config inside the Nx project', () => {
    expect(labelsFor('nx', nxWorkspace)).toContain('apps/nx-app/.postcssrc.json');
  });

  // In Analog it is Vite that compiles; a .postcssrc.json there is never read.
  it('should register a Vite plugin instead of a postcss config on Analog', () => {
    expect(labelsFor('analog')).toContain('vite.config.ts');
    expect(labelsFor('analog')).not.toContain('.postcssrc.json');
  });

  it('should write the TypeScript paths where each workspace keeps them', () => {
    expect(labelsFor('angular')).toContain('tsconfig.json');
    expect(labelsFor('nx', nxWorkspace)).toContain('tsconfig.base.json');
    expect(labelsFor('nx-library', nxWorkspace)).toContain('tsconfig.base.json');
  });

  it('should ship the theme as a library asset', () => {
    expect(labelsFor('angular-library')).toContain('ng-package.json');
    expect(labelsFor('angular')).not.toContain('ng-package.json');
  });

  it('should still install deps, theme, tsconfig paths and core & utils', () => {
    const labels = labelsFor('angular-library');

    expect(labels).toContain('components.json');
    expect(labels).toContain('dependencies');
    expect(labels).toContain('projects/ui/src/styles.css');
    expect(labels).toContain('tsconfig.json');
    expect(labels).toContain('core & utils');
  });

  it('should register providers on an application', () => {
    expect(labelsFor('angular')).toContain('src/app/app.config.ts');
    expect(labelsFor('nx', nxWorkspace)).toContain('apps/nx-app/src/app/app.config.ts');
  });
});

describe('caminhos do projeto', () => {
  it('should follow the generate-library convention of both ecosystems', () => {
    expect(libraryBaseUrl('projects/ui')).toBe('projects/ui/src/lib');
    expect(libraryBaseUrl('libs/ui')).toBe('libs/ui/src/lib');
    expect(libraryStylesPath('projects/ui')).toBe('projects/ui/src/styles.css');
  });

  it('should tolerate a trailing slash on the library root', () => {
    expect(libraryBaseUrl('projects/ui/')).toBe('projects/ui/src/lib');
    expect(libraryStylesPath('projects/ui/')).toBe('projects/ui/src/styles.css');
  });

  it('should climb back from baseUrl to the project root', () => {
    expect(projectRootOf('src/app')).toBe('.');
    expect(projectRootOf('apps/nx-app/src/app')).toBe('apps/nx-app');
    expect(projectRootOf('libs/ui/src/lib')).toBe('libs/ui');
    expect(sourceRootOf('apps/nx-app/src/app')).toBe('apps/nx-app/src');
  });

  // In Analog index.html is Vite's entry page and sits at the project root, not
  // in src/ as in the Angular build.
  it('should know where each toolchain keeps index.html', () => {
    expect(indexHtmlFor('angular', 'src/app')).toBe('src/index.html');
    expect(indexHtmlFor('nx', 'apps/nx-app/src/app')).toBe('apps/nx-app/src/index.html');
    expect(indexHtmlFor('analog', 'src/app')).toBe('index.html');
  });
});
