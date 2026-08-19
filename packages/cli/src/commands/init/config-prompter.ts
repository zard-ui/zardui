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
import { presetCatalog } from '@cli/utils/preset-catalog.js';
import { DEFAULT_PRESET, encodePreset, type Preset } from '@zardui/preset';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import * as path from 'node:path';
import { z } from 'zod';

export const SCHEMA_URL = 'https://zardui.com/schema.json';

export const configSchema = z.object({
  $schema: z.string(),
  preset: z.object({
    code: z.string().optional(),
    baseColor: z.string(),
    theme: z.string(),
    chart: z.string(),
    radius: z.string(),
    darkMode: z.enum(['class', 'off']),
  }),
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

/**
 * O `components.json`, a partir das respostas.
 *
 * `preset.baseColor` e `tailwind.baseColor` dizem a mesma coisa, de propósito: o
 * campo antigo continua existindo porque todo `components.json` já escrito o
 * tem, e removê-lo obrigaria quem já usa a CLI a editar o arquivo à mão. O
 * preset é quem manda daqui em diante; o outro é mantido em sincronia.
 */
export function buildConfig(
  answers: InitAnswers,
  packageManager: 'npm' | 'yarn' | 'pnpm' | 'bun',
  preset: Preset = { ...DEFAULT_PRESET, baseColor: answers.theme },
): Config {
  const sharedBase = path.dirname(answers.componentsAlias).replace(/\\/g, '/');

  const code = presetCode(preset);

  return configSchema.parse({
    $schema: SCHEMA_URL,
    preset: {
      ...(code ? { code } : {}),
      baseColor: preset.baseColor,
      theme: preset.theme,
      chart: preset.chart,
      radius: preset.radius,
      darkMode: preset.darkMode,
    },
    style: 'css',
    // Nenhuma das duas é perguntada no wizard: hoje só existe uma família de
    // ícones, e o RTL não altera o que o init escreve. Ficam no arquivo com o
    // padrão para serem editadas depois, que é o que as torna configuráveis.
    icons: preset.icons || SOURCE_ICON_FAMILY,
    rtl: preset.rtl,
    projectType: answers.kind,
    appConfigFile: answers.appConfig,
    packageManager,
    tailwind: {
      css: answers.globalCss,
      baseColor: preset.baseColor,
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

/**
 * O código curto do preset, quando ele tiver um.
 *
 * Cor editada à mão não cabe em oito caracteres, e gravar um código que as
 * ignore diria que o projeto tem um design system que ele não tem. Nesses casos
 * o campo simplesmente não é escrito, e quem quiser o preset de volta usa o
 * arquivo.
 */
function presetCode(preset: Preset): string | undefined {
  try {
    return encodePreset(preset, presetCatalog()) ?? undefined;
  } catch {
    // Um id que o catálogo em mãos não conhece não impede o init de gravar o
    // resto: o preset já foi aplicado, e o código é só a forma curta dele.
    return undefined;
  }
}
