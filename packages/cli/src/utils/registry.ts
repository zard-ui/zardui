import { DEFAULT_REGISTRY_URL as BUILD_REGISTRY_URL } from '@cli/config/registry-config.js';
import type { Config } from '@cli/utils/config.js';
import { ConfigError } from '@cli/utils/errors.js';
import { fetchJson } from '@cli/utils/http-client.js';

export const DEFAULT_REGISTRY_URL =
  process.env['ZARD_REGISTRY_URL'] ||
  (BUILD_REGISTRY_URL !== '__REGISTRY_URL__' ? BUILD_REGISTRY_URL : 'https://zardui.com/r');

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
}

export interface RegistryIndex {
  $schema: string;
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
    files: string[];
  }>;
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
let registryIndexCache: { data: RegistryIndex; timestamp: number } | null = null;

export async function fetchRegistryIndex(registryUrl?: string): Promise<RegistryIndex> {
  const baseUrl = registryUrl || DEFAULT_REGISTRY_URL;

  if (registryIndexCache && Date.now() - registryIndexCache.timestamp < CACHE_TTL) {
    return registryIndexCache.data;
  }

  const url = `${baseUrl}/registry.json`;
  const data = await fetchJson<RegistryIndex>(url);

  registryIndexCache = { data, timestamp: Date.now() };
  return data;
}

export function invalidateRegistryCache(): void {
  registryIndexCache = null;
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

export function transformContent(content: string, config: Config): string {
  let transformed = content;

  const { aliases } = config;

  // Replace utils imports
  transformed = transformed.replace(
    /from ['"]\.\.\/\.\.\/shared\/utils\/utils['"]/g,
    `from '${aliases.utils}/merge-classes'`,
  );

  transformed = transformed.replace(
    /from ['"]\.\.\/\.\.\/shared\/utils\/number['"]/g,
    `from '${aliases.utils}/number'`,
  );

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

    const regex = new RegExp(`(['"])@\\/shared\\/${key}\\/([\\w\\-\\/.]+)\\1`, 'g');
    transformed = transformed.replace(regex, `$1${value}/$2$1`);
  }

  return transformed;
}

export async function fetchComponent(
  componentName: string,
  config: Config,
  registryUrl?: string,
): Promise<RegistryItem> {
  const item = await fetchComponentFromRegistry(componentName, registryUrl);

  if (!item.files || !Array.isArray(item.files)) {
    throw new ConfigError(`Component "${componentName}" has no files in the registry`);
  }

  const transformedFiles = item.files.map(file => ({
    name: file.name,
    content: transformContent(file.content, config),
  }));

  return {
    ...item,
    files: transformedFiles,
  };
}
