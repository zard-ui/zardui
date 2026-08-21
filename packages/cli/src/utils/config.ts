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
  style: z.enum(['css']).default('css'),
  // The icon family the components are written in. Absent from files written
  // before the property existed — and lucide is what those use.
  //
  // Not an enum: the valid families are the ones the registry publishes at run
  // time, not the ones that existed when this CLI was compiled. Closing the list
  // here would make an old CLI reject a new family, which is exactly what the
  // remote catalog exists to avoid. `assertIconFamily` validates the value
  // against the catalog, with a message that names the options.
  icons: z.string().default(SOURCE_ICON_FAMILY),
  // Layout direction. It does not change what gets installed yet: it exists so
  // the project can declare the intent, and so a reader knows the field is ours.
  rtl: z.boolean().default(false),
  // Absent from components.json files written before the project-type menu; an
  // Angular application is what those describe.
  projectType: z.enum(['angular', 'angular-library', 'nx', 'nx-library', 'analog']).default('angular'),
  packageManager: z.enum(['npm', 'yarn', 'pnpm', 'bun']).default('npm'),
  registryUrl: z.string().optional(),
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
    })
    .default({
      components: '@/shared/components',
      utils: '@/shared/utils',
      core: '@/shared/core',
      services: '@/shared/services',
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
  },
};

export async function getConfig(cwd: string): Promise<Config | null> {
  const configPath = path.resolve(cwd, 'components.json');

  if (!(await pathExists(configPath))) {
    return null;
  }

  try {
    const configJson = await readJson(configPath);
    const config = configSchema.parse(configJson);

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
    },
  };
}
