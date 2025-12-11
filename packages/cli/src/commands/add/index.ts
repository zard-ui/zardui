import { installComponent } from '@cli/commands/add/component-installer.js';
import { selectComponents } from '@cli/commands/add/component-selector.js';
import { updateProvideZardWithDarkMode } from '@cli/commands/add/dark-mode-setup.js';
import { resolveDependencies, getTargetDir, type ComponentMeta } from '@cli/commands/add/dependency-resolver.js';
import { injectThemeScript } from '@cli/commands/init/theme-loader.js';
import { getConfig, resolveConfigPaths } from '@cli/utils/config.js';
import { getProjectInfo } from '@cli/utils/get-project-info.js';
import { logger, spinner } from '@cli/utils/logger.js';
import { installPackages } from '@cli/utils/package-manager.js';
import chalk from 'chalk';
import { Command } from 'commander';
import { existsSync } from 'node:fs';
import * as path from 'node:path';
import prompts from 'prompts';

export const add = new Command()
  .name('add')
  .description('add a component to your project')
  .argument('[components...]', 'the components to add')
  .option('-y, --yes', 'skip confirmation prompt.', false)
  .option('-o, --overwrite', 'overwrite existing files.', false)
  .option('-c, --cwd <cwd>', 'the working directory. defaults to the current directory.', process.cwd())
  .option('-a, --all', 'add all available components', false)
  .option('-p, --path <path>', 'the path to add the component to.')
  .action(async (components, options) => {
    const cwd = path.resolve(options.cwd);

    validateWorkingDirectory(cwd);

    const config = await loadConfiguration(cwd);
    await validateProject(cwd);
    const resolvedConfig = await resolveConfigPaths(cwd, config);

    const selectedComponents = await selectComponents(components, options.all);

    const addSpinner = spinner('Resolving components...').start();
    const { componentsToInstall, dependenciesToInstall } = await resolveDependencies(
      selectedComponents,
      resolvedConfig,
      cwd,
      options,
    );
    addSpinner.stop();

    if (componentsToInstall.length === 0) {
      logger.info('All components already installed.');
      return;
    }

    if (!options.yes) {
      const shouldProceed = await confirmInstallation(componentsToInstall.length, dependenciesToInstall.size);
      if (!shouldProceed) {
        process.exit(0);
      }
    }

    await installDependencies(dependenciesToInstall, cwd, config.packageManager);
    await installComponents(componentsToInstall, cwd, resolvedConfig, options);

    const isDarkModeBeingInstalled = componentsToInstall.some(c => c.name === 'dark-mode');
    if (isDarkModeBeingInstalled) {
      await setupDarkMode(cwd, resolvedConfig);
    }

    logger.break();
    logger.success('Done!');
  });

function validateWorkingDirectory(cwd: string): void {
  if (!existsSync(cwd)) {
    logger.error(`The path ${cwd} does not exist. Please try again.`);
    process.exit(1);
  }
}

async function loadConfiguration(cwd: string) {
  const config = await getConfig(cwd);

  if (!config) {
    logger.error('Configuration not found. Please run `ngzard init` first.');
    process.exit(1);
  }

  return config;
}

async function validateProject(cwd: string) {
  const projectInfo = await getProjectInfo(cwd);

  if (projectInfo.framework !== 'angular') {
    logger.error('This project does not appear to be an Angular project.');
    process.exit(1);
  }

  return projectInfo;
}

async function confirmInstallation(componentsCount: number, dependenciesCount: number): Promise<boolean> {
  const { proceed } = await prompts({
    type: 'confirm',
    name: 'proceed',
    message: `Ready to install ${componentsCount} component(s) and ${dependenciesCount} dependencies. Proceed?`,
    initial: true,
  });

  return proceed;
}

async function installDependencies(
  dependenciesToInstall: Set<string>,
  cwd: string,
  packageManager: 'npm' | 'yarn' | 'pnpm' | 'bun',
): Promise<void> {
  if (dependenciesToInstall.size === 0) return;

  const depsSpinner = spinner('Installing dependencies...').start();
  await installPackages(Array.from(dependenciesToInstall), cwd, packageManager, false);
  depsSpinner.succeed('Dependencies installed');
}

async function installComponents(
  componentsToInstall: ComponentMeta[],
  cwd: string,
  resolvedConfig: any,
  options: { path?: string },
): Promise<void> {
  const installSpinner = spinner('Installing components...').start();
  const installed: string[] = [];
  const failed: string[] = [];

  for (const component of componentsToInstall) {
    try {
      installSpinner.text = `Installing ${component.name}...`;

      const targetDir = getTargetDir(component, resolvedConfig, cwd, options.path);

      await installComponent(component.name, targetDir, resolvedConfig);
      installed.push(component.name);
    } catch (error) {
      failed.push(component.name);
    }
  }

  if (failed.length > 0) {
    installSpinner.fail(`Failed to install: ${failed.join(', ')}`);
  } else {
    installSpinner.succeed(`Installed ${installed.length} component${installed.length > 1 ? 's' : ''}`);
  }
}

async function setupDarkMode(cwd: string, resolvedConfig: any): Promise<void> {
  logger.break();
  logger.info('Dark mode requires additional configuration.');

  const { indexFile } = await prompts({
    type: 'text',
    name: 'indexFile',
    message: `Where is your ${chalk.cyan('index.html')} file?`,
    initial: 'src/index.html',
  });

  if (!indexFile) {
    logger.warn('Skipping dark mode script injection.');
    return;
  }

  const darkModeSpinner = spinner('Configuring dark mode...').start();

  try {
    await injectThemeScript(cwd, indexFile);
    await updateProvideZardWithDarkMode(cwd, resolvedConfig);
    darkModeSpinner.succeed('Dark mode configured');
  } catch (error) {
    darkModeSpinner.fail('Failed to configure dark mode');
    logger.error(error);
  }
}
