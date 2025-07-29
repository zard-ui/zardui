import fs from 'fs-extra';
import path from 'path';
import { z } from 'zod';

import { logger } from './logger.js';

const configSchema = z.object({
  $schema: z.string().optional(),
  style: z.enum(['css', 'scss']).default('css'),
  tsx: z.boolean().default(false),
  tailwind: z
    .object({
      config: z.string().default('tailwind.config.js'),
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
  tsx: false,
  tailwind: {
    config: 'tailwind.config.js',
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
  const configPath = path.resolve(cwd, 'zard.config.json');

  if (!(await fs.pathExists(configPath))) {
    return null;
  }

  try {
    const configJson = await fs.readJson(configPath);
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
      tailwindConfig: path.resolve(cwd, config.tailwind.config),
      tailwindCss: path.resolve(cwd, config.tailwind.css),
      components: path.resolve(cwd, config.aliases.components),
      utils: path.resolve(cwd, config.aliases.utils),
    },
  };
}
