import { Command } from 'commander';
import { existsSync } from 'fs';
import fs from 'fs-extra';
import path from 'path';
import prompts from 'prompts';
import { execa } from 'execa';
import chalk from 'chalk';
import ora from 'ora';
import { z } from 'zod';
import * as commentJson from 'comment-json';

import { DEFAULT_CONFIG, type Config } from '../utils/config.js';
import { getProjectInfo } from '../utils/get-project-info.js';
import { logger, spinner } from '../utils/logger.js';
import { UTILS, POSTCSS_CONFIG, STYLES_WITH_VARIABLES } from '../utils/templates.js';

export const init = new Command()
  .name('init')
  .description('initialize your project and install dependencies')
  .option('-y, --yes', 'skip confirmation prompt.', false)
  .option('-c, --cwd <cwd>', 'the working directory. defaults to the current directory.', process.cwd())
  .action(async options => {
    const cwd = path.resolve(options.cwd);

    if (!existsSync(cwd)) {
      logger.error(`The path ${cwd} does not exist. Please try again.`);
      process.exit(1);
    }

    const projectInfo = await getProjectInfo(cwd);

    if (projectInfo.framework !== 'angular') {
      logger.error('This project does not appear to be an Angular project.');
      logger.error('Please run this command in an Angular project.');
      process.exit(1);
    }

    logger.info('Initializing ZardUI...');
    logger.break();

    const config = await promptForConfig(cwd, projectInfo);

    if (!options.yes) {
      const { proceed } = await prompts({
        type: 'confirm',
        name: 'proceed',
        message: 'Write configuration to zard.config.json?',
        initial: true,
      });

      if (!proceed) {
        process.exit(0);
      }
    }

    const configSpinner = spinner('Writing configuration...').start();
    await fs.writeFile(path.resolve(cwd, 'zard.config.json'), JSON.stringify(config, null, 2), 'utf8');
    configSpinner.succeed();

    const dependenciesSpinner = spinner('Installing dependencies...').start();
    await installDependencies(cwd, config);
    dependenciesSpinner.succeed();

    if (!projectInfo.hasTailwind) {
      const tailwindSpinner = spinner('Setting up Tailwind CSS...').start();
      await setupTailwind(cwd, config);
      tailwindSpinner.succeed();
    }

    const utilsSpinner = spinner('Creating utils...').start();
    await createUtils(cwd, config);
    utilsSpinner.succeed();

    const tsconfigSpinner = spinner('Updating tsconfig.json...').start();
    await updateTsConfig(cwd, config);
    tsconfigSpinner.succeed();

    logger.break();
    logger.success('ZardUI has been initialized successfully!');
    logger.break();
    logger.info('You can now add components using:');
    logger.info(chalk.bold('  npx zard add [component]'));
    logger.break();
  });

async function promptForConfig(cwd: string, projectInfo: any): Promise<Config> {
  const highlight = (text: string) => chalk.cyan(text);

  const options = await prompts([
    {
      type: 'toggle',
      name: 'typescript',
      message: `Would you like to use ${highlight('TypeScript')}? (recommended)`,
      initial: projectInfo.hasTypeScript,
      active: 'yes',
      inactive: 'no',
    },
    {
      type: 'select',
      name: 'style',
      message: `Which ${highlight('style')} would you like to use?`,
      choices: [
        { title: 'CSS', value: 'css' },
        { title: 'SCSS', value: 'scss' },
      ],
    },
    {
      type: 'text',
      name: 'tailwindCss',
      message: `Where is your ${highlight('global CSS')} file?`,
      initial: projectInfo.hasNx ? 'apps/[app]/src/styles.css' : 'src/styles.css',
    },
    {
      type: 'toggle',
      name: 'tailwindCssVariables',
      message: `Would you like to use ${highlight('CSS variables')} for colors?`,
      initial: true,
      active: 'yes',
      inactive: 'no',
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

  const config = configSchema.parse({
    style: options.style,
    tsx: false,
    tailwind: {
      config: 'tailwind.config.js', // Not used in v4 but keep for compatibility
      css: options.tailwindCss,
      baseColor: 'slate',
      cssVariables: options.tailwindCssVariables,
    },
    aliases: {
      components: options.components,
      utils: options.utils,
    },
  });

  return config;
}

const configSchema = z.object({
  style: z.enum(['css', 'scss']),
  tsx: z.boolean(),
  tailwind: z.object({
    config: z.string(),
    css: z.string(),
    baseColor: z.string(),
    cssVariables: z.boolean(),
  }),
  aliases: z.object({
    components: z.string(),
    utils: z.string(),
  }),
});

async function installDependencies(cwd: string, config: Config) {
  const projectInfo = await getProjectInfo(cwd);

  // Determine CDK version based on Angular version
  let cdkVersion = '@angular/cdk';
  if (projectInfo.angularVersion) {
    const majorVersion = parseInt(projectInfo.angularVersion.split('.')[0]);
    if (majorVersion === 19) {
      cdkVersion = '@angular/cdk@^19.0.0';
    } else if (majorVersion === 18) {
      cdkVersion = '@angular/cdk@^18.0.0';
    } else if (majorVersion === 17) {
      cdkVersion = '@angular/cdk@^17.0.0';
    }
  }

  const deps = [cdkVersion, 'class-variance-authority', 'clsx', 'tailwind-merge', 'lucide-angular'];

  const devDeps = ['tailwindcss', '@tailwindcss/postcss', 'postcss', 'tailwindcss-animate'];

  try {
    await execa('npm', ['install', ...deps], { cwd });
  } catch (error) {
    // If installation fails due to peer deps, retry with --legacy-peer-deps
    logger.warn('Installation failed, retrying with --legacy-peer-deps...');
    await execa('npm', ['install', '--legacy-peer-deps', ...deps], { cwd });
  }

  try {
    await execa('npm', ['install', '-D', ...devDeps], { cwd });
  } catch (error) {
    await execa('npm', ['install', '-D', '--legacy-peer-deps', ...devDeps], { cwd });
  }
}

async function setupTailwind(cwd: string, config: Config) {
  // Create .postcssrc.json for Tailwind v4
  const postcssConfigPath = path.join(cwd, '.postcssrc.json');

  if (!existsSync(postcssConfigPath)) {
    await fs.writeFile(postcssConfigPath, POSTCSS_CONFIG, 'utf8');
  } else {
    // Check if existing config needs updating for Tailwind v4
    const existingConfig = await fs.readFile(postcssConfigPath, 'utf8');
    if (!existingConfig.includes('@tailwindcss/postcss')) {
      logger.info('Updating existing .postcssrc.json for Tailwind CSS v4');
      await fs.writeFile(postcssConfigPath, POSTCSS_CONFIG, 'utf8');
    }
  }

  // Update styles.css with Tailwind v4 configuration
  const stylesPath = path.join(cwd, config.tailwind.css);

  if (config.tailwind.cssVariables && existsSync(stylesPath)) {
    const currentStyles = await fs.readFile(stylesPath, 'utf8');

    // Check if already has Tailwind import
    if (!currentStyles.includes('@import "tailwindcss"') && !currentStyles.includes("@import 'tailwindcss'")) {
      await fs.writeFile(stylesPath, STYLES_WITH_VARIABLES, 'utf8');
    }
  } else if (config.tailwind.cssVariables) {
    // Create styles.css if it doesn't exist
    await fs.writeFile(stylesPath, STYLES_WITH_VARIABLES, 'utf8');
  }
}

async function createUtils(cwd: string, config: Config) {
  const utilsPath = path.join(cwd, config.aliases.utils);

  if (!existsSync(utilsPath)) {
    await fs.mkdir(utilsPath, { recursive: true });
  }

  const mergeClassesPath = path.join(utilsPath, 'merge-classes.ts');

  if (!existsSync(mergeClassesPath)) {
    await fs.writeFile(mergeClassesPath, UTILS.mergeClasses, 'utf8');
  }
}

async function updateTsConfig(cwd: string, config: Config) {
  const tsconfigPath = path.join(cwd, 'tsconfig.json');

  if (!existsSync(tsconfigPath)) {
    logger.warn('tsconfig.json not found, skipping path configuration');
    return;
  }

  try {
    // Read the file as text to preserve comments
    const tsconfigContent = await fs.readFile(tsconfigPath, 'utf8');

    // Parse JSON with comments
    const tsconfig = commentJson.parse(tsconfigContent) as any;

    // Ensure compilerOptions exists
    if (!tsconfig.compilerOptions) {
      tsconfig.compilerOptions = {};
    }

    // Add baseUrl if not present
    if (!tsconfig.compilerOptions.baseUrl) {
      tsconfig.compilerOptions.baseUrl = './';
    }

    // Ensure paths exists
    if (!tsconfig.compilerOptions.paths) {
      tsconfig.compilerOptions.paths = {};
    }

    // Add or update path mappings - simplified to use @shared/*
    const pathMappings = {
      '@shared/*': ['src/app/shared/*'],
    };

    // Merge with existing paths
    tsconfig.compilerOptions.paths = {
      ...tsconfig.compilerOptions.paths,
      ...pathMappings,
    };

    // Write back the updated tsconfig preserving comments
    const updatedContent = commentJson.stringify(tsconfig, null, 2);
    await fs.writeFile(tsconfigPath, updatedContent, 'utf8');
  } catch (error) {
    logger.warn('Failed to update tsconfig.json paths');
    logger.error(error);
  }
}
