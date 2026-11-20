/**
 * Running the framework's generator.
 *
 * The generators are the frameworks' own (`ng new`, `create-nx-workspace`, `create-analog`); create
 * only drives them with every prompt answered by a flag. If one fails, the directory it left behind
 * is removed — it did not exist before, so nothing of the user's is lost, and a half-created project
 * is worse than none.
 */

import {
  pnpmBuildApprovalsYaml,
  printable,
  scaffoldCommands,
  withNpxRunner,
  type PackageManagerId,
  type ScaffoldCommand,
  type TemplateOption,
} from '@cli/commands/create/templates.js';
import { CliError } from '@cli/utils/errors.js';
import {
  InterruptedError,
  interruptedSoon,
  onInterrupt,
  terminate,
  track,
  type Running,
} from '@cli/utils/interrupt.js';
import { logger } from '@cli/utils/logger.js';
import { isYarnClassic } from '@cli/utils/yarn.js';
import { existsSync } from 'node:fs';
import { rm, writeFile } from 'node:fs/promises';
import { EOL } from 'node:os';
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

/** Exit statuses that mean "killed by Ctrl+C" rather than "failed": 130 (POSIX) and STATUS_CONTROL_C_EXIT. */
function wasInterrupted(error: unknown): boolean {
  const { exitCode, signal } = (error ?? {}) as { exitCode?: number; signal?: string };
  return signal === 'SIGINT' || signal === 'SIGTERM' || exitCode === 130 || exitCode === 3221225786;
}

/**
 * Creates the project in `<cwd>/<name>` and returns its path.
 *
 * The directory belongs to this run from the moment it is checked to be absent until the generators
 * finish: a failure or an interruption (Ctrl+C, the terminal closing) stops the generator and removes
 * it. A directory that was already there is never touched.
 *
 * @throws CliError `SCAFFOLD_FAILED` after removing whatever the generator wrote.
 * @throws InterruptedError after the same removal, when the run was interrupted.
 */
export async function runScaffold(plan: ScaffoldPlan): Promise<string> {
  const target = path.join(plan.cwd, plan.name);
  const version = await assertPackageManagerAvailable(plan.packageManager);

  // The preflight checked this too; the generator is minutes long, and the check is the only thing
  // standing between "ours to remove" and "somebody else's".
  if (existsSync(target)) {
    throw new CliError(
      `"${plan.name}" already exists in ${plan.cwd}. Choose another name; create never writes into an existing directory.`,
      'INVALID_NAME',
    );
  }

  let commands: ScaffoldCommand[] = scaffoldCommands(plan.template.value, plan.name, plan.packageManager);
  // Yarn Classic has no `dlx`; npx runs the generator and yarn still installs.
  if (plan.packageManager === 'yarn' && isYarnClassic(version)) commands = withNpxRunner(commands);

  const { execa } = await import('execa');

  let running: Running | undefined;
  let interrupted = false;
  let discarded: Promise<boolean> | undefined;

  // Once per run, however many paths ask: the signal handler and the failing generator both do.
  const abandon = (): Promise<boolean> => {
    discarded ??= (async () => {
      if (running) terminate(running);
      await running?.then(undefined, () => undefined);
      return discard(target);
    })();
    return discarded;
  };

  let interruptedError: Promise<InterruptedError> | undefined;
  const interruption = (): Promise<InterruptedError> => {
    interruptedError ??= (async () => {
      const removed = await abandon();
      return new InterruptedError(
        removed
          ? `Interrupted. The incomplete directory ${target} was removed.`
          : `Interrupted. ${target} could not be removed completely: delete it before running create again.`,
      );
    })();
    return interruptedError;
  };

  const stopListening = onInterrupt(async () => {
    interrupted = true;
    (await interruption()).announce();
  });

  try {
    for (const item of commands) {
      if (interrupted) throw await interruption();

      // The install of a generator that only writes files runs inside the project.
      const cwd = item.inProject ? target : plan.cwd;
      logger.info(`${item.label}...`);
      logger.debug(`$ ${printable(item)}  (in ${cwd})`);

      try {
        if (item.approveBuilds && plan.packageManager === 'pnpm') await approvePnpmBuilds(target);

        const output = item.quiet ? 'pipe' : 'inherit';
        const child = track(
          execa(item.command, [...item.args], {
            cwd,
            env: generatorEnv(),
            extendEnv: false,
            stdin: 'ignore',
            stdout: output,
            stderr: output,
          }),
        );
        running = child;
        const result = await child;
        running = undefined;
        if (item.quiet) logger.debug([result?.stdout, result?.stderr].filter(Boolean).join(EOL));
      } catch (error) {
        // Ctrl+C reaches the generator too, and it can report its death before our own handler runs.
        if (interrupted || wasInterrupted(error) || (await interruptedSoon())) {
          interrupted = true;
          throw await interruption();
        }

        const removed = await abandon();
        throw new CliError(
          `${item.label} failed (${printable(item)}): ${error instanceof Error ? error.message : String(error)}. ` +
            (removed
              ? 'The incomplete directory was removed.'
              : `${target} could not be removed completely: delete it before running create again.`) +
            failureHint(plan.template.value),
          'SCAFFOLD_FAILED',
        );
      }
    }
  } finally {
    stopListening();
  }

  return target;
}

/**
 * Approves, in the new project, the dependencies whose build scripts pnpm 11 would otherwise refuse
 * (ERR_PNPM_IGNORED_BUILDS, exit 1, which would make create remove the project). Written to
 * `pnpm-workspace.yaml` so every later install of the project works too. A file the generator already
 * wrote is the user's template, not ours to replace.
 */
async function approvePnpmBuilds(target: string): Promise<void> {
  const file = path.join(target, 'pnpm-workspace.yaml');
  if (existsSync(file)) {
    logger.debug('pnpm-workspace.yaml already exists: leaving the build approvals as the generator wrote them.');
    return;
  }

  await writeFile(file, pnpmBuildApprovalsYaml());
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

/**
 * Removes a directory this run created. Only ever called on `<cwd>/<name>`, which did not exist before.
 * Returns whether it is gone; a failure is reported, never swallowed.
 */
async function discard(target: string): Promise<boolean> {
  if (!existsSync(target)) return true;

  try {
    await rm(target, { recursive: true, force: true, maxRetries: 10, retryDelay: 300 });
    return !existsSync(target);
  } catch (error) {
    logger.warn(`Could not remove ${target}: ${error instanceof Error ? error.message : String(error)}`);
    return false;
  }
}
