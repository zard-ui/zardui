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
  tailwind: z
    .object({
      css: z.string().default('src/styles.css'),
      baseColor: z.string().default('slate'),
      cssVariables: z.boolean().default(true),
    })
    .default({}),
  aliases: z
    .object({
      components: z.string().default('src/app/shared/components'),
      utils: z.string().default('src/app/shared/utils'),
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
    cssVariables: true,
  },
  aliases: {
    components: 'src/app/shared/components',
    utils: 'src/app/shared/utils',
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

export async function resolveConfigPaths(cwd: string, config: Config) {
  return {
    ...config,
    resolvedPaths: {
      tailwindCss: path.resolve(cwd, config.tailwind.css),
      components: path.resolve(cwd, config.aliases.components),
      utils: path.resolve(cwd, config.aliases.utils),
    },
  };
}
