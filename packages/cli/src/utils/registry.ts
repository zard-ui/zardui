import { DEFAULT_REGISTRY_URL as BUILD_REGISTRY_URL } from '@cli/config/registry-config.js';
import type { Config } from '@cli/utils/config.js';
import { execa } from 'execa';

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

async function fetchJson<T>(url: string): Promise<T> {
  try {
    const { stdout } = await execa('curl', [
      '-s',
      '-H',
      'Accept: application/json',
      '-H',
      'User-Agent: ngzard-cli',
      '--max-time',
      '30',
      url,
    ]);

    if (!stdout || stdout.includes('<!DOCTYPE') || stdout.includes('<html')) {
      throw new Error(`Invalid response from registry: ${url}`);
    }

    return JSON.parse(stdout) as T;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Invalid JSON response from registry: ${url}`);
    }
    throw new Error(`Failed to fetch from registry: ${url} - ${error}`);
  }
}

export async function fetchRegistryIndex(registryUrl?: string): Promise<RegistryIndex> {
  const baseUrl = registryUrl || DEFAULT_REGISTRY_URL;
  const url = `${baseUrl}/registry.json`;
  return fetchJson<RegistryIndex>(url);
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

  return transformed;
}

export async function fetchComponent(
  componentName: string,
  config: Config,
  registryUrl?: string,
): Promise<RegistryItem> {
  const item = await fetchComponentFromRegistry(componentName, registryUrl);

  const transformedFiles = item.files.map(file => ({
    name: file.name,
    content: transformContent(file.content, config),
  }));

  return {
    ...item,
    files: transformedFiles,
  };
}
