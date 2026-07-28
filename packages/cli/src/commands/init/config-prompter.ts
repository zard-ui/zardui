import { type Config } from '@cli/utils/config.js';
import { type ProjectInfo } from '@cli/utils/get-project-info.js';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import * as path from 'node:path';
import { z } from 'zod';

export const SCHEMA_URL = 'https://zardui.com/schema.json';

export const configSchema = z.object({
  $schema: z.string(),
  style: z.enum(['css']),
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
  appConfig: string;
  theme: string;
  globalCss: string;
  componentsAlias: string;
  utilsAlias: string;
}

export function defaultAnswers(projectInfo: ProjectInfo): InitAnswers {
  return {
    appConfig: projectInfo.hasNx ? 'apps/[app]/src/app/app.config.ts' : 'src/app/app.config.ts',
    theme: 'neutral',
    globalCss: projectInfo.hasNx ? 'apps/[app]/src/styles.css' : 'src/styles.css',
    componentsAlias: '@/shared/components',
    utilsAlias: '@/shared/utils',
  };
}

/**
 * De onde os componentes são escritos, deduzido do `app.config.ts`.
 *
 * Fixar `src/app` quebrava todo layout que não fosse app único na raiz: o
 * próprio wizard sugere `apps/[app]/src/app/app.config.ts` para workspace, e os
 * componentes acabavam num `src/app` na raiz que não pertence a projeto nenhum.
 * O diretório do app.config é exatamente a raiz do código do app.
 */
export function deriveBaseUrl(appConfigFile: string): string {
  const dir = path.dirname(appConfigFile).replace(/\\/g, '/');
  return dir === '.' ? 'src/app' : dir;
}

export function buildConfig(answers: InitAnswers, packageManager: 'npm' | 'yarn' | 'pnpm' | 'bun'): Config {
  const sharedBase = path.dirname(answers.componentsAlias).replace(/\\/g, '/');

  return configSchema.parse({
    $schema: SCHEMA_URL,
    style: 'css',
    appConfigFile: answers.appConfig,
    packageManager,
    tailwind: {
      css: answers.globalCss,
      baseColor: answers.theme,
    },
    baseUrl: deriveBaseUrl(answers.appConfig),
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
