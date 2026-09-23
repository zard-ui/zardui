import { DEFAULT_REGISTRY_URL as BUILD_REGISTRY_URL } from '@cli/config/registry-config.js';
import { isIconFamily, retargetIcons, SOURCE_ICON_FAMILY, type IconFamily } from '@cli/core/icons/index.js';
import type { Config } from '@cli/utils/config.js';
import { ConfigError } from '@cli/utils/errors.js';
import { fetchJson } from '@cli/utils/http-client.js';
import { iconCatalog } from '@cli/utils/icon-catalog.js';
import { logger } from '@cli/utils/logger.js';
import { assertSupportedSchema } from '@cli/utils/schema-version.js';

export const DEFAULT_REGISTRY_URL =
  process.env['ZARD_REGISTRY_URL'] ||
  (BUILD_REGISTRY_URL !== '__REGISTRY_URL__' ? BUILD_REGISTRY_URL : 'https://zardui.com/r');

/**
 * The icons a component draws, as the registry publishes them.
 *
 * `family` is the family the files are written in — anyone installing with a
 * different family in `components.json` learns from this field that they need
 * rewriting. Absent from items published before this property existed.
 */
export interface RegistryIcons {
  family: string;
  symbols: string[];
  tokens: string[];
  /** The icons that only appear in the demos. Absent from the index, which does not carry them. */
  demos?: { symbols: string[]; tokens: string[] };
}

export interface RegistryItem {
  name: string;
  type: 'registry:component';
  basePath?: string;
  files: Array<{
    name: string;
    content: string;
  }>;
  dependencies?: string[];
  devDependencies?: string[];
  registryDependencies?: string[];
  icons?: RegistryIcons;
}

export interface RegistryIndex {
  $schema: string;
  /** The file's shape. Absent from registries older than the field. */
  schemaVersion?: number;
  name: string;
  homepage: string;
  version: string;
  items: Array<{
    name: string;
    type: string;
    basePath?: string;
    dependencies?: string[];
    devDependencies?: string[];
    registryDependencies?: string[];
    icons?: RegistryIcons;
    files: string[];
  }>;
}

/**
 * The family the item's files are written in.
 *
 * An item with no `icons` — published before the property existed — is in
 * lucide, which was the only possibility. So is an unknown value: better the
 * right guess than refusing to install over an unfamiliar field.
 */
export function sourceFamilyOf(item: Pick<RegistryItem, 'icons'>): IconFamily {
  const family = item.icons?.family;
  return family !== undefined && isIconFamily(family, iconCatalog()) ? family : SOURCE_ICON_FAMILY;
}

export function getRegistryUrl(config?: Config): string {
  return config?.registryUrl || DEFAULT_REGISTRY_URL;
}

export function validateRegistryUrl(url: string): void {
  try {
    const parsed = new URL(url);
    const isHttps = parsed.protocol === 'https:';
    const isLocalhost = parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1';

    if (!isHttps && !isLocalhost) {
      throw new ConfigError('Registry URL must use HTTPS (or localhost for development)');
    }
  } catch (error) {
    if (error instanceof ConfigError) throw error;
    throw new ConfigError(`Invalid registry URL: ${url}`);
  }
}

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Keyed by registry URL, not global.
 *
 * `registryUrl` is a `components.json` field, so two registries can be read in one
 * run — and a single cache entry handed the second call the first registry's index.
 */
const registryIndexCache = new Map<string, { data: RegistryIndex; timestamp: number }>();

export async function fetchRegistryIndex(registryUrl?: string): Promise<RegistryIndex> {
  const baseUrl = registryUrl || DEFAULT_REGISTRY_URL;
  const cached = registryIndexCache.get(baseUrl);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const url = `${baseUrl}/registry.json`;
  const data = await fetchJson<RegistryIndex>(url);

  assertSupportedSchema(data.schemaVersion, 'registry.json');

  registryIndexCache.set(baseUrl, { data, timestamp: Date.now() });
  return data;
}

export function invalidateRegistryCache(): void {
  registryIndexCache.clear();
}

export async function fetchComponentFromRegistry(componentName: string, registryUrl?: string): Promise<RegistryItem> {
  const baseUrl = registryUrl || DEFAULT_REGISTRY_URL;
  const url = `${baseUrl}/${componentName}.json`;
  return fetchJson<RegistryItem>(url);
}

export async function getAvailableComponents(registryUrl?: string): Promise<string[]> {
  const index = await fetchRegistryIndex(registryUrl);
  return index.items.map(item => item.name);
}

/** Sem isto, um alias digitado como `@/ui/components/` produz `@/ui/components//button`. */
function trimSlashes(alias: string): string {
  return alias.replace(/\/+$/, '');
}

export interface TransformOptions {
  /**
   * The destination came from `--path`, outside the configured alias.
   *
   * In that case the batch's components become neighbours on disk, and the
   * relative path is what resolves — the alias would point at the folder they are
   * not in. `utils` and `core` stay on the alias, because `init` installed them.
   */
  readonly siblingComponents?: boolean;
}

export function transformContent(content: string, config: Config, options: TransformOptions = {}): string {
  let transformed = content;

  const aliases = {
    components: options.siblingComponents ? '..' : trimSlashes(config.aliases.components),
    utils: trimSlashes(config.aliases.utils),
    core: trimSlashes(config.aliases.core),
    services: trimSlashes(config.aliases.services),
  };

  // Replace relative component imports with aliased imports
  const componentImportRegex = /from ['"]\.\.\/([\w-/.]+)['"]/g;
  transformed = transformed.replace(componentImportRegex, `from '${aliases.components}/$1'`);

  // Replace ClassValue imports
  transformed = transformed.replace(
    /import \{ ClassValue \} from ['"]class-variance-authority\/dist\/types['"]/g,
    `import { ClassValue } from 'clsx'`,
  );
  transformed = transformed.replace(
    /import \{ ClassValue \} from ['"]class-variance-authority['"]/g,
    `import { ClassValue } from 'clsx'`,
  );

  // Transform default @/shared/* to match aliases
  for (const [key, value] of Object.entries(aliases)) {
    if (!value) {
      continue;
    }

    // The subpath is optional: `card.component.ts` imports the barrel directly
    // (`from '@/shared/core'`). Requiring `/something` after the key let that
    // import escape the substitution, and the installed component kept pointing
    // at `@/shared/core` — a folder that does not exist under a custom alias.
    const regex = new RegExp(`(['"])@\\/shared\\/${key}(\\/[\\w\\-\\/.]+)?\\1`, 'g');
    transformed = transformed.replace(regex, (_match, quote: string, subpath?: string) => {
      return `${quote}${value}${subpath ?? ''}${quote}`;
    });
  }

  return transformed;
}

export async function fetchComponent(
  componentName: string,
  config: Config,
  registryUrl?: string,
  options: TransformOptions = {},
): Promise<RegistryItem> {
  const item = await fetchComponentFromRegistry(componentName, registryUrl);

  if (!item.files || !Array.isArray(item.files)) {
    throw new ConfigError(`Component "${componentName}" has no files in the registry`);
  }

  const sourceFamily = sourceFamilyOf(item);
  const missing = new Set<string>();

  const transformedFiles = item.files.map(file => {
    const retargeted = retargetIcons(
      transformContent(file.content, config, options),
      sourceFamily,
      config.icons,
      iconCatalog(),
    );
    for (const symbol of retargeted.missing) missing.add(symbol);

    return { name: file.name, content: retargeted.content };
  });

  // An icon with no equivalent in the chosen family keeps its original symbol,
  // and its import no longer resolves. Failing the whole install over that would
  // be worse: the rest of the component is correct and the fix is one line.
  if (missing.size > 0) {
    logger.warn(
      `"${componentName}" uses icons that ${config.icons} does not provide: ${[...missing].sort().join(', ')}. ` +
        'They were left untouched — replace them by hand.',
    );
  }

  return {
    ...item,
    files: transformedFiles,
  };
}
