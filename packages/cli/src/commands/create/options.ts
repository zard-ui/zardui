/**
 * Reading and checking what the user asked `create` for.
 *
 * All of it happens before anything touches the disk or the network: a bad flag, a bad preset or a
 * name that cannot be used is an error that names it, and nothing exists yet to clean up.
 */

import {
  PACKAGE_MANAGERS,
  TEMPLATES,
  templateById,
  type PackageManagerId,
  type TemplateOption,
} from '@cli/commands/create/templates.js';
import { type AppliedPreset } from '@cli/commands/init/config-prompter.js';
import { resolvePreset } from '@cli/commands/init/preset.js';
import { CliError } from '@cli/utils/errors.js';
import { existsSync } from 'node:fs';
import * as path from 'node:path';

/** What `zard-cli create` takes — the Commander input, and the programmatic entry's. */
export interface CreateOptions {
  name?: string;
  preset?: string;
  template?: string;
  packageManager?: string;
  pointer?: boolean;
  rtl?: boolean;
  yes?: boolean;
  cwd?: string;
  /** Never mount the wizard, even in a terminal. */
  headless?: boolean;
}

/** Letters, digits and dashes, starting with a letter: valid for npm, Angular, Nx and Analog alike. */
const NAME_PATTERN = /^[a-z][a-z0-9-]*$/;

/**
 * Why a project name cannot be used, or `undefined` when it can.
 *
 * Names become a directory, a package name and, in Angular, a selector prefix; the common subset
 * is the only one that works in all three templates.
 */
export function nameProblem(name: string): string | undefined {
  if (!name) return 'The project name cannot be empty.';
  if (name.includes('/') || name.includes('\\') || name === '.' || name === '..') {
    return `"${name}" is a path. Give a plain name; use --cwd to choose where the project goes.`;
  }
  if (!NAME_PATTERN.test(name)) {
    return `"${name}" is not a valid project name: use lowercase letters, digits and dashes, starting with a letter.`;
  }
  return undefined;
}

/** Why `<cwd>/<name>` cannot be created, or `undefined` when it can. */
export function targetProblem(cwd: string, name: string): string | undefined {
  return existsSync(path.join(cwd, name))
    ? `"${name}" already exists in ${cwd}. Choose another name; create never writes into an existing directory.`
    : undefined;
}

export function resolveTemplate(value: string | undefined): TemplateOption | undefined {
  if (value === undefined) return undefined;

  const template = templateById(value);
  if (!template) {
    throw new CliError(
      `Unknown --template "${value}". Expected one of: ${TEMPLATES.map(item => item.value).join(', ')}.`,
      'UNKNOWN_TEMPLATE',
    );
  }
  return template;
}

export function resolvePackageManager(value: string | undefined): PackageManagerId | undefined {
  if (value === undefined) return undefined;

  if (!(PACKAGE_MANAGERS as readonly string[]).includes(value)) {
    throw new CliError(
      `Unknown --package-manager "${value}". Expected one of: ${PACKAGE_MANAGERS.join(', ')}.`,
      'UNKNOWN_PACKAGE_MANAGER',
    );
  }
  return value as PackageManagerId;
}

/** The manager that ran the CLI (`pnpm dlx zard-cli create` means pnpm), else npm. */
export function packageManagerFromEnvironment(
  userAgent = process.env['npm_config_user_agent'] ?? '',
): PackageManagerId {
  const name = userAgent.split('/')[0];
  return (PACKAGE_MANAGERS as readonly string[]).includes(name ?? '') ? (name as PackageManagerId) : 'npm';
}

/** What the flags decided, with everything validated and nothing yet asked. */
export interface ParsedFlags {
  readonly cwd: string;
  readonly template?: TemplateOption;
  readonly packageManager: PackageManagerId;
  readonly preset?: AppliedPreset;
  readonly name?: string;
}

/**
 * Validates every flag that was given, in the order a person reads the command, throwing at the
 * first problem. Pure with respect to the disk except for the existence check of the target.
 */
export function parseFlags(options: CreateOptions): ParsedFlags {
  const template = resolveTemplate(options.template);
  const packageManager = resolvePackageManager(options.packageManager) ?? packageManagerFromEnvironment();
  const preset = options.preset !== undefined ? resolvePreset(options.preset) : undefined;
  const cwd = path.resolve(options.cwd ?? process.cwd());

  if (options.name !== undefined) {
    const problem = nameProblem(options.name) ?? targetProblem(cwd, options.name);
    if (problem) throw new CliError(problem, 'INVALID_NAME');
  }

  return { cwd, template, packageManager, preset, name: options.name };
}

/**
 * Without a terminal nobody can be asked, so everything required has to be on the command line.
 *
 * The template and the name are always required — the user chooses the framework, and there is no
 * sensible name to invent. The preset falls back to the default only with `--yes`, which is the
 * explicit "accept the defaults" of a script.
 */
export function assertHeadlessComplete(options: CreateOptions, parsed: ParsedFlags): void {
  if (!parsed.template) {
    throw new CliError(
      `Missing --template. Without an interactive terminal, choose one: ${TEMPLATES.map(item => item.value).join(', ')}.`,
      'MISSING_FLAG',
    );
  }
  if (!parsed.name) {
    throw new CliError(
      'Missing project name. Without an interactive terminal, pass it as the argument: zard-cli create <name>.',
      'MISSING_FLAG',
    );
  }
  if (!parsed.preset && !options.yes) {
    throw new CliError(
      'Missing --preset. Without an interactive terminal, pass a preset code (build one at https://zardui.com/create) ' +
        'or add --yes to use the default design.',
      'MISSING_FLAG',
    );
  }
}
