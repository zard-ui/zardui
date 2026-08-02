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
 * Qual toolchain compila o projeto.
 *
 * Analog troca o build do Angular por Vite, e com isso troca também onde o
 * Tailwind é configurado: plugin no `vite.config.ts` em vez de `.postcssrc.json`.
 */
export type ProjectFlavor = 'angular' | 'analog';

/** Um projeto declarado no workspace — `angular.json` ou `project.json` do Nx. */
export type WorkspaceProject = {
  name: string;
  projectType: 'application' | 'library';
  /** Raiz do projeto, relativa ao workspace (`apps/web`, ou `''` no app único). */
  root: string;
  sourceRoot: string;
  flavor: ProjectFlavor;
  /** Os `styles` do target de build, relativos ao workspace. */
  styles: string[];
  /** O `index` do target de build, quando declarado. */
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
  /** O que o workspace declara, na ordem em que aparece. Vazio se não houver. */
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

/** Normaliza separadores para o formato que os arquivos de configuração usam. */
function toPosix(value: string): string {
  return value.split(path.sep).join('/');
}

/**
 * O que o target de build diz sobre o projeto.
 *
 * `angular.json` chama de `architect`/`builder` e o Nx de `targets`/`executor`,
 * mas o formato das opções é o mesmo — então uma leitura só serve aos dois.
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

/** Analog substitui o builder do Angular pelo dele; é assim que se anuncia. */
function flavorOf(tool: string): ProjectFlavor {
  return tool.startsWith('@analogjs/') ? 'analog' : 'angular';
}

/**
 * Lê os projetos do `angular.json`.
 *
 * É o que distingue uma aplicação de uma biblioteca — o package.json não diz.
 * Workspace sem `angular.json` (ou ilegível) devolve lista vazia, e quem chama
 * decide o que fazer com isso.
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
 * Onde procurar por `project.json`.
 *
 * O Nx não obriga um layout, mas gera em `apps/` e `libs/` (ou no que
 * `workspaceLayout` disser), e monorepos de pacotes usam `packages/`. Procurar
 * só nesses lugares evita varrer o repositório inteiro atrás de configuração.
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
 * Diretórios que contêm um `project.json`, até dois níveis abaixo da busca.
 *
 * Um projeto não contém outro, então achar a configuração encerra a descida —
 * o que também impede que `node_modules` de um projeto vire um segundo projeto.
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
 * Lê os projetos de um workspace Nx.
 *
 * O Nx não tem `angular.json`: cada projeto se descreve no próprio
 * `project.json`, e a raiz do projeto é o diretório onde esse arquivo está.
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

  // A ordem do sistema de arquivos é arbitrária; ordenar dá ao menu uma lista
  // estável entre execuções.
  return projects
    .filter((project): project is WorkspaceProject => project !== null)
    .sort((a, b) => a.root.localeCompare(b.root));
}

/**
 * Aplicação ou biblioteca, quando o `project.json` não declara.
 *
 * Um `serve` só existe para o que é servido; biblioteca nenhuma tem. É a
 * distinção que sobra quando o campo explícito falta.
 */
function nxProjectType(config: any): 'application' | 'library' {
  if (config.projectType === 'library' || config.projectType === 'application') {
    return config.projectType;
  }

  return config.targets?.serve ? 'application' : 'library';
}

/** Configurações que só existem num projeto de testes de ponta a ponta. */
const E2E_CONFIGS = ['playwright.config.ts', 'playwright.config.js', 'cypress.config.ts', 'cypress.config.js'];

/**
 * Se o projeto existe apenas para rodar testes de ponta a ponta.
 *
 * O gerador do Nx cria `<app>-e2e` declarando `projectType: "application"`, e
 * com isso ele aparecia na lista de apps que podem receber os componentes — mas
 * ali não há `app.config.ts`, CSS global nem build para configurar. O sufixo é
 * a convenção do Nx; o arquivo de configuração do runner confirma os casos em
 * que o projeto foi renomeado.
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

  // Um workspace Nx pode ter os dois arquivos; o `angular.json` só descreve os
  // projetos que já existiam antes da migração, então o Nx tem a palavra final.
  const projects = hasNx ? await readNxProjects(workspaceRoot) : await readAngularProjects(workspaceRoot);

  const angularVersionRaw = (deps['@angular/core'] as string) || null;
  const angularVersion = angularVersionRaw?.replace(/[^0-9.]/g, '') || null;

  // O Nx guarda os paths num tsconfig.base.json que os projetos estendem;
  // escrever no tsconfig.json da raiz não chegaria a nenhum deles.
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
