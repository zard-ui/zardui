import { runAdd } from '@cli/commands/add/index.js';
import {
  assertHeadlessComplete,
  nameProblem,
  parseFlags,
  targetProblem,
  type CreateOptions,
  type ParsedFlags,
} from '@cli/commands/create/options.js';
import { runScaffold } from '@cli/commands/create/scaffold.js';
import {
  PACKAGE_MANAGERS,
  TEMPLATES,
  type PackageManagerId,
  type TemplateOption,
} from '@cli/commands/create/templates.js';
import { runCreateWizard } from '@cli/commands/create/wizard.js';
import { type AppliedPreset } from '@cli/commands/init/config-prompter.js';
import { initWithPreset } from '@cli/commands/init/index.js';
import { resolvePreset } from '@cli/commands/init/preset.js';
import { DEFAULT_PRESET_CODE } from '@cli/core/design/index.js';
import { isInteractive, printReport, WizardCancelledError } from '@cli/ui/index.js';
import { loadDesignData } from '@cli/utils/design-catalog.js';
import { CliError } from '@cli/utils/errors.js';
import { fetchJson } from '@cli/utils/http-client.js';
import { assertIconFamily, loadIconCatalog } from '@cli/utils/icon-catalog.js';
import { logger } from '@cli/utils/logger.js';
import { suggestedRunner } from '@cli/utils/package-manager.js';
import { getRegistryUrl } from '@cli/utils/registry.js';
import { Command } from 'commander';
import * as path from 'node:path';

export type { CreateOptions } from '@cli/commands/create/options.js';

export const create = new Command()
  .name('create')
  .description('create a new project already configured with a zard/ui design preset')
  .argument('[name]', 'the name of the project, and of the directory it is created in')
  .option('--preset <code>', 'the design preset. build one at https://zardui.com/create.')
  .option('--template <template>', `the project template: ${TEMPLATES.map(template => template.value).join(', ')}.`)
  .option('--pointer', 'use the pointer cursor on buttons.')
  .option('--rtl', 'the project reads right to left: sets dir="rtl" on <html> in index.html.')
  .option('--no-rtl', 'the project reads left to right (the default).')
  .option(
    '--package-manager <manager>',
    `the package manager: ${PACKAGE_MANAGERS.join(', ')}. defaults to the one that ran the CLI, else npm.`,
  )
  .option('-c, --cwd <cwd>', 'the directory the project is created in. defaults to the current directory.')
  .option('-y, --yes', 'skip confirmations and use the default design when no --preset is given.', false)
  .action((name: string | undefined, options: Omit<CreateOptions, 'name'>) => runCreate({ ...options, name }));

/** Everything `create` needs, decided and validated. */
interface Plan {
  readonly cwd: string;
  readonly name: string;
  readonly template: TemplateOption;
  readonly preset: AppliedPreset;
  readonly packageManager: PackageManagerId;
}

/**
 * Creates a project: validate everything, check the world is reachable, scaffold with the
 * framework's own generator, then configure it with the preset and install `button`.
 *
 * The order is the contract. Nothing is written before the last check passes, so a bad flag, a bad
 * preset, a name that is taken or a registry that is down leaves nothing behind.
 */
export async function runCreate(options: CreateOptions): Promise<void> {
  const parsed = parseFlags(options);
  const interactive = !options.headless && isInteractive();

  if (!interactive) {
    logger.debug('No terminal to draw on — running headless.');
    assertHeadlessComplete(options, parsed);
  }

  const plan = interactive ? await askForMissing(options, parsed) : planFromFlags(options, parsed);

  await preflight(plan);

  const scaffolded = await runScaffold(plan);

  try {
    await configure(plan, options);
  } catch (error) {
    // The project exists and is installed; only the zard/ui part failed. Say how to resume instead of
    // deleting work that took minutes to produce.
    logger.break();
    logger.warn(
      `The ${plan.template.label} project was created in ${scaffolded}, but configuring it failed. ` +
        `Resume with: cd ${plan.name} && npx zard-cli init --preset ${plan.preset.code} --type ${plan.template.kind} --yes`,
    );
    throw error;
  }

  report(plan, options);
}

/** Headless: the flags are the whole answer. `assertHeadlessComplete` already checked they are there. */
function planFromFlags(options: CreateOptions, parsed: ParsedFlags): Plan {
  return {
    cwd: parsed.cwd,
    name: parsed.name as string,
    template: parsed.template as TemplateOption,
    preset: parsed.preset ?? resolvePreset(DEFAULT_PRESET_CODE),
    packageManager: parsed.packageManager,
  };
}

/** Interactive: ask only what the flags left open, and never guess the template. */
async function askForMissing(options: CreateOptions, parsed: ParsedFlags): Promise<Plan> {
  // `--yes` accepts the default design; it never picks the template or the name.
  const preset = parsed.preset ?? (options.yes ? resolvePreset(DEFAULT_PRESET_CODE) : undefined);

  if (parsed.template && parsed.name && preset) {
    return {
      cwd: parsed.cwd,
      name: parsed.name,
      template: parsed.template,
      preset,
      packageManager: parsed.packageManager,
    };
  }

  try {
    const answers = await runCreateWizard({
      cwd: parsed.cwd,
      template: parsed.template,
      name: parsed.name,
      preset,
    });
    return { cwd: parsed.cwd, packageManager: parsed.packageManager, ...answers };
  } catch (error) {
    if (error instanceof WizardCancelledError) {
      printReport({ status: 'cancelled', headline: error.message, notes: ['Nothing was created.'] });
      process.exit(0);
    }
    throw error;
  }
}

/**
 * Everything that can fail before the first byte is written.
 *
 * The registry is the one external dependency of the second half (`init` and `add` both read it):
 * finding it unreachable only after a five-minute scaffold would leave a project without zard/ui, so
 * it is asked now. The design data and the icon catalog fall back to the copies bundled in the CLI,
 * so only the component index decides.
 */
async function preflight(plan: Plan): Promise<void> {
  const nameError = nameProblem(plan.name) ?? targetProblem(plan.cwd, plan.name);
  if (nameError) throw new CliError(nameError, 'INVALID_NAME');

  const registry = getRegistryUrl();
  try {
    await fetchJson(`${registry}/registry.json`, { retries: 1, timeout: 10_000 });
  } catch (error) {
    throw new CliError(
      `Could not reach the zard/ui registry at ${registry}: ${error instanceof Error ? error.message : String(error)}. ` +
        'Nothing was created. Check your connection and try again.',
      'REGISTRY_UNREACHABLE',
    );
  }

  await loadIconCatalog(registry);
  await loadDesignData(registry);
  assertIconFamily(plan.preset.design.iconLibrary);
}

/** The second half: configure the new project with the preset and install `button`. */
async function configure(plan: Plan, options: CreateOptions): Promise<void> {
  const target = path.join(plan.cwd, plan.name);

  await initWithPreset({
    cwd: target,
    preset: plan.preset.code,
    type: plan.template.kind,
    rtl: options.rtl,
    pointer: options.pointer,
  });

  await runAdd(['button'], { yes: true, overwrite: false, all: false, cwd: target, headless: true });
}

function report(plan: Plan, options: CreateOptions): void {
  const nx = { npm: 'npx nx', pnpm: 'pnpm exec nx', yarn: 'yarn nx', bun: 'bunx nx' }[plan.packageManager];
  const run = plan.template.value === 'nx' ? `${nx} serve ${plan.name}` : `${plan.packageManager} start`;

  printReport({
    status: 'success',
    headline: `Your ${plan.template.label} project "${plan.name}" is ready.`,
    items: [
      `${plan.template.label} app created with ${plan.packageManager}`,
      `Preset ${plan.preset.code} applied`,
      'button installed',
    ],
    notes: options.rtl
      ? [
          '<html> has dir="rtl". Set its lang attribute to your content’s language too (ar, he, fa…):',
          'create keeps lang="en" because right to left does not say which language it is.',
        ]
      : [],
    commands: [
      { command: `cd ${plan.name}` },
      { command: run },
      { command: `${suggestedRunner(plan.packageManager)} zard-cli add`, argument: '[component]' },
    ],
  });
}
