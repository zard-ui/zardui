import { existsSync } from 'fs';
import { Command } from 'commander';
import prompts from 'prompts';
import * as path from 'path';

import { getConfig, resolveConfigPaths } from '@cli/utils/config.js';
import { installPackages } from '@cli/utils/package-manager.js';
import { getProjectInfo } from '@cli/utils/get-project-info.js';
import { logger, spinner } from '@cli/utils/logger.js';
import { selectComponents } from '@cli/commands/add/component-selector.js';
import { resolveDependencies } from '@cli/commands/add/dependency-resolver.js';
import { installComponent } from '@cli/commands/add/component-installer.js';

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
    const projectInfo = await validateProject(cwd);
    const resolvedConfig = await resolveConfigPaths(cwd, config);

    const selectedComponents = await selectComponents(components, options.all);

    const { componentsToInstall, dependenciesToInstall } = resolveDependencies(selectedComponents, resolvedConfig, cwd, options);

    if (!options.yes) {
      const shouldProceed = await confirmInstallation(componentsToInstall.length, dependenciesToInstall.size);
      if (!shouldProceed) {
        process.exit(0);
      }
    }

    await installDependencies(dependenciesToInstall, cwd, config.packageManager);

    await installComponents(componentsToInstall, cwd, resolvedConfig, options);

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
    logger.error('Configuration not found. Please run `zard init` first.');
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

async function installDependencies(dependenciesToInstall: Set<string>, cwd: string, packageManager: 'npm' | 'yarn' | 'pnpm' | 'bun'): Promise<void> {
  if (dependenciesToInstall.size === 0) return;

  const depsSpinner = spinner('Installing dependencies...').start();
  await installPackages(Array.from(dependenciesToInstall), cwd, packageManager, false);
  depsSpinner.succeed();
}

async function installComponents(componentsToInstall: any[], cwd: string, resolvedConfig: any, options: { path?: string; overwrite?: boolean }): Promise<void> {
  for (const component of componentsToInstall) {
    const componentSpinner = spinner(`Installing ${component.name}...`).start();

    try {
      const targetDir = options.path ? path.resolve(cwd, options.path, component.name) : path.resolve(resolvedConfig.resolvedPaths.components, component.name);

      await installComponent(component, targetDir, resolvedConfig, options.overwrite || false);
      componentSpinner.succeed(`Added ${component.name}`);
    } catch (error) {
      componentSpinner.fail(`Failed to install ${component.name}`);
      logger.error(error);
    }
  }
}
