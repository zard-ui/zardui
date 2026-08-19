/**
 * A inicialização, como função.
 *
 * A lógica morava dentro do `.action()` do comando, o que a tornava alcançável
 * só por linha de comando. O `create` precisa dela logo depois de gerar o
 * projeto — e chamar `npx zard-cli init` como subprocesso ali traria resolução
 * de versão, TTY e código de saída como três novas fontes de erro para uma coisa
 * que já está em memória.
 *
 * A extração não muda um passo do que acontece: o comando virou uma casca que lê
 * flags e chama isto.
 */

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
import { isInteractive, WizardCancelledError, type LogRecord } from '@cli/ui/index.js';
import { type Config } from '@cli/utils/config.js';
import { CliError } from '@cli/utils/errors.js';
import { getProjectInfo, type ProjectInfo } from '@cli/utils/get-project-info.js';
import { loadIconCatalog } from '@cli/utils/icon-catalog.js';
import { logger, spinner } from '@cli/utils/logger.js';
import { detectPackageManager } from '@cli/utils/package-manager.js';
import { loadPresetCatalog } from '@cli/utils/preset-catalog.js';
import { getRegistryUrl } from '@cli/utils/registry.js';
import type { Preset } from '@zardui/preset';
import { existsSync } from 'node:fs';
import * as path from 'node:path';

export interface InitProjectOptions {
  readonly cwd: string;
  /** `--yes`: pula a confirmação final e, sem TTY, autoriza sobrescrever o CSS. */
  readonly yes?: boolean;
  /** `--type`. */
  readonly type?: string;
  /** `--project`. */
  readonly project?: string;
  /**
   * O design system já resolvido.
   *
   * Presente, as perguntas que ele responde não são feitas — o transcript mostra
   * os valores marcados como vindos do preset. É o que `init --preset` e o
   * `create` usam.
   */
  readonly preset?: Preset;
}

export interface InitProjectResult {
  readonly config: Config;
  readonly steps: readonly InitStep[];
  readonly logs: readonly LogRecord[];
  /** O usuário desistiu no wizard. Nada foi escrito. */
  readonly cancelled: boolean;
  readonly cancelReason?: string;
}

/**
 * Um config de fachada para o retorno cancelado.
 *
 * Quem cancela não tem config — mas obrigar todo chamador a checar `cancelled`
 * antes de tocar em qualquer campo transformaria o caso raro em ruído em todos
 * os outros. Ninguém lê isto: `cancelled` é o que decide.
 */
const NO_CONFIG = {} as Config;

export async function initProject(options: InitProjectOptions): Promise<InitProjectResult> {
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
  await loadPresetCatalog(getRegistryUrl());

  const buildSteps = (config: Config): InitStep[] => buildInitSteps(cwd, config, projectInfo, isReInitializing);

  if (!isInteractive()) {
    logHeadlessReason();
    return runHeadless({
      cwd,
      projectInfo,
      packageManager,
      isReInitializing,
      buildSteps,
      yes: options.yes ?? false,
      kind,
      projectRoot,
      preset: options.preset,
    });
  }

  try {
    const { config, logs } = await runInitWizard({
      cwd,
      projectInfo,
      packageManager,
      isReInitializing,
      skipConfirmation: options.yes ?? false,
      buildSteps,
      presetKind: kind,
      presetProjectRoot: projectRoot,
      preset: options.preset,
    });

    return { config, steps: buildSteps(config), logs, cancelled: false };
  } catch (error) {
    if (error instanceof WizardCancelledError) {
      return { config: NO_CONFIG, steps: [], logs: [], cancelled: true, cancelReason: error.message };
    }
    throw error;
  }
}

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
  preset?: Preset;
  buildSteps(config: Config): InitStep[];
}

/**
 * Caminho sem UI — CI, pipes e terminais não interativos.
 *
 * Aqui ninguém pode responder nada, então os defaults valem e `--yes` é
 * obrigatório: sem ele a CLI se recusa a sobrescrever o CSS global do projeto.
 */
async function runHeadless(options: HeadlessOptions): Promise<InitProjectResult> {
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

  const config = buildConfig(answers, options.packageManager, options.preset);
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

  return { config, steps, logs: [], cancelled: false };
}
