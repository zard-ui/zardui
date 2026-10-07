import type { BlockData, BlocksRegistry, ComponentData, RegistryIndex, RegistryItem } from '../types/registry.types.js';
import { fetchWithTimeout, HttpError, isHtmlShell } from '../utils/http.js';
import { assertRegistryId } from '../utils/identifiers.js';

const REGISTRY_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * The registry format this server knows how to read.
 *
 * A newer registry may have reorganised the item, and reading its `files`
 * blindly would hand wrong code to whoever trusts the answer. Absent means v1,
 * from before the field existed.
 */
const SUPPORTED_SCHEMA_VERSION = 1;

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

/**
 * Every cache expires. The server lives as long as the editor does — days,
 * sometimes — and a release in the meantime must reach the next answer.
 */
function fresh(entry: CacheEntry<unknown>): boolean {
  return Date.now() - entry.timestamp < REGISTRY_TTL;
}

class RegistryService {
  private registryCache: CacheEntry<RegistryIndex> | null = null;
  private componentCache = new Map<string, CacheEntry<ComponentData>>();
  private blocksRegistryCache: CacheEntry<BlocksRegistry> | null = null;
  private blockCache = new Map<string, CacheEntry<BlockData>>();

  private get baseUrl(): string {
    return process.env['ZARD_REGISTRY_URL'] || 'https://zardui.com/r';
  }

  private async fetchJson<T>(url: string): Promise<T> {
    const response = await fetchWithTimeout(url);
    if (!response.ok) throw new HttpError(response);
    if (isHtmlShell(response)) throw new HttpError({ status: 404, statusText: 'Not Found' });
    return (await response.json()) as T;
  }

  async getRegistry(): Promise<RegistryIndex> {
    if (this.registryCache && fresh(this.registryCache)) {
      return this.registryCache.data;
    }

    const data = await this.fetchJson<RegistryIndex>(`${this.baseUrl}/registry.json`);

    if ((data.schemaVersion ?? 1) > SUPPORTED_SCHEMA_VERSION) {
      throw new Error(
        `This registry publishes format v${data.schemaVersion}, and this MCP server reads up to ` +
          `v${SUPPORTED_SCHEMA_VERSION}. Update zard-mcp.`,
      );
    }

    this.registryCache = { data, timestamp: Date.now() };
    return data;
  }

  async getItems(): Promise<RegistryItem[]> {
    const registry = await this.getRegistry();
    return registry.items;
  }

  async getComponent(name: string): Promise<ComponentData> {
    // Validated here, before the cache and the URL: the name is what becomes a path.
    assertRegistryId(name, 'component');

    const cached = this.componentCache.get(name);
    if (cached && fresh(cached)) return cached.data;

    const data = await this.fetchJson<ComponentData>(`${this.baseUrl}/${name}.json`);
    this.componentCache.set(name, { data, timestamp: Date.now() });
    return data;
  }

  async getBlocksRegistry(): Promise<BlocksRegistry> {
    if (this.blocksRegistryCache && fresh(this.blocksRegistryCache)) {
      return this.blocksRegistryCache.data;
    }

    const data = await this.fetchJson<BlocksRegistry>(`${this.baseUrl}/blocks-registry.json`);
    this.blocksRegistryCache = { data, timestamp: Date.now() };
    return data;
  }

  async getBlock(id: string): Promise<BlockData> {
    assertRegistryId(id, 'block');

    const cached = this.blockCache.get(id);
    if (cached && fresh(cached)) return cached.data;

    const data = await this.fetchJson<BlockData>(`${this.baseUrl}/blocks/${id}.json`);
    this.blockCache.set(id, { data, timestamp: Date.now() });
    return data;
  }
}

export const registryService = new RegistryService();
