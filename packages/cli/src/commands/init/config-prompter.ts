import chalk from 'chalk';
import { existsSync } from 'fs';
import { readFile } from 'node:fs/promises';
import * as path from 'path';
import * as prompts from 'prompts';
import { z } from 'zod';

import { Config } from '@cli/utils/config.js';
import { logger } from '@cli/utils/logger.js';
import { getAvailableThemes, getThemeDisplayName } from '@cli/utils/theme-selector.js';

export const configSchema = z.object({
  style: z.enum(['css']),
  packageManager: z.enum(['npm', 'yarn', 'pnpm', 'bun']),
  tailwind: z.object({
    css: z.string(),
    baseColor: z.string(),
    cssVariables: z.boolean(),
  }),
  aliases: z.object({
    components: z.string(),
    utils: z.string(),
  }),
});

export async function promptForConfig(cwd: string, projectInfo: any, packageManager: 'npm' | 'yarn' | 'pnpm' | 'bun'): Promise<Config> {
  const highlight = (text: string) => chalk.cyan(text);

  const options = await prompts([
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
      initial: projectInfo.hasNx ? 'libs/ui/src/lib/components' : 'src/app/shared/components',
    },
    {
      type: 'text',
      name: 'utils',
      message: `Configure the import alias for ${highlight('utils')}:`,
      initial: projectInfo.hasNx ? 'libs/ui/src/lib/utils' : 'src/app/shared/utils',
    },
  ]);

  await validateCssFile(cwd, options.tailwindCss);

  const config = configSchema.parse({
    style: 'css',
    packageManager,
    tailwind: {
      css: options.tailwindCss,
      baseColor: options.theme,
      cssVariables: true,
    },
    aliases: {
      components: options.components,
      utils: options.utils,
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
