/**
 * Que tipo de projeto o `init` está configurando.
 *
 * Quem responde é o usuário, na primeira pergunta do wizard — a CLI não decide
 * por ele. O que o workspace revela entra depois, para preencher os caminhos
 * sugeridos do tipo escolhido; a detecção só vira decisão no caminho headless,
 * onde não há ninguém para perguntar.
 *
 * As diferenças entre os tipos não são cosméticas: uma biblioteca não tem
 * `app.config.ts` onde registrar providers nem CSS global pré-existente, o Nx
 * guarda os paths do TypeScript noutro arquivo, e o Analog troca o build do
 * Angular por Vite — e com ele a forma de configurar o Tailwind. Concentrar
 * essas diferenças aqui evita que cada etapa precise redescobri-las.
 */

import type { ProjectInfo, WorkspaceProject } from '@cli/utils/get-project-info.js';
import * as path from 'node:path';

export type ProjectKind = 'angular' | 'angular-library' | 'nx' | 'nx-library' | 'analog';

export interface ProjectKindOption {
  readonly value: ProjectKind;
  readonly label: string;
  readonly detail: string;
}

/** A ordem é a do menu: aplicações primeiro, do caso mais comum ao mais raro. */
export const PROJECT_KINDS: readonly ProjectKindOption[] = [
  {
    value: 'angular',
    label: 'Angular',
    detail: 'Application — providers in app.config.ts, tokens in the global CSS.',
  },
  {
    value: 'nx',
    label: 'Nx',
    detail: 'Application inside an Nx workspace — paths go to tsconfig.base.json.',
  },
  {
    value: 'analog',
    label: 'Analog.js',
    detail: 'Vite-powered Angular app — Tailwind is a Vite plugin, not PostCSS.',
  },
  {
    value: 'angular-library',
    label: 'Angular Library',
    detail: 'Publishable library — components ship with it, no app providers.',
  },
  {
    value: 'nx-library',
    label: 'Nx Library',
    detail: 'Library inside an Nx workspace — lives in libs/, no app providers.',
  },
];

interface KindTraits {
  /** Bibliotecas não têm app.config.ts, CSS global nem build próprio de app. */
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

/** Onde os paths do TypeScript precisam ser escritos para o projeto enxergá-los. */
export function tsconfigFileFor(kind: ProjectKind, projectInfo: ProjectInfo): string {
  // O Nx estende um tsconfig.base.json na raiz; escrever no tsconfig.json de lá
  // não chegaria a projeto nenhum. Fora do Nx o próprio tsconfig.json é o alvo,
  // a menos que o workspace já mantenha um base — aí ele é quem manda.
  if (TRAITS[kind].workspace === 'nx') return 'tsconfig.base.json';

  return projectInfo.tsconfigFile;
}

/** Se o Tailwind entra pelo PostCSS do Angular ou pelo plugin do Vite. */
export function bundlerFor(kind: ProjectKind): 'angular' | 'vite' {
  return TRAITS[kind].bundler;
}

/**
 * Os projetos do workspace que podem receber a instalação.
 *
 * Escolhido o tipo, só faz sentido oferecer o que combina com ele: pedir para
 * instalar numa aplicação quem escolheu biblioteca seria oferecer um alvo que
 * as etapas seguintes não sabem configurar.
 */
export function candidateProjects(kind: ProjectKind, projectInfo: ProjectInfo): WorkspaceProject[] {
  const wanted = TRAITS[kind].isLibrary ? 'library' : 'application';

  return projectInfo.projects.filter(project => project.projectType === wanted);
}

/** Raiz padrão quando o workspace não declara nenhum projeto compatível. */
export function fallbackRootFor(kind: ProjectKind): string {
  return TRAITS[kind].fallbackRoot;
}

/**
 * O tipo que o caminho headless assume.
 *
 * Sem terminal interativo ninguém responde à primeira pergunta, então aqui — e
 * só aqui — o workspace decide: o gerenciador dá o mundo (Nx ou Angular), o
 * Analog se anuncia pelas próprias dependências, e a ausência de qualquer
 * aplicação é o que sugere que o alvo é uma biblioteca.
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
 * Onde o código da biblioteca vive.
 *
 * `src/lib` é a convenção tanto do `ng generate library` quanto do
 * `nx g @nx/angular:library`: `src/` guarda o ponto de entrada público, e tudo
 * que ele exporta fica em `src/lib`.
 */
export function libraryBaseUrl(libraryRoot: string): string {
  return `${trimSlashes(libraryRoot)}/src/lib`;
}

/** O CSS de tema que a biblioteca passa a expor para quem a consome. */
export function libraryStylesPath(libraryRoot: string): string {
  return `${trimSlashes(libraryRoot)}/src/styles.css`;
}

/**
 * A raiz do projeto, deduzida do `baseUrl`.
 *
 * Os dois layouts terminam dois níveis abaixo da raiz — `<root>/src/app` numa
 * aplicação, `<root>/src/lib` numa biblioteca —, então subir dois níveis
 * devolve o diretório onde vivem o `project.json`, o `ng-package.json` e o
 * `.postcssrc.json` daquele projeto. Um app único na raiz devolve `.`.
 */
export function projectRootOf(baseUrl: string): string {
  return path.posix.normalize(path.posix.join(toPosix(baseUrl), '..', '..'));
}

/** O diretório de fontes do projeto — onde `index.html` e `main.ts` ficam. */
export function sourceRootOf(baseUrl: string): string {
  return path.posix.dirname(toPosix(baseUrl));
}

/**
 * Onde procurar o `index.html` do projeto.
 *
 * No Analog ele é a página de entrada do Vite e fica na raiz, e não em `src/`
 * como no build do Angular — sugerir o caminho errado fazia o `add dark-mode`
 * falhar logo depois de perguntar.
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
