import {
  candidateProjects,
  detectProjectKind,
  fallbackRootFor,
  isLibraryKind,
  libraryBaseUrl,
  libraryStylesPath,
  type ProjectKind,
} from '@cli/commands/init/project-kind.js';
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
  /** Raiz do projeto escolhido, relativa ao workspace; vazia no app único. */
  projectRoot: string;
  appConfig: string;
  theme: string;
  globalCss: string;
  componentsAlias: string;
  utilsAlias: string;
}

/**
 * O projeto que o tipo escolhido sugere como alvo.
 *
 * Havendo mais de um compatível, o wizard pergunta — mas alguém precisa abrir a
 * lista escolhido, e o primeiro declarado é a resposta menos surpreendente.
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
 * Os caminhos sugeridos para o tipo que o usuário escolheu.
 *
 * Vêm do projeto declarado no workspace sempre que ele existe — o `styles` do
 * target de build é onde o CSS global realmente está, e adivinhá-lo era o que
 * fazia o init sugerir caminhos que não existiam em layouts de monorepo.
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
      // Não há app.config numa biblioteca; o campo fica vazio no components.json.
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
 * De onde os componentes são escritos, deduzido do `app.config.ts`.
 *
 * Fixar `src/app` quebrava todo layout que não fosse app único na raiz: num
 * workspace o app.config vive em `apps/<app>/src/app`, e os componentes
 * acabavam num `src/app` na raiz que não pertence a projeto nenhum. O diretório
 * do app.config é exatamente a raiz do código do app.
 */
export function deriveBaseUrl(appConfigFile: string): string {
  const dir = path.dirname(appConfigFile).replace(/\\/g, '/');
  return dir === '.' ? 'src/app' : dir;
}

/** Numa biblioteca o app.config não existe, então quem manda é a raiz da lib. */
function baseUrlFor(answers: InitAnswers): string {
  return isLibraryKind(answers.kind) ? libraryBaseUrl(answers.projectRoot) : deriveBaseUrl(answers.appConfig);
}

export function buildConfig(answers: InitAnswers, packageManager: 'npm' | 'yarn' | 'pnpm' | 'bun'): Config {
  const sharedBase = path.dirname(answers.componentsAlias).replace(/\\/g, '/');

  return configSchema.parse({
    $schema: SCHEMA_URL,
    style: 'css',
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
 * Estado do CSS global informado pelo usuário.
 *
 * O init sobrescreve esse arquivo com os tokens do tema, então o wizard precisa
 * saber, antes de avançar, se ele existe e se há conteúdo a perder.
 */
export type CssFileState = 'missing' | 'empty' | 'has-content';

export async function inspectCssFile(cwd: string, relativePath: string): Promise<CssFileState> {
  const cssPath = path.join(cwd, relativePath);

  if (!existsSync(cssPath)) return 'missing';

  const content = await readFile(cssPath, 'utf8');
  return content.trim().length > 0 ? 'has-content' : 'empty';
}
