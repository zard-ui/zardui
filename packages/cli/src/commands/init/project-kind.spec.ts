/**
 * O que muda de um tipo de projeto para outro.
 *
 * As diferenças não são cosméticas: uma biblioteca não tem `app.config.ts` onde
 * registrar providers nem CSS global pré-existente, o Nx guarda os paths do
 * TypeScript noutro arquivo e vive sob `apps/`, e o Analog compila com Vite —
 * onde um `.postcssrc.json` não é lido por ninguém. Cada uma dessas premissas
 * quebrava uma etapa do init quando aplicada ao fluxo da aplicação Angular.
 */

// `steps.ts` alcança o package-manager, que importa @antfu/ni — ESM, que o Jest
// não parseia. Aqui só interessa a lista de etapas, nenhuma delas é executada.
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
  // A ordem é a do menu: cada ecossistema junto, com a aplicação antes da
  // biblioteca, e Angular abrindo a lista porque é o default.
  it('should group every supported type by ecosystem, Angular first', () => {
    expect(PROJECT_KINDS.map(kind => kind.value)).toEqual(['angular', 'angular-library', 'nx', 'nx-library', 'analog']);
  });

  it('should describe each type so the choice is not a guess', () => {
    expect(PROJECT_KINDS.every(kind => kind.detail.length > 0)).toBe(true);
  });

  // A cor diz de relance a que mundo o tipo pertence, e não faria isso se
  // variasse entre a aplicação e a biblioteca do mesmo ecossistema.
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
 * A detecção não conduz o wizard — quem escolhe o tipo é o usuário, na primeira
 * pergunta. Ela só decide no caminho headless, onde não há quem responda.
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
  // O tsconfig.json da raiz de um workspace Nx não é herdado por projeto
  // nenhum: o alias escrito ali resolveria no editor e quebraria no build.
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
    // O `styles` do target de build é onde o CSS global realmente está.
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
    // A lib não tem app.config; o campo fica vazio em vez de apontar para nada.
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

  // O .postcssrc configura o build de uma aplicação; a lib é compilada pelo
  // ng-packagr e quem processa Tailwind é o projeto que a consome.
  it('should not write a postcss config on a library', () => {
    expect(labelsFor('angular-library')).not.toContain('.postcssrc.json');
    expect(labelsFor('angular')).toContain('.postcssrc.json');
  });

  // Escrevê-lo na raiz do repositório configuraria todos os apps do workspace.
  it('should write the postcss config inside the Nx project', () => {
    expect(labelsFor('nx', nxWorkspace)).toContain('apps/nx-app/.postcssrc.json');
  });

  // No Analog quem compila é o Vite; um .postcssrc.json ali não é lido.
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

  // No Analog o index.html é a página de entrada do Vite e fica na raiz do
  // projeto, não em src/ como no build do Angular.
  it('should know where each toolchain keeps index.html', () => {
    expect(indexHtmlFor('angular', 'src/app')).toBe('src/index.html');
    expect(indexHtmlFor('nx', 'apps/nx-app/src/app')).toBe('apps/nx-app/src/index.html');
    expect(indexHtmlFor('analog', 'src/app')).toBe('index.html');
  });
});
