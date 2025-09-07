import * as commentJson from 'comment-json';
import { Command } from 'commander';
import { existsSync } from 'fs';
import prompts from 'prompts';
import fs from 'fs-extra';
import chalk from 'chalk';
import path from 'path';
import { z } from 'zod';
import ora from 'ora';

import { UTILS, POSTCSS_CONFIG } from '../utils/templates.js';
import { DEFAULT_CONFIG, type Config } from '../utils/config.js';
import { getProjectInfo } from '../utils/get-project-info.js';
import { logger, spinner } from '../utils/logger.js';
import { installPackages, getPackageManager } from '../utils/package-manager.js';
import { getAvailableThemes, getThemeContent, getThemeDisplayName } from '../utils/themes.js';

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
        message: 'Write configuration to components.json?',
        initial: true,
      });

      if (!proceed) {
        process.exit(0);
      }
    }

    const configSpinner = spinner('Writing configuration...').start();
    await fs.writeFile(path.resolve(cwd, 'components.json'), JSON.stringify(config, null, 2), 'utf8');
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
    const packageManager = await getPackageManager(cwd);
    const runCommand = packageManager === 'npm' ? 'npx' : packageManager === 'yarn' ? 'yarn dlx' : `${packageManager}x`;

    logger.info('You can now add components using:');
    logger.info(chalk.bold(`  ${runCommand} @ngzard/ui add [component]`));
    logger.break();
  });

async function promptForConfig(cwd: string, projectInfo: any): Promise<Config> {
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
      initial: 0, // neutral as default
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

  // Verify CSS file exists
  const cssPath = path.join(cwd, options.tailwindCss);
  if (!existsSync(cssPath)) {
    logger.error(`CSS file not found at: ${options.tailwindCss}`);
    logger.error('Please ensure your CSS file exists before continuing.');
    process.exit(1);
  }

  // Check if CSS file has existing content
  const existingContent = await fs.readFile(cssPath, 'utf8');
  let shouldOverwrite = false;

  if (existingContent.trim().length > 0) {
    const { overwrite } = await prompts({
      type: 'confirm',
      name: 'overwrite',
      message: `Your CSS file already has content. This will overwrite everything with ZardUI theme configuration. Continue?`,
      initial: false,
    });

    if (!overwrite) {
      logger.info('Installation cancelled.');
      process.exit(0);
    }
    shouldOverwrite = true;
  }

  const config = configSchema.parse({
    style: 'css', // Fixed to CSS for TailwindV4
    tailwind: {
      css: options.tailwindCss,
      baseColor: options.theme,
      cssVariables: true, // Always true for ZardUI theme
    },
    aliases: {
      components: options.components,
      utils: options.utils,
    },
    theme: options.theme, // Store selected theme
  });

  return config;
}

const configSchema = z.object({
  style: z.enum(['css']), // Only CSS for TailwindV4
  tailwind: z.object({
    css: z.string(),
    baseColor: z.string(),
    cssVariables: z.boolean(),
  }),
  aliases: z.object({
    components: z.string(),
    utils: z.string(),
  }),
  theme: z.string().optional(), // Selected theme
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
    await installPackages(deps, cwd, false);
  } catch (error) {
    // If installation fails due to peer deps, retry with --legacy-peer-deps (npm only)
    logger.warn('Installation failed, retrying with --legacy-peer-deps...');
    await installPackages(deps, cwd, false, true);
  }

  try {
    await installPackages(devDeps, cwd, true);
  } catch (error) {
    await installPackages(devDeps, cwd, true, true);
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

  // Apply selected theme to styles.css
  const stylesPath = path.join(cwd, config.tailwind.css);
  const selectedTheme = config.theme || 'neutral';
  const themeContent = getThemeContent(selectedTheme);
  await fs.writeFile(stylesPath, themeContent, 'utf8');
  logger.info(`Applied ${getThemeDisplayName(selectedTheme)} theme configuration to your CSS file`);
}

export async function createUtils(cwd: string, config: Config) {
  const utilsPath = path.join(cwd, config.aliases.utils);

  if (!existsSync(utilsPath)) {
    await fs.mkdir(utilsPath, { recursive: true });
  }

  for (const [fileName, content] of Object.entries(UTILS)) {
    const filePath = path.join(utilsPath, `${fileName}.ts`);

    if (!existsSync(filePath)) {
      await fs.writeFile(filePath, content.trim(), 'utf8');
    }
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
