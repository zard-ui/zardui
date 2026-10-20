/**
 * Running the framework's generator.
 *
 * The generators are the frameworks' own (`ng new`, `create-nx-workspace`, `create-analog`); create
 * only drives them with every prompt answered by a flag. If one fails, the directory it left behind
 * is removed — it did not exist before, so nothing of the user's is lost, and a half-created project
 * is worse than none.
 */

import {
  printable,
  scaffoldCommands,
  withNpxRunner,
  type PackageManagerId,
  type ScaffoldCommand,
  type TemplateOption,
} from '@cli/commands/create/templates.js';
import { CliError } from '@cli/utils/errors.js';
import { logger } from '@cli/utils/logger.js';
import { existsSync } from 'node:fs';
import { rm } from 'node:fs/promises';
import * as path from 'node:path';

export interface ScaffoldPlan {
  readonly cwd: string;
  readonly name: string;
  readonly template: TemplateOption;
  readonly packageManager: PackageManagerId;
}

const NX_TIMEOUT_VARIABLE = 'NX_PLUGIN_NO_TIMEOUTS';

/**
 * Variables that switch Nx into its "AI agent mode": it maps presets onto remote templates (so
 * `--preset=apps` yields a different workspace) and prints JSON instead of progress. `create` runs the
 * generators with every answer given by flag, and needs them to behave the same wherever it is run —
 * including from inside an agent session, which is exactly where these are set.
 */
const AGENT_MODE_VARIABLES = ['CLAUDECODE', 'CLAUDE_CODE', 'OPENCODE'];

/**
 * Switches that stop the generators from asking questions flags cannot answer. The generators run with
 * `stdin: 'ignore'`, so a prompt reads EOF and aborts the run. `ng new` asks whether to enable shell
 * autocompletion (only when stdout is a TTY, with a global Angular CLI, `HOME` and `SHELL` set, and
 * never answered before) and, on a first run, whether to share analytics; `--interactive=false` covers
 * neither. Nx's plugin-worker timeout is lifted for the same reason: a slow machine is not an error.
 * They are defaults only: a value the user exported wins.
 */
const GENERATOR_PROMPT_SWITCHES: Record<string, string> = {
  NG_FORCE_AUTOCOMPLETE: 'false',
  NG_CLI_ANALYTICS: 'false',
  // Nx waits 30 s for each plugin worker to connect and gives up. On a loaded machine (a cold cache, an
  // antivirus scan, several installs at once) that is not enough, and `create-nx-workspace` fails for
  // reasons unrelated to the project. Waiting costs nothing when the worker connects at once.
  [NX_TIMEOUT_VARIABLE]: 'true',
};

/** The environment the generators run in: the user's own, minus the agent-mode switches. */
export function generatorEnv(source: NodeJS.ProcessEnv = process.env): NodeJS.ProcessEnv {
  const env = Object.fromEntries(Object.entries(source).filter(([key]) => !AGENT_MODE_VARIABLES.includes(key)));
  // No background daemon: it would outlive create, hold the new directory open (on Windows that blocks
  // removing it after a failure) and has nothing to cache for a workspace that is seconds old.
  return { ...GENERATOR_PROMPT_SWITCHES, ...env, NX_DAEMON: 'false' };
}

/** Fails now, naming the flag, when the chosen manager is not installed. */
async function assertPackageManagerAvailable(packageManager: PackageManagerId): Promise<string> {
  const { execa } = await import('execa');
  try {
    const { stdout } = await execa(packageManager, ['--version'], { stdin: 'ignore' });
    return stdout.trim();
  } catch {
    throw new CliError(
      `The package manager "${packageManager}" is not available on this machine. ` +
        'Install it or pick another with --package-manager. Nothing was created.',
      'PACKAGE_MANAGER_NOT_FOUND',
    );
  }
}

/**
 * Creates the project in `<cwd>/<name>` and returns its path.
 *
 * @throws CliError `SCAFFOLD_FAILED` after removing whatever the generator wrote.
 */
export async function runScaffold(plan: ScaffoldPlan): Promise<string> {
  const target = path.join(plan.cwd, plan.name);
  const version = await assertPackageManagerAvailable(plan.packageManager);

  let commands: ScaffoldCommand[] = scaffoldCommands(plan.template.value, plan.name, plan.packageManager);
  // Yarn Classic has no `dlx`; npx runs the generator and yarn still installs.
  if (plan.packageManager === 'yarn' && Number.parseInt(version, 10) < 2) commands = withNpxRunner(commands);

  const { execa } = await import('execa');

  for (const item of commands) {
    // The install of a generator that only writes files runs inside the project.
    const cwd = item.inProject ? target : plan.cwd;
    logger.info(`${item.label}...`);
    logger.debug(`$ ${printable(item)}  (in ${cwd})`);

    try {
      await execa(item.command, [...item.args], {
        cwd,
        env: generatorEnv(),
        extendEnv: false,
        stdin: 'ignore',
        stdout: 'inherit',
        stderr: 'inherit',
      });
    } catch (error) {
      await discard(target);
      throw new CliError(
        `${item.label} failed (${printable(item)}): ${error instanceof Error ? error.message : String(error)}. ` +
          'The incomplete directory was removed.' +
          failureHint(plan.template.value),
        'SCAFFOLD_FAILED',
      );
    }
  }

  return target;
}

/** What is worth knowing when the generator of this template fails: the usual cause, and the way out. */
export function failureHint(template: string): string {
  if (template !== 'nx') return '';

  return (
    ' If the message mentions a plugin worker that was not connected to, the machine was too busy for Nx ' +
    `(create already sets ${NX_TIMEOUT_VARIABLE}=true unless you set it yourself): close other heavy ` +
    `processes and try again, or run with ${NX_TIMEOUT_VARIABLE}=true exported.`
  );
}

/** Removes a directory this run created. Only ever called on `<cwd>/<name>`, which did not exist before. */
async function discard(target: string): Promise<void> {
  if (!existsSync(target)) return;

  try {
    await rm(target, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
  } catch (error) {
    logger.warn(`Could not remove ${target}: ${error instanceof Error ? error.message : String(error)}`);
  }
}
