import { installExample } from '@cli/commands/create/example.js';
import { assertDirectoryAvailable, assertProjectName } from '@cli/commands/create/project-name.js';
import { CREATE_TEMPLATES, runScaffold, type CreateTemplate } from '@cli/commands/create/scaffold.js';
import { runCreateWizard } from '@cli/commands/create/wizard.js';
import { initProject } from '@cli/commands/init/run.js';
import { isInteractive, printReport, WizardCancelledError } from '@cli/ui/index.js';
import { CliError } from '@cli/utils/errors.js';
import { logger, spinner } from '@cli/utils/logger.js';
import { detectPackageManager, suggestedRunner, type PackageManager } from '@cli/utils/package-manager.js';
import { loadPresetCatalog, presetCatalog } from '@cli/utils/preset-catalog.js';
import { resolvePresetInput } from '@cli/utils/preset-input.js';
import { getRegistryUrl } from '@cli/utils/registry.js';
import { DEFAULT_PRESET, entryById, type Preset } from '@zardui/preset';
import { Command } from 'commander';
import { existsSync } from 'node:fs';
import * as path from 'node:path';

const PACKAGE_MANAGERS: readonly PackageManager[] = ['npm', 'pnpm', 'yarn', 'bun'];

interface CreateOptions {
  template?: string;
  preset?: string;
  pm?: string;
  install: boolean;
  git: boolean;
  example: boolean;
  yes: boolean;
  cwd: string;
}

export const create = new Command()
  .name('create')
  .description('scaffold a new project with zard/ui already set up')
  .argument('[name]', 'the name of the project, which is also the directory it goes in')
  .option('-t, --template <template>', `the project template: ${CREATE_TEMPLATES.map(t => t.value).join(', ')}.`)
  .option('-p, --preset <preset>', 'the design system: a preset code, a path to a zard.preset.json, or a URL.')
  .option('--pm <manager>', `the package manager: ${PACKAGE_MANAGERS.join(', ')}.`)
  .option('--no-install', 'scaffold without installing dependencies.')
  .option('--no-git', 'do not initialize a git repository.')
  .option('--no-example', 'do not install the example component or rewrite the home page.')
  .option('-y, --yes', 'answer every question with its default.', false)
  .option('-c, --cwd <cwd>', 'where to create the project. defaults to the current directory.', process.cwd())
  .action(async (name: string | undefined, options: CreateOptions) => {
    const cwd = path.resolve(options.cwd);

    if (!existsSync(cwd)) {
      throw new CliError(`The path ${cwd} does not exist. Please try again.`, 'INVALID_CWD');
    }

    // Tudo o que pode ser recusado é recusado antes de o gerador rodar. Um nome
    // inválido, um template que não existe ou um código de preset quebrado
    // descobertos depois deixariam um diretório meio criado para trás.
    const template = resolveTemplate(options.template);
    const packageManager = resolvePackageManager(options.pm) ?? (await detectPackageManager(cwd));

    await loadPresetCatalog(getRegistryUrl());
    const preset = options.preset
      ? await resolvePresetInput(options.preset, { cwd, catalog: presetCatalog() })
      : undefined;

    if (name) assertProjectName(name);

    const plan = await resolvePlan({ name, template, preset, packageManager, options, cwd });
    if (!plan) return;

    assertProjectName(plan.name);
    const target = assertDirectoryAvailable(cwd, plan.name);

    await scaffoldAndInitialize(plan, cwd, target, options);
  });

interface CreatePlan {
  readonly name: string;
  readonly template: CreateTemplate;
  readonly preset: Preset;
  readonly packageManager: PackageManager;
}

interface ResolvePlanOptions {
  readonly name?: string;
  readonly template?: CreateTemplate;
  readonly preset?: Preset;
  readonly packageManager: PackageManager;
  readonly options: CreateOptions;
  readonly cwd: string;
}

/**
 * O que criar — respondido pelo wizard, ou pelas flags e defaults.
 *
 * `null` significa que a pessoa desistiu: nada foi escrito, e o comando termina
 * em silêncio depois do relatório de cancelamento.
 */
async function resolvePlan(input: ResolvePlanOptions): Promise<CreatePlan | null> {
  const { name, template, preset, packageManager, options, cwd } = input;

  const answered = Boolean(name) && Boolean(template);

  if (options.yes || !isInteractive() || answered) {
    if (!name) {
      throw new CliError(
        'Pass a project name. Without an interactive terminal there is nobody to ask for one.',
        'MISSING_PROJECT_NAME',
      );
    }

    return {
      name,
      template: template ?? 'angular',
      preset: preset ?? DEFAULT_PRESET,
      packageManager,
    };
  }

  try {
    return await runCreateWizard({
      cwd,
      name,
      template,
      preset,
      packageManager,
      catalog: presetCatalog(),
    });
  } catch (error) {
    if (error instanceof WizardCancelledError) {
      printReport({ status: 'cancelled', headline: error.message, notes: ['Nothing was created.'] });
      return null;
    }
    throw error;
  }
}

async function scaffoldAndInitialize(
  plan: CreatePlan,
  cwd: string,
  target: string,
  options: CreateOptions,
): Promise<void> {
  logger.info(`Creating ${plan.name}...`);
  logger.break();

  await runScaffold({
    name: plan.name,
    template: plan.template,
    packageManager: plan.packageManager,
    install: options.install,
    git: options.git,
    cwd,
    interactive: isInteractive(),
  });

  // Em processo, e não `npx zard-cli init`: a versão já está em memória, e um
  // subprocesso traria resolução de pacote, TTY e código de saída como três
  // novas formas de falhar.
  const result = await initProject({
    cwd: target,
    yes: true,
    type: plan.template,
    preset: plan.preset,
  });

  const notes: string[] = [];

  if (options.example) {
    const exampleSpinner = spinner('Adding an example component...').start();
    try {
      const example = await installExample({ cwd: target, config: result.config, install: options.install });
      exampleSpinner.succeed(example.homeRewritten ? 'Example component on the home page' : 'Example component added');
      notes.push(...example.skipped);
    } catch (error) {
      // O exemplo é cortesia: o projeto já está configurado, e derrubar o
      // comando aqui apagaria esse fato do relatório.
      exampleSpinner.fail('Could not add the example component');
      logger.debug(error instanceof Error ? error.message : String(error));
      notes.push('The example component could not be installed. Run `zard-cli add button` inside the project.');
    }
  }

  if (!options.install) {
    notes.push(`Dependencies were not installed. Run \`${plan.packageManager} install\` inside the project.`);
  }

  reportSuccess(plan, target, cwd, notes);
}

function reportSuccess(plan: CreatePlan, target: string, cwd: string, notes: string[]): void {
  const relative = path.relative(cwd, target) || plan.name;
  const runner = suggestedRunner(plan.packageManager);

  printReport({
    status: 'success',
    headline: `${plan.name} is ready.`,
    items: [
      `template — ${CREATE_TEMPLATES.find(item => item.value === plan.template)?.label ?? plan.template}`,
      `design system — ${describePreset(plan.preset)}`,
      `package manager — ${plan.packageManager}`,
    ],
    notes: [...notes, '', 'Then start it with:'],
    commands: [
      { command: `cd ${relative}` },
      { command: `${plan.packageManager} start` },
      { command: `${runner} zard-cli add`, argument: '[component]' },
    ],
  });
}

function describePreset(preset: Preset): string {
  const catalog = presetCatalog();
  const baseColor = entryById(catalog.baseColors, preset.baseColor)?.label ?? preset.baseColor;
  const theme = entryById(catalog.themes, preset.theme)?.label ?? preset.theme;

  return preset.theme === 'neutral' ? baseColor : `${baseColor} · ${theme}`;
}

function resolveTemplate(value: string | undefined): CreateTemplate | undefined {
  if (!value) return undefined;

  const template = CREATE_TEMPLATES.find(option => option.value === value);

  if (!template) {
    throw new CliError(
      `Unknown template "${value}". Expected one of: ${CREATE_TEMPLATES.map(option => option.value).join(', ')}.`,
      'UNKNOWN_TEMPLATE',
    );
  }

  return template.value;
}

function resolvePackageManager(value: string | undefined): PackageManager | undefined {
  if (!value) return undefined;

  if (!PACKAGE_MANAGERS.includes(value as PackageManager)) {
    throw new CliError(
      `Unknown package manager "${value}". Expected one of: ${PACKAGE_MANAGERS.join(', ')}.`,
      'UNKNOWN_PACKAGE_MANAGER',
    );
  }

  return value as PackageManager;
}
