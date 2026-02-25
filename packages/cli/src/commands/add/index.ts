import { installComponent, validateTargetPath } from '@cli/commands/add/component-installer.js';
import { selectComponents } from '@cli/commands/add/component-selector.js';
import { updateProvideZardWithDarkMode } from '@cli/commands/add/dark-mode-setup.js';
import { resolveDependencies, getTargetDir, type ComponentMeta } from '@cli/commands/add/dependency-resolver.js';
import { injectThemeScript } from '@cli/commands/init/theme-loader.js';
import { getConfig, resolveConfigPaths } from '@cli/utils/config.js';
import { CliError } from '@cli/utils/errors.js';
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

    if (options.path) {
      validateTargetPath(path.resolve(cwd, options.path), cwd);
    }

    const config = await loadConfiguration(cwd);
    const projectInfo = await validateProject(cwd);
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

    const resolvedDeps = resolveCompatibleVersions(dependenciesToInstall, projectInfo.angularVersion);

    if (projectInfo.angularVersionRaw && /-(rc|next|canary)/.test(projectInfo.angularVersionRaw)) {
      logger.warn(
        `You are using a pre-release version of Angular (${projectInfo.angularVersionRaw}). Some dependencies may have compatibility issues.`,
      );
    }

    if (!options.yes) {
      const shouldProceed = await confirmInstallation(componentsToInstall.length, resolvedDeps.length);
      if (!shouldProceed) {
        process.exit(0);
      }
    }

    await installDependencies(resolvedDeps, cwd, config.packageManager);
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
    throw new CliError(`The path ${cwd} does not exist. Please try again.`, 'INVALID_CWD');
  }
}

async function loadConfiguration(cwd: string) {
  const config = await getConfig(cwd);

  if (!config) {
    throw new CliError('Configuration not found. Please run `ngzard init` first.', 'CONFIG_NOT_FOUND');
  }

  return config;
}

async function validateProject(cwd: string) {
  const projectInfo = await getProjectInfo(cwd);

  if (projectInfo.framework !== 'angular') {
    throw new CliError('This project does not appear to be an Angular project.', 'NOT_ANGULAR');
  }

  return projectInfo;
}

async function confirmInstallation(componentsCount: number, depsCount: number): Promise<boolean> {
  const { proceed } = await prompts({
    type: 'confirm',
    name: 'proceed',
    message: `Ready to install ${componentsCount} component(s) and ${depsCount} dependencies. Proceed?`,
    initial: true,
  });

  return proceed;
}

const ANGULAR_VERSION_PACKAGES = ['embla-carousel-angular'];

function resolveCompatibleVersions(dependencies: Set<string>, angularVersion: string | null): string[] {
  const angularMajor = angularVersion ? parseInt(angularVersion.split('.')[0], 10) : null;

  return Array.from(dependencies).map(dep => {
    if (angularMajor && ANGULAR_VERSION_PACKAGES.includes(dep)) {
      return `${dep}@^${angularMajor}.0.0`;
    }
    return dep;
  });
}

async function installDependencies(
  packages: string[],
  cwd: string,
  packageManager: 'npm' | 'yarn' | 'pnpm' | 'bun',
): Promise<void> {
  if (packages.length === 0) return;

  const depsSpinner = spinner('Installing dependencies...').start();
  try {
    await installPackages(packages, cwd, packageManager, false);
  } catch {
    depsSpinner.text = 'Retrying with --legacy-peer-deps...';
    await installPackages(packages, cwd, packageManager, false, true);
  }
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
      logger.debug(`Failed to install ${component.name}: ${error instanceof Error ? error.message : error}`);
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
    logger.debug(`Dark mode error: ${error instanceof Error ? error.message : error}`);
  }
}
