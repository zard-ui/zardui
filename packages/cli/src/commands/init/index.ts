import {
  buildConfig,
  defaultAnswers,
  inspectCssFile,
  withPresets,
  type PresetAnswers,
} from '@cli/commands/init/config-prompter.js';
import {
  candidateProjects,
  detectProjectKind,
  isLibraryKind,
  PROJECT_KINDS,
  type ProjectKind,
} from '@cli/commands/init/project-kind.js';
import { buildInitSteps, type InitStep } from '@cli/commands/init/steps.js';
import { runInitWizard } from '@cli/commands/init/wizard.js';
import { isInteractive, printReport, WizardCancelledError, type LogRecord } from '@cli/ui/index.js';
import { type Config } from '@cli/utils/config.js';
import { CliError } from '@cli/utils/errors.js';
import { getProjectInfo, type ProjectInfo } from '@cli/utils/get-project-info.js';
import { loadIconCatalog } from '@cli/utils/icon-catalog.js';
import { logger, spinner } from '@cli/utils/logger.js';
import { detectPackageManager, suggestedRunner } from '@cli/utils/package-manager.js';
import { getRegistryUrl } from '@cli/utils/registry.js';
import { getAvailableThemes } from '@cli/utils/theme-selector.js';
import { Command } from 'commander';
import { existsSync } from 'node:fs';
import * as path from 'node:path';

export const init = new Command()
  .name('init')
  .description('initialize your project and install dependencies')
  .option('-y, --yes', 'skip confirmation prompt.', false)
  .option('-c, --cwd <cwd>', 'the working directory. defaults to the current directory.', process.cwd())
  .option('-t, --type <type>', `the project type: ${PROJECT_KINDS.map(kind => kind.value).join(', ')}.`)
  .option('-p, --project <name>', 'the workspace project to configure. defaults to the first compatible one.')
  .option('--css <path>', 'the global stylesheet that receives the theme (in a library, the file init creates).')
  .option('--app-config <path>', 'the app.config.ts that receives provideZard(). ignored for libraries.')
  .option('--base-color <color>', `the theme base color: ${getAvailableThemes().join(', ')}.`)
  .option('--components-alias <alias>', 'the import alias for components. defaults to @/shared/components.')
  .option('--utils-alias <alias>', 'the import alias for utils. defaults to @/shared/utils.')
  .action(async options => {
    const cwd = path.resolve(options.cwd);

    validateWorkingDirectory(cwd);

    const projectInfo = await getProjectInfo(cwd);
    validateAngularProject(projectInfo);

    const kind = resolveKind(options.type);
    const presets = resolvePresets(options);
    const projectRoot = resolveProjectRoot(options.project, kind ?? detectProjectKind(projectInfo), projectInfo);

    const isReInitializing = existsSync(path.resolve(cwd, 'components.json'));
    const packageManager = await detectPackageManager(cwd);

    // Before any step: the catalog is what says which icon package to install,
    // and it comes from the registry so it does not depend on the CLI version.
    await loadIconCatalog(getRegistryUrl());

    const buildSteps = (config: Config): InitStep[] => buildInitSteps(cwd, config, projectInfo, isReInitializing);

    if (!isInteractive()) {
      logHeadlessReason();
      await runHeadless({
        cwd,
        projectInfo,
        packageManager,
        isReInitializing,
        buildSteps,
        yes: options.yes,
        kind,
        projectRoot,
        presets,
      });
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
        presetKind: kind,
        presetProjectRoot: projectRoot,
        presetAnswers: presets,
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

/**
 * Why the full screen was not mounted.
 *
 * The CLI falling back to text mode is, to whoever is watching, indistinguishable
 * from the interface not existing — which is how the degradation on macOS and
 * Linux went unnoticed until it turned into "it never showed up" reports. With
 * `--debug`, the command answers for itself.
 */
function logHeadlessReason(): void {
  logger.debug(
    `No terminal to draw on (stdin TTY: ${Boolean(process.stdin.isTTY)}, ` +
      `stdout TTY: ${Boolean(process.stdout.isTTY)}, controlling terminal: unreachable) — running headless.`,
  );
}

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

/**
 * The type asked for with `--type`, when there is one.
 *
 * It is the answer to the wizard's first question given up front — which is what
 * makes init usable in CI, where nobody can pick from a menu.
 */
function resolveKind(value: string | undefined): ProjectKind | undefined {
  if (!value) return undefined;

  const kind = PROJECT_KINDS.find(option => option.value === value);

  if (!kind) {
    throw new CliError(
      `Unknown project type "${value}". Expected one of: ${PROJECT_KINDS.map(option => option.value).join(', ')}.`,
      'UNKNOWN_PROJECT_TYPE',
    );
  }

  return kind.value;
}

/**
 * The answers given as flags.
 *
 * Every question the wizard asks has one, so CI — and anyone who already knows
 * the answers — can configure a project without a terminal to draw on.
 */
function resolvePresets(options: {
  css?: string;
  appConfig?: string;
  baseColor?: string;
  componentsAlias?: string;
  utilsAlias?: string;
}): PresetAnswers {
  if (options.baseColor && !getAvailableThemes().includes(options.baseColor)) {
    throw new CliError(
      `Unknown base color "${options.baseColor}". Expected one of: ${getAvailableThemes().join(', ')}.`,
      'UNKNOWN_BASE_COLOR',
    );
  }

  return {
    globalCss: options.css,
    appConfig: options.appConfig,
    theme: options.baseColor,
    componentsAlias: options.componentsAlias,
    utilsAlias: options.utilsAlias,
  };
}

/** The root of the project asked for with `--project`, looked up among the compatible ones. */
function resolveProjectRoot(name: string | undefined, kind: ProjectKind, projectInfo: ProjectInfo): string | undefined {
  if (!name) return undefined;

  const candidates = candidateProjects(kind, projectInfo);
  const project = candidates.find(candidate => candidate.name === name);

  if (!project) {
    const available = candidates.map(candidate => candidate.name).join(', ') || 'none';
    throw new CliError(
      `Project "${name}" is not a ${kind} project in this workspace. Available: ${available}.`,
      'UNKNOWN_PROJECT',
    );
  }

  return project.root;
}

interface HeadlessOptions {
  cwd: string;
  projectInfo: ProjectInfo;
  packageManager: 'npm' | 'yarn' | 'pnpm' | 'bun';
  isReInitializing: boolean;
  yes: boolean;
  /** O que `--type` pediu; sem ele, o workspace decide. */
  kind?: ProjectKind;
  /** What `--project` asked for; without it, the first compatible project. */
  projectRoot?: string;
  /** The answers the other flags gave. */
  presets: PresetAnswers;
  buildSteps(config: Config): InitStep[];
}

/**
 * The path without a UI — CI, pipes and non-interactive terminals.
 *
 * Nobody can answer anything here, so the defaults apply and `--yes` is
 * required: without it the CLI refuses to overwrite the project's global CSS.
 */
async function runHeadless(options: HeadlessOptions): Promise<void> {
  if (!options.yes) {
    throw new CliError(
      'Running without an interactive terminal requires --yes, since init overwrites your global CSS.',
      'NOT_INTERACTIVE',
    );
  }

  const kind = options.kind ?? detectProjectKind(options.projectInfo);
  const answers = withPresets(defaultAnswers(options.projectInfo, kind, options.projectRoot), options.presets);
  const cssState = await inspectCssFile(options.cwd, answers.globalCss);

  // In a library the theme CSS is created by init, so its absence is expected;
  // in an application the file has to be there and wired into the build.
  if (cssState === 'missing' && !isLibraryKind(answers.kind)) {
    throw new CliError(
      `CSS file not found at: ${answers.globalCss}. Pass the right one with --css, or run init in an interactive terminal.`,
      'CSS_NOT_FOUND',
    );
  }

  const config = buildConfig(answers, options.packageManager);
  const steps = options.buildSteps(config);

  logger.info(options.isReInitializing ? 'Re-initializing zard/ui...' : 'Initializing zard/ui...');

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
    headline: 'zard/ui has been initialized successfully!',
    items: steps.map(step => `${step.label} — ${step.note}`),
    notes: nextStepsFor(config),
    commands: [{ command: `${suggestedRunner(config.packageManager)} zard-cli add`, argument: '[component]' }],
    logs,
  });
}

/**
 * What is still left to do by hand.
 *
 * In a library init has nowhere to register `provideZard()` and no way to import
 * the tokens — both belong to the app consuming the library, and without this
 * notice the user only finds out when the components do not render.
 */
function nextStepsFor(config: Config): string[] {
  if (!isLibraryKind(config.projectType)) {
    return ['You can now add components using:'];
  }

  return [
    'The consuming app still needs the Tailwind PostCSS pipeline (tailwindcss, @tailwindcss/postcss,',
    'postcss, tailwindcss-animate and a .postcssrc.json), to register provideZard() in its',
    `app.config.ts and to import the theme tokens from this library's ${path.basename(config.tailwind.css)}.`,
    '',
    'You can now add components using:',
  ];
}
