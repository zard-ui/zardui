import { APP_VERSION } from '@cli/constants/app.constants.js';
import { CONFIG_STYLES, MENU_ACCENT_IDS, MENU_APPEARANCE_IDS, MENU_COLOR_IDS } from '@cli/core/design/options.js';
import { SOURCE_ICON_FAMILY } from '@cli/core/icons/index.js';
import { ConfigError } from '@cli/utils/errors.js';
import { access, readFile } from 'node:fs/promises';
import * as path from 'node:path';
import { z } from 'zod';

async function pathExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readJson(filePath: string): Promise<any> {
  const content = await readFile(filePath, 'utf-8');
  return JSON.parse(content);
}

const configSchema = z.object({
  $schema: z.string().optional(),
  appConfigFile: z.string().default('src/app/app.config.ts'),
  // `css` is what every project initialized before styles existed carries; it is read as the
  // current look. The eight style ids are what `init --preset` and `apply` write.
  style: z.enum(CONFIG_STYLES).default('css'),
  // The icon family the components are written in. Absent from files written
  // before the property existed — and lucide is what those use.
  //
  // Not an enum: the valid families are the ones the registry publishes at run
  // time, not the ones that existed when this CLI was compiled. Closing the list
  // here would make an old CLI reject a new family, which is exactly what the
  // remote catalog exists to avoid. `assertIconFamily` validates the value
  // against the catalog, with a message that names the options.
  icons: z.string().default(SOURCE_ICON_FAMILY),
  // Whether the project reads right to left. Components are direction-agnostic
  // (logical classes + CDK Directionality), so installed files are identical
  // either way; `init --rtl` sets `dir="rtl"` on <html> in index.html.
  rtl: z.boolean().default(false),
  // Absent from components.json files written before the project-type menu; an
  // Angular application is what those describe.
  projectType: z.enum(['angular', 'angular-library', 'nx', 'nx-library', 'analog']).default('angular'),
  packageManager: z.enum(['npm', 'yarn', 'pnpm', 'bun']).default('npm'),
  registryUrl: z.string().optional(),
  // Written by `init --preset` / `apply`: how menus and popovers look. Absent means the defaults
  // (default, solid, subtle), which is also what every project without a preset has.
  menuColor: z.enum(MENU_COLOR_IDS).optional(),
  menuAppearance: z.enum(MENU_APPEARANCE_IDS).optional(),
  menuAccent: z.enum(MENU_ACCENT_IDS).optional(),
  // The preset code the project was last fully configured from. Informational: nothing reads it to
  // decide what to install, so a code from a newer zard-cli cannot make `add` fail.
  preset: z.string().optional(),
  tailwind: z
    .object({
      css: z.string().default('src/styles.css'),
      baseColor: z.string().default('neutral'),
    })
    .default({ css: 'src/styles.css', baseColor: 'neutral' }),
  baseUrl: z.string().default('src/app'),
  aliases: z
    .object({
      components: z.string().default('@/shared/components'),
      utils: z.string().default('@/shared/utils'),
      core: z.string().default('@/shared/core'),
      services: z.string().default('@/shared/services'),
      // Absent from files written before blocks were installable; those get the
      // default, which is where `init` would have put it anyway.
      blocks: z.string().default('@/shared/blocks'),
    })
    .default({
      components: '@/shared/components',
      utils: '@/shared/utils',
      core: '@/shared/core',
      services: '@/shared/services',
      blocks: '@/shared/blocks',
    }),
});

export type Config = z.infer<typeof configSchema>;

export const DEFAULT_CONFIG: Config = {
  style: 'css',
  icons: SOURCE_ICON_FAMILY,
  rtl: false,
  projectType: 'angular',
  appConfigFile: 'src/app/app.config.ts',
  packageManager: 'npm',
  tailwind: {
    css: 'src/styles.css',
    baseColor: 'neutral',
  },
  baseUrl: 'src/app',
  aliases: {
    components: '@/shared/components',
    utils: '@/shared/utils',
    core: '@/shared/core',
    services: '@/shared/services',
    blocks: '@/shared/blocks',
  },
};

export async function getConfig(cwd: string): Promise<Config | null> {
  const configPath = path.resolve(cwd, 'components.json');

  if (!(await pathExists(configPath))) {
    return null;
  }

  try {
    const configJson = await readJson(configPath);
    const parsed = configSchema.safeParse(configJson);
    if (!parsed.success) throw new ConfigError(describeConfigIssues(parsed.error, configJson));
    const config = parsed.data;

    if (config.registryUrl) {
      const { validateRegistryUrl } = await import('@cli/utils/registry.js');
      validateRegistryUrl(config.registryUrl);
    }

    return config;
  } catch (error) {
    if (error instanceof ConfigError) throw error;
    throw new ConfigError('Invalid configuration file: components.json');
  }
}

/** What a value from a newer CLI looks like: a short lowercase identifier (`brutalist`, `high-contrast`). */
const LOOKS_LIKE_AN_ID = /^[a-z][a-z0-9-]{0,31}$/;

const UPDATE_HINT = 'update with `npx zard-cli@latest` (or `npm i -g zard-cli@latest`).';

/**
 * Turns the zod issues of a components.json into a message that names the field.
 *
 * "Invalid configuration file: components.json" was all a value this CLI does not
 * know produced. When the field is a closed list (style, menu settings, project
 * type, package manager) and the value is shaped like an id, the likeliest cause
 * is a file written by a newer zard-cli, so the message says that and how to
 * update. Anything else (wrong type, garbage) is reported as a plain invalid
 * value, without the update advice: telling someone to update for a typo would
 * be a lie.
 *
 * This only helps for values a newer CLI introduces AFTER this one: published
 * versions that predate it keep their own message and cannot be patched.
 */
export function describeConfigIssues(error: z.ZodError, input: unknown): string {
  const lines = error.issues.map(issue => {
    const field = issue.path.length ? issue.path.join('.') : 'components.json';

    if (issue.code === 'invalid_value') {
      const options = issue.values.map(v => `"${String(v)}"`).join(', ');
      const value = valueAt(input, issue.path);
      const shown = typeof value === 'string' ? `"${value}"` : JSON.stringify(value);
      const newer = typeof value === 'string' && LOOKS_LIKE_AN_ID.test(value);

      return (
        `  - "${field}" is ${shown}, which zard-cli ${APP_VERSION} does not support (supported: ${options}).` +
        (newer ? ` If components.json was written by a newer zard-cli, ${UPDATE_HINT}` : '')
      );
    }

    return `  - "${field}": ${issue.message}`;
  });

  return ['Invalid configuration file: components.json', ...lines].join('\n');
}

function valueAt(input: unknown, path: PropertyKey[]): unknown {
  return path.reduce<any>((node, key) => node?.[key], input);
}

/**
 * Splits an alias prefix from the path that follows it.
 *
 * `@`, `@app`, `~` — the name does not matter: the prefix is a nickname for
 * `baseUrl`, and the rest is the path inside the project. Handling only `@/`
 * let an alias like `@app/components` escape the substitution and become a
 * literal folder named `@app` at the root, outside anything the tsconfig maps.
 */
export function splitAlias(alias: string): { prefix: string; rest: string } {
  const clean = alias.replace(/\/+$/, '');
  const separator = clean.indexOf('/');

  if (separator === -1) return { prefix: clean, rest: '' };

  return { prefix: clean.slice(0, separator), rest: clean.slice(separator + 1) };
}

/** The alias prefix, with `/*` — the key the tsconfig has to map. */
export function aliasPattern(alias: string): string {
  return `${splitAlias(alias).prefix}/*`;
}

export function resolveAliasToPath(alias: string, baseUrl: string): string {
  const { rest } = splitAlias(alias);
  const base = baseUrl.replace(/\/+$/, '');

  return rest ? `${base}/${rest}` : base;
}

export async function resolveConfigPaths(cwd: string, config: Config) {
  const { baseUrl, aliases } = config;

  return {
    ...config,
    resolvedPaths: {
      tailwindCss: path.resolve(cwd, config.tailwind.css),
      baseUrl: path.resolve(cwd, baseUrl),
      components: path.resolve(cwd, resolveAliasToPath(aliases.components, baseUrl)),
      utils: path.resolve(cwd, resolveAliasToPath(aliases.utils, baseUrl)),
      core: path.resolve(cwd, resolveAliasToPath(aliases.core, baseUrl)),
      services: path.resolve(cwd, resolveAliasToPath(aliases.services, baseUrl)),
      blocks: path.resolve(cwd, resolveAliasToPath(aliases.blocks, baseUrl)),
    },
  };
}
