import { promptForConfig } from '@cli/commands/init/config-prompter.js';
import { installDependencies } from '@cli/commands/init/dependencies.js';
import { setupTailwind } from '@cli/commands/init/tailwind-setup.js';
import { updateTsConfig } from '@cli/commands/init/tsconfig-updater.js';
import { createUtils } from '@cli/commands/init/utils-creator.js';
import { Config } from '@cli/utils/config.js';
import { getProjectInfo, ProjectInfo } from '@cli/utils/get-project-info.js';
import { logger, spinner } from '@cli/utils/logger.js';
import { detectPackageManager } from '@cli/utils/package-manager.js';
import chalk from 'chalk';
import { Command } from 'commander';
import { existsSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import * as path from 'node:path';
import prompts from 'prompts';

import { injectThemeScript } from './theme-loader.js';
import { updateAngularConfig } from './update-angular-config.js';

export const init = new Command()
  .name('init')
  .description('initialize your project and install dependencies')
  .option('-y, --yes', 'skip confirmation prompt.', false)
  .option('-c, --cwd <cwd>', 'the working directory. defaults to the current directory.', process.cwd())
  .action(async options => {
    const cwd = path.resolve(options.cwd);

    validateWorkingDirectory(cwd);

    const projectInfo = await getProjectInfo(cwd);

    validateAngularProject(projectInfo);

    const componentsJsonPath = path.resolve(cwd, 'components.json');
    const isReInitializing = existsSync(componentsJsonPath);

    if (isReInitializing) {
      const shouldContinue = await confirmReinitialization();
      if (!shouldContinue) {
        logger.info('Re-initialization cancelled.');
        process.exit(0);
      }
    }

    logger.info(isReInitializing ? 'Re-initializing ZardUI...' : 'Initializing ZardUI...');
    logger.break();

    const detectedPm = await detectPackageManager();
    logger.break();

    const config = await promptForConfig(cwd, projectInfo, detectedPm);

    if (!options.yes) {
      const shouldProceed = await confirmConfiguration();
      if (!shouldProceed) {
        process.exit(0);
      }
    }

    await runInitializationSteps(cwd, config, projectInfo, isReInitializing);

    displaySuccessMessage(config);
  });

function validateWorkingDirectory(cwd: string): void {
  if (!existsSync(cwd)) {
    logger.error(`The path ${cwd} does not exist. Please try again.`);
    process.exit(1);
  }
}

function validateAngularProject(projectInfo: ProjectInfo): void {
  if (projectInfo.framework !== 'angular') {
    logger.error('This project does not appear to be an Angular project.');
    logger.error('Please run this command in an Angular project.');
    process.exit(1);
  }
}

async function confirmReinitialization(): Promise<boolean> {
  logger.warn('ZardUI is already initialized in this project.');
  const { reinitialize } = await prompts({
    type: 'confirm',
    name: 'reinitialize',
    message: 'Do you want to re-initialize? This will overwrite your existing configuration and utils.',
    initial: true,
  });

  return reinitialize;
}

async function confirmConfiguration(): Promise<boolean> {
  const { proceed } = await prompts({
    type: 'confirm',
    name: 'proceed',
    message: 'Write configuration to components.json?',
    initial: true,
  });

  return proceed;
}

async function runInitializationSteps(
  cwd: string,
  config: Config,
  projectInfo: ProjectInfo,
  isReInitializing: boolean,
): Promise<void> {
  const initSpinner = spinner('Initializing project...').start();

  await writeFile(path.resolve(cwd, 'components.json'), JSON.stringify(config, null, 2), 'utf8');

  initSpinner.text = 'Installing dependencies...';
  await installDependencies(cwd, config);

  initSpinner.text = 'Configuring Angular...';
  await updateAngularConfig(cwd, config);
  await injectThemeScript(cwd, config);

  if (!projectInfo.hasTailwind || isReInitializing) {
    initSpinner.text = 'Setting up Tailwind CSS...';
    await setupTailwind(cwd, config);
  }

  initSpinner.text = 'Creating utilities...';
  await createUtils(cwd, config);
  await updateTsConfig(cwd, config);

  initSpinner.succeed('Project initialized');
}

function displaySuccessMessage(config: Config): void {
  logger.break();
  logger.success('ZardUI has been initialized successfully!');
  logger.break();

  const runCommand =
    config.packageManager === 'npm'
      ? 'npx'
      : config.packageManager === 'yarn'
        ? 'yarn dlx'
        : `${config.packageManager}x`;

  logger.info('You can now add components using:');
  logger.info(chalk.bold(`  ${runCommand} @ngzard/ui add [component]`));
  logger.break();
}
