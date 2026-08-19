import { SOURCE_ICON_FAMILY } from '@cli/core/icons/index.js';
import { ConfigError } from '@cli/utils/errors.js';
import { access, readFile } from 'node:fs/promises';
import * as path from 'node:path';
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

/**
 * O design system que este projeto usa.
 *
 * Ausente em todo `components.json` escrito antes de `create`/`apply` existirem
 * — e é `presetOf` quem responde por eles, derivando o preset do que o arquivo
 * já dizia. Fechar os ids num enum seria o mesmo erro que `icons` evita: as
 * escolhas válidas são as que o registry publica em `presets.json` no momento da
 * execução, e não as que existiam quando esta CLI foi compilada.
 */
const presetConfigSchema = z.object({
  // Ausente quando o preset veio de arquivo com cores editadas à mão: essas não
  // cabem num código curto, e gravar um código que as ignora seria mentir sobre
  // o que o projeto tem.
  code: z.string().optional(),
  baseColor: z.string().default('neutral'),
  theme: z.string().default('neutral'),
  chart: z.string().default('default'),
  radius: z.string().default('default'),
  darkMode: z.enum(['class', 'off']).default('class'),
});

export type PresetConfig = z.infer<typeof presetConfigSchema>;

const configSchema = z.object({
  $schema: z.string().optional(),
  preset: presetConfigSchema.optional(),
  appConfigFile: z.string().default('src/app/app.config.ts'),
  style: z.enum(['css']).default('css'),
  // A família de ícones em que os componentes são gravados. Ausente nos
  // arquivos escritos antes da propriedade — e lucide é o que eles usam.
  //
  // Não é um enum: as famílias válidas são as que o registry publica no momento
  // da execução, e não as que existiam quando esta CLI foi compilada. Fechar a
  // lista aqui faria uma família nova ser recusada por uma CLI velha, que é
  // exatamente o que o catálogo remoto veio evitar. Quem valida o valor é
  // `assertIconFamily`, contra o catálogo, e com uma mensagem que diz quais são.
  icons: z.string().default(SOURCE_ICON_FAMILY),
  // Direção do layout. Ainda não muda o que é instalado: existe para o projeto
  // declarar a intenção, e para quem lê o arquivo saber que o campo é nosso.
  rtl: z.boolean().default(false),
  // Ausente nos components.json escritos antes do menu de tipo de projeto;
  // aplicação Angular é o que eles descrevem.
  projectType: z.enum(['angular', 'angular-library', 'nx', 'nx-library', 'analog']).default('angular'),
  packageManager: z.enum(['npm', 'yarn', 'pnpm', 'bun']).default('npm'),
  registryUrl: z.string().optional(),
  tailwind: z
    .object({
      css: z.string().default('src/styles.css'),
      baseColor: z.string().default('slate'),
    })
    .default({ css: 'src/styles.css', baseColor: 'slate' }),
  baseUrl: z.string().default('src/app'),
  aliases: z
    .object({
      components: z.string().default('@/shared/components'),
      utils: z.string().default('@/shared/utils'),
      core: z.string().default('@/shared/core'),
      services: z.string().default('@/shared/services'),
    })
    .default({
      components: '@/shared/components',
      utils: '@/shared/utils',
      core: '@/shared/core',
      services: '@/shared/services',
    }),
});

export type Config = z.infer<typeof configSchema>;

/**
 * O preset do projeto, inclusive quando o arquivo é anterior ao campo.
 *
 * Um `components.json` sem `preset` não é um projeto sem design system: é um
 * projeto cujo design system está descrito no que existia antes — o tom neutro
 * em `tailwind.baseColor`, sem destaque, no raio padrão. Derivar isso aqui é o
 * que faz `preset resolve` devolver um código para quem nunca rodou `apply`.
 */
export function presetOf(config: Config): PresetConfig {
  return (
    config.preset ?? {
      baseColor: config.tailwind.baseColor,
      theme: 'neutral',
      chart: 'default',
      radius: 'default',
      darkMode: 'class',
    }
  );
}

export const DEFAULT_CONFIG: Config = {
  style: 'css',
  preset: {
    baseColor: 'neutral',
    theme: 'neutral',
    chart: 'default',
    radius: 'default',
    darkMode: 'class',
  },
  icons: SOURCE_ICON_FAMILY,
  rtl: false,
  projectType: 'angular',
  appConfigFile: 'src/app/app.config.ts',
  packageManager: 'npm',
  tailwind: {
    css: 'src/styles.css',
    baseColor: 'slate',
  },
  baseUrl: 'src/app',
  aliases: {
    components: '@/shared/components',
    utils: '@/shared/utils',
    core: '@/shared/core',
    services: '@/shared/services',
  },
};

export async function getConfig(cwd: string): Promise<Config | null> {
  const configPath = path.resolve(cwd, 'components.json');

  if (!(await pathExists(configPath))) {
    return null;
  }

  try {
    const configJson = await readJson(configPath);
    const config = configSchema.parse(configJson);

    if (config.registryUrl) {
      const { validateRegistryUrl } = await import('@cli/utils/registry.js');
      validateRegistryUrl(config.registryUrl);
    }

    return config;
  } catch (error) {
    if (error instanceof ConfigError) throw error;
    throw new ConfigError('Invalid configuration file: components.json');
  }
}

/**
 * Separa o prefixo do alias do caminho que vem depois dele.
 *
 * `@`, `@app`, `~` — o nome não importa: o prefixo é um apelido para `baseUrl`,
 * e o resto é o caminho dentro do projeto. Tratar só `@/` fazia um alias como
 * `@app/components` escapar da substituição e virar uma pasta literal chamada
 * `@app` na raiz, fora de qualquer coisa que o tsconfig mapeie.
 */
export function splitAlias(alias: string): { prefix: string; rest: string } {
  const clean = alias.replace(/\/+$/, '');
  const separator = clean.indexOf('/');

  if (separator === -1) return { prefix: clean, rest: '' };

  return { prefix: clean.slice(0, separator), rest: clean.slice(separator + 1) };
}

/** O prefixo do alias, com `/*` — a chave que o tsconfig precisa mapear. */
export function aliasPattern(alias: string): string {
  return `${splitAlias(alias).prefix}/*`;
}

export function resolveAliasToPath(alias: string, baseUrl: string): string {
  const { rest } = splitAlias(alias);
  const base = baseUrl.replace(/\/+$/, '');

  return rest ? `${base}/${rest}` : base;
}

export async function resolveConfigPaths(cwd: string, config: Config) {
  const { baseUrl, aliases } = config;

  return {
    ...config,
    resolvedPaths: {
      tailwindCss: path.resolve(cwd, config.tailwind.css),
      baseUrl: path.resolve(cwd, baseUrl),
      components: path.resolve(cwd, resolveAliasToPath(aliases.components, baseUrl)),
      utils: path.resolve(cwd, resolveAliasToPath(aliases.utils, baseUrl)),
      core: path.resolve(cwd, resolveAliasToPath(aliases.core, baseUrl)),
      services: path.resolve(cwd, resolveAliasToPath(aliases.services, baseUrl)),
    },
  };
}
