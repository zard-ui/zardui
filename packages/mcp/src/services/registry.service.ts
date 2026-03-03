import type { BlockData, BlocksRegistry, ComponentData, RegistryIndex, RegistryItem } from '../types/registry.types.js';

const REGISTRY_TTL = 5 * 60 * 1000; // 5 minutes
const FETCH_TIMEOUT = 10_000; // 10 seconds

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class RegistryService {
  private registryCache: CacheEntry<RegistryIndex> | null = null;
  private componentCache = new Map<string, ComponentData>();
  private blocksRegistryCache: CacheEntry<BlocksRegistry> | null = null;
  private blockCache = new Map<string, BlockData>();

  private get baseUrl(): string {
    return process.env['ZARD_REGISTRY_URL'] || 'https://zardui.com/r';
  }

  private async fetchJson<T>(url: string): Promise<T> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: { 'User-Agent': 'zard-mcp' },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return (await response.json()) as T;
    } finally {
      clearTimeout(timeout);
    }
  }

  async getRegistry(): Promise<RegistryIndex> {
    if (this.registryCache && Date.now() - this.registryCache.timestamp < REGISTRY_TTL) {
      return this.registryCache.data;
    }

    const data = await this.fetchJson<RegistryIndex>(`${this.baseUrl}/registry.json`);
    this.registryCache = { data, timestamp: Date.now() };
    return data;
  }

  async getItems(): Promise<RegistryItem[]> {
    const registry = await this.getRegistry();
    return registry.items;
  }

  async getComponent(name: string): Promise<ComponentData> {
    const cached = this.componentCache.get(name);
    if (cached) return cached;

    const data = await this.fetchJson<ComponentData>(`${this.baseUrl}/${name}.json`);
    this.componentCache.set(name, data);
    return data;
  }

  async getBlocksRegistry(): Promise<BlocksRegistry> {
    if (this.blocksRegistryCache && Date.now() - this.blocksRegistryCache.timestamp < REGISTRY_TTL) {
      return this.blocksRegistryCache.data;
    }

    const data = await this.fetchJson<BlocksRegistry>(`${this.baseUrl}/blocks-registry.json`);
    this.blocksRegistryCache = { data, timestamp: Date.now() };
    return data;
  }

  async getBlock(id: string): Promise<BlockData> {
    const cached = this.blockCache.get(id);
    if (cached) return cached;

    const data = await this.fetchJson<BlockData>(`${this.baseUrl}/blocks/${id}.json`);
    this.blockCache.set(id, data);
    return data;
  }
}

export const registryService = new RegistryService();
