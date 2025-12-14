import { logger } from '@cli/utils/logger.js';
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
  packageManager: z.enum(['npm', 'yarn', 'pnpm', 'bun']).default('npm'),
  registryUrl: z.string().optional(),
  tailwind: z
    .object({
      css: z.string().default('src/styles.css'),
      baseColor: z.string().default('slate'),
    })
    .default({}),
  baseUrl: z.string().default('src/app'),
  aliases: z
    .object({
      components: z.string().default('@/shared/components'),
      utils: z.string().default('@/shared/utils'),
      core: z.string().default('@/shared/core'),
      services: z.string().default('@/shared/services'),
    })
    .default({}),
});

export type Config = z.infer<typeof configSchema>;

export const DEFAULT_CONFIG: Config = {
  style: 'css',
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
    return configSchema.parse(configJson);
  } catch (error) {
    logger.error('Invalid configuration file');
    throw error;
  }
}

export function resolveAliasToPath(alias: string, baseUrl: string): string {
  return alias.replace(/^@\//, `${baseUrl}/`);
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
