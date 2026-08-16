import { buildConfig, defaultAnswers, inspectCssFile } from '@cli/commands/init/config-prompter.js';
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
  .action(async options => {
    const cwd = path.resolve(options.cwd);

    validateWorkingDirectory(cwd);

    const projectInfo = await getProjectInfo(cwd);
    validateAngularProject(projectInfo);

    const kind = resolveKind(options.type);
    const projectRoot = resolveProjectRoot(options.project, kind ?? detectProjectKind(projectInfo), projectInfo);

    const isReInitializing = existsSync(path.resolve(cwd, 'components.json'));
    const packageManager = await detectPackageManager(cwd);

    // Antes de qualquer etapa: é o catálogo que diz qual pacote de ícones
    // instalar, e ele vem do registry para não depender da versão da CLI.
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
 * Por que a tela cheia não foi montada.
 *
 * A CLI sair em modo texto é indistinguível, para quem está olhando, de a
 * interface não existir — foi assim que a degradação no macOS e no Linux passou
 * despercebida até virar relato de que "não apareceu". Com `--debug`, a resposta
 * vem do próprio comando.
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
 * O tipo pedido em `--type`, quando houver.
 *
 * É a resposta à primeira pergunta do wizard dada de antemão — o que torna o
 * init utilizável em CI, onde ninguém pode escolher no menu.
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

/** A raiz do projeto pedido em `--project`, procurado entre os compatíveis. */
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
  /** O que `--project` pediu; sem ele, o primeiro projeto compatível. */
  projectRoot?: string;
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

  const kind = options.kind ?? detectProjectKind(options.projectInfo);
  const answers = defaultAnswers(options.projectInfo, kind, options.projectRoot);
  const cssState = await inspectCssFile(options.cwd, answers.globalCss);

  // Numa biblioteca o CSS de tema é criado pelo init, então não existir é o
  // esperado; numa aplicação, o arquivo tem que estar lá e ligado ao build.
  if (cssState === 'missing' && !isLibraryKind(answers.kind)) {
    throw new CliError(
      `CSS file not found at: ${answers.globalCss}. Run init in an interactive terminal to choose another path.`,
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
 * O que ainda falta fazer à mão.
 *
 * Numa biblioteca o init não tem onde registrar `provideZard()` nem como
 * importar os tokens — as duas coisas pertencem ao app que consome a lib, e
 * sem esse aviso o usuário só descobre quando os componentes não renderizam.
 */
function nextStepsFor(config: Config): string[] {
  if (!isLibraryKind(config.projectType)) {
    return ['You can now add components using:'];
  }

  return [
    'The consuming app still needs to register provideZard() in its app.config.ts',
    `and import the theme tokens from this library's ${path.basename(config.tailwind.css)}.`,
    '',
    'You can now add components using:',
  ];
}
