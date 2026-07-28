import { buildConfig, defaultAnswers, inspectCssFile } from '@cli/commands/init/config-prompter.js';
import { buildInitSteps, type InitStep } from '@cli/commands/init/steps.js';
import { runInitWizard } from '@cli/commands/init/wizard.js';
import { isInteractive, printReport, WizardCancelledError, type LogRecord } from '@cli/ui/index.js';
import { type Config } from '@cli/utils/config.js';
import { CliError } from '@cli/utils/errors.js';
import { getProjectInfo, type ProjectInfo } from '@cli/utils/get-project-info.js';
import { logger, spinner } from '@cli/utils/logger.js';
import { detectPackageManager, suggestedRunner } from '@cli/utils/package-manager.js';
import { Command } from 'commander';
import { existsSync } from 'node:fs';
import * as path from 'node:path';

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

    const isReInitializing = existsSync(path.resolve(cwd, 'components.json'));
    const packageManager = await detectPackageManager(cwd);

    const buildSteps = (config: Config): InitStep[] => buildInitSteps(cwd, config, projectInfo, isReInitializing);

    if (!isInteractive()) {
      await runHeadless({ cwd, projectInfo, packageManager, isReInitializing, buildSteps, yes: options.yes });
      return;
    }

    try {
      const { config, logs } = await runInitWizard({
        cwd,
        projectInfo,
        packageManager,
        isReInitializing,
        skipConfirmation: options.yes,
        buildSteps,
      });

      reportSuccess(config, buildSteps(config), logs);
    } catch (error) {
      if (error instanceof WizardCancelledError) {
        printReport({
          status: 'cancelled',
          headline: error.message,
          notes: ['Nothing was changed in your project.'],
        });
        process.exit(0);
      }
      throw error;
    }
  });

function validateWorkingDirectory(cwd: string): void {
  if (!existsSync(cwd)) {
    throw new CliError(`The path ${cwd} does not exist. Please try again.`, 'INVALID_CWD');
  }
}

function validateAngularProject(projectInfo: ProjectInfo): void {
  if (projectInfo.framework !== 'angular') {
    throw new CliError('This project does not appear to be an Angular project.', 'NOT_ANGULAR');
  }
}

interface HeadlessOptions {
  cwd: string;
  projectInfo: ProjectInfo;
  packageManager: 'npm' | 'yarn' | 'pnpm' | 'bun';
  isReInitializing: boolean;
  yes: boolean;
  buildSteps(config: Config): InitStep[];
}

/**
 * Caminho sem UI — CI, pipes e terminais não interativos.
 *
 * Aqui ninguém pode responder nada, então os defaults valem e `--yes` é
 * obrigatório: sem ele a CLI se recusa a sobrescrever o CSS global do projeto.
 */
async function runHeadless(options: HeadlessOptions): Promise<void> {
  if (!options.yes) {
    throw new CliError(
      'Running without an interactive terminal requires --yes, since init overwrites your global CSS.',
      'NOT_INTERACTIVE',
    );
  }

  const answers = defaultAnswers(options.projectInfo);
  const cssState = await inspectCssFile(options.cwd, answers.globalCss);

  if (cssState === 'missing') {
    throw new CliError(
      `CSS file not found at: ${answers.globalCss}. Run init in an interactive terminal to choose another path.`,
      'CSS_NOT_FOUND',
    );
  }

  const config = buildConfig(answers, options.packageManager);
  const steps = options.buildSteps(config);

  logger.info(options.isReInitializing ? 'Re-initializing ZardUI...' : 'Initializing ZardUI...');

  for (const step of steps) {
    const stepSpinner = spinner(`${step.label} — ${step.note}`).start();
    try {
      await step.run();
      stepSpinner.succeed(step.label);
    } catch (error) {
      stepSpinner.fail(`${step.label}: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  reportSuccess(config, steps, []);
}

function reportSuccess(config: Config, steps: readonly InitStep[], logs: readonly LogRecord[]): void {
  printReport({
    status: 'success',
    headline: 'ZardUI has been initialized successfully!',
    items: steps.map(step => `${step.label} — ${step.note}`),
    notes: ['You can now add components using:'],
    commands: [{ command: `${suggestedRunner(config.packageManager)} zard-cli add`, argument: '[component]' }],
    logs,
  });
}
