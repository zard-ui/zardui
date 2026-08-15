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
 * Os ícones que um componente desenha, como o registry os publica.
 *
 * `family` é a família em que os arquivos estão escritos — quem instala com
 * outra família em `components.json` sabe, por este campo, que precisa
 * reescrevê-los. Ausente nos itens publicados antes desta propriedade.
 */
export interface RegistryIcons {
  family: string;
  symbols: string[];
  tokens: string[];
  /** Os ícones que só aparecem nos demos. Ausente no índice, que não os carrega. */
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
  /** A forma do arquivo. Ausente nos registries anteriores ao campo. */
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
 * A família em que os arquivos do item estão escritos.
 *
 * Um item sem `icons` — publicado antes da propriedade — está em lucide, que
 * era a única possibilidade. Um valor desconhecido também: preferir o palpite
 * certo a recusar a instalação por causa de um campo novo.
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
let registryIndexCache: { data: RegistryIndex; timestamp: number } | null = null;

export async function fetchRegistryIndex(registryUrl?: string): Promise<RegistryIndex> {
  const baseUrl = registryUrl || DEFAULT_REGISTRY_URL;

  if (registryIndexCache && Date.now() - registryIndexCache.timestamp < CACHE_TTL) {
    return registryIndexCache.data;
  }

  const url = `${baseUrl}/registry.json`;
  const data = await fetchJson<RegistryIndex>(url);

  assertSupportedSchema(data.schemaVersion, 'registry.json');

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

/** Sem isto, um alias digitado como `@/ui/components/` produz `@/ui/components//button`. */
function trimSlashes(alias: string): string {
  return alias.replace(/\/+$/, '');
}

export interface TransformOptions {
  /**
   * O destino veio de `--path`, fora do alias configurado.
   *
   * Nesse caso os componentes do lote viram vizinhos no disco, e é o caminho
   * relativo que resolve — o alias apontaria para a pasta onde eles não estão.
   * `utils` e `core` continuam no alias, porque quem os instalou foi o `init`.
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

    // O subpath é opcional: `card.component.ts` importa o barrel direto
    // (`from '@/shared/core'`). Exigindo `/algo` depois da chave, esse import
    // escapava da substituição e o componente instalado continuava apontando
    // para `@/shared/core` — uma pasta que não existe com alias customizado.
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

  // Um ícone sem equivalente na família escolhida fica no símbolo original, e o
  // import dele não resolve mais. Falhar a instalação inteira por causa disso
  // seria pior: o resto do componente está correto e o conserto é uma linha.
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
