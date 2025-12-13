import { Config } from '@cli/utils/config.js';
import { ProjectInfo } from '@cli/utils/get-project-info';
import { logger } from '@cli/utils/logger.js';
import { getAvailableThemes, getThemeDisplayName } from '@cli/utils/theme-selector.js';
import chalk from 'chalk';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import * as path from 'node:path';
import prompts from 'prompts';
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

export async function promptForConfig(
  cwd: string,
  projectInfo: ProjectInfo,
  packageManager: 'npm' | 'yarn' | 'pnpm' | 'bun',
): Promise<Config> {
  const highlight = (text: string) => chalk.cyan(text);

  const options = await prompts([
    {
      type: 'text',
      name: 'app.config',
      message: `Where is your ${highlight('app.config.ts')} file?`,
      initial: projectInfo.hasNx ? 'apps/[app]/src/app/app.config.ts' : 'src/app/app.config.ts',
    },
    {
      type: 'select',
      name: 'theme',
      message: `Choose a ${highlight('theme')} for your components:`,
      choices: getAvailableThemes().map(theme => ({
        title: getThemeDisplayName(theme),
        value: theme,
      })),
      initial: 0,
    },
    {
      type: 'text',
      name: 'tailwindCss',
      message: `Where is your ${highlight('global CSS')} file?`,
      initial: projectInfo.hasNx ? 'apps/[app]/src/styles.css' : 'src/styles.css',
    },
    {
      type: 'text',
      name: 'components',
      message: `Configure the import alias for ${highlight('components')}:`,
      initial: '@/shared/components',
    },
    {
      type: 'text',
      name: 'utils',
      message: `Configure the import alias for ${highlight('utils')}:`,
      initial: '@/shared/utils',
    },
  ]);

  await validateCssFile(cwd, options.tailwindCss);

  const componentsAlias = options.components;
  const utilsAlias = options.utils;
  const sharedBase = path.dirname(componentsAlias);

  const config = configSchema.parse({
    $schema: SCHEMA_URL,
    style: 'css',
    appConfigFile: options['app.config'],
    packageManager,
    tailwind: {
      css: options.tailwindCss,
      baseColor: options.theme,
    },
    baseUrl: 'src/app',
    aliases: {
      components: componentsAlias,
      utils: utilsAlias,
      core: `${sharedBase}/core`,
      services: `${sharedBase}/services`,
    },
  });

  return config;
}

async function validateCssFile(cwd: string, tailwindCss: string): Promise<void> {
  const cssPath = path.join(cwd, tailwindCss);

  if (!existsSync(cssPath)) {
    logger.error(`CSS file not found at: ${tailwindCss}`);
    logger.error('Please ensure your CSS file exists before continuing.');
    process.exit(1);
  }

  const existingContent = await readFile(cssPath, 'utf8');

  if (existingContent.trim().length > 0) {
    const { overwrite } = await prompts({
      type: 'confirm',
      name: 'overwrite',
      message: `Your CSS file already has content. This will overwrite everything with ZardUI theme configuration. Continue?`,
      initial: true,
    });

    if (!overwrite) {
      logger.info('Installation cancelled.');
      process.exit(0);
    }
  }
}
