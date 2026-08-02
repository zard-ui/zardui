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

const configSchema = z.object({
  $schema: z.string().optional(),
  appConfigFile: z.string().default('src/app/app.config.ts'),
  style: z.enum(['css']).default('css'),
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

export const DEFAULT_CONFIG: Config = {
  style: 'css',
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
