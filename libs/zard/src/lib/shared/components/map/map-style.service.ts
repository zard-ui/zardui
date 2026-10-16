import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { computed, inject, Injectable, InjectionToken, PLATFORM_ID, signal } from '@angular/core';

import {
  findZardMapPreset,
  ZARD_MAP_DEFAULT_PRESET_ID,
  ZARD_MAP_PRESETS,
  type ZardMapPreset,
  type ZardMapProvider,
  type ZardMapStyles,
} from './map-styles';

// This file must not import `ng-mapcn`: the picker and any non-lazy code inject the service, and ng-mapcn is not
// tree-shakeable (it pulls all of MapLibre). `provideZardMap()` is the only bridge between the two.

export type ZardMapKeys = Partial<Record<ZardMapProvider, string>>;

export interface ZardMapStyleConfig {
  /** The catalogue the picker lists and the service resolves ids against. Defaults to `ZARD_MAP_PRESETS`. */
  presets?: readonly ZardMapPreset[];
  /** Preset every map starts with, by id. A stored choice wins when `persist` is on. Defaults to Carto Positron. */
  style?: string;
  /** API keys of the key-based providers. A preset that needs a key is only picked once its provider has one. */
  keys?: ZardMapKeys;
  /**
   * Remembers the picked preset (and the keys typed into the picker) in `localStorage`, browser only. `true` uses the
   * `zard-map-style` key, a string picks the key. Ignored on the server and when storage is unavailable.
   */
  persist?: boolean | string;
}

/** Why `select()` did not change the basemap. */
export type ZardMapSelectResult = 'selected' | 'unknown-preset' | 'needs-key';

export const ZARD_MAP_STYLE_CONFIG = new InjectionToken<ZardMapStyleConfig>('ZARD_MAP_STYLE_CONFIG');

const DEFAULT_STORAGE_KEY = 'zard-map-style';

/**
 * The active basemap of every map on the page.
 *
 * It lives in the root injector on purpose: the lazy routes that render maps register their own
 * `provideZardMap()`, and they all share this one state, so a choice made on one page is the one the next page opens
 * with. `styles` is the signal `provideZardMap()` hands to ng-mapcn: setting a preset swaps the basemap of every
 * `<ng-map>` without a `[styles]` of its own, live, with no reload and no remount.
 */
@Injectable({ providedIn: 'root' })
export class ZardMapStyleService {
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly configs = new WeakSet<ZardMapStyleConfig>();
  private storageKey: string | null = null;
  private initialized = false;

  private readonly presetsState = signal<readonly ZardMapPreset[]>(ZARD_MAP_PRESETS);
  private readonly presetIdState = signal(ZARD_MAP_DEFAULT_PRESET_ID);
  private readonly keysState = signal<ZardMapKeys>({});

  /** Every preset the picker lists. */
  readonly presets = this.presetsState.asReadonly();
  /** Id of the preset in use. */
  readonly presetId = this.presetIdState.asReadonly();
  /** Keys known to the service, by provider. */
  readonly keys = this.keysState.asReadonly();

  /** The preset in use. A key-based preset without a key is not "in use": the default stands in until it has one. */
  readonly preset = computed<ZardMapPreset>(() => {
    const presets = this.presetsState();
    const fallback = findZardMapPreset(ZARD_MAP_DEFAULT_PRESET_ID, presets) ?? presets[0] ?? ZARD_MAP_PRESETS[0];
    const preset = findZardMapPreset(this.presetIdState(), presets) ?? fallback;

    return this.canUse(preset, this.keysState()) ? preset : fallback;
  });

  /** The light and dark styles of the preset in use. This is what `provideZardMap()` feeds into ng-mapcn. */
  readonly styles = computed<ZardMapStyles>(() => {
    const preset = this.preset();
    return preset.styles(preset.requiresKey ? this.keysState()[preset.provider] : undefined);
  });

  /**
   * Applies a config once per object. The first call also decides where the app starts: the stored choice (with
   * `persist`), else `config.style`, else Carto Positron. Later calls (another lazy route with its own
   * `provideZardMap()`) only add keys and persistence, they never move the basemap under the user.
   */
  configure(config: ZardMapStyleConfig = {}): void {
    if (this.configs.has(config)) {
      return;
    }
    this.configs.add(config);

    if (config.presets?.length) {
      this.presetsState.set(config.presets);
    }
    if (config.persist && !this.storageKey) {
      this.storageKey = typeof config.persist === 'string' ? config.persist : DEFAULT_STORAGE_KEY;
    }

    const stored = this.read();
    // A key given in config is the developer's; one typed into the picker is the user's. The developer's wins.
    this.keysState.update(current => ({ ...current, ...stored.keys, ...config.keys }));

    if (this.initialized) {
      return;
    }
    this.initialized = true;

    const keys = this.keysState();
    const candidates = [stored.preset, config.style];
    for (const id of candidates) {
      const preset = findZardMapPreset(id, this.presetsState());
      if (preset && this.canUse(preset, keys)) {
        this.presetIdState.set(preset.id);
        return;
      }
    }
  }

  /**
   * Switches every map to a preset, live. A key-based preset needs its provider's key: pass `key` the first time, or
   * set it with `setKey()`. Without one nothing changes (and no request goes out), and the result says why.
   */
  select(id: string, key?: string): ZardMapSelectResult {
    const preset = findZardMapPreset(id, this.presetsState());
    if (!preset) {
      return 'unknown-preset';
    }

    const typed = key?.trim();
    if (typed && preset.requiresKey) {
      this.setKey(preset.provider, typed);
    }
    if (!this.canUse(preset, this.keysState())) {
      return 'needs-key';
    }

    this.presetIdState.set(preset.id);
    this.write();
    return 'selected';
  }

  /** Stores the key of a provider. An empty key forgets it, and a preset that needed it falls back to the default. */
  setKey(provider: ZardMapProvider, key: string): void {
    const trimmed = key.trim();
    this.keysState.update(current => {
      const next = { ...current };
      if (trimmed) {
        next[provider] = trimmed;
      } else {
        delete next[provider];
      }
      return next;
    });
    this.write();
  }

  /** Back to the default preset (and store that, when persistence is on). */
  reset(): void {
    this.presetIdState.set(ZARD_MAP_DEFAULT_PRESET_ID);
    this.write();
  }

  private canUse(preset: ZardMapPreset, keys: ZardMapKeys): boolean {
    return !preset.requiresKey || !!keys[preset.provider];
  }

  private get storage(): Storage | null {
    if (!this.isBrowser || !this.storageKey) {
      return null;
    }
    try {
      return this.document.defaultView?.localStorage ?? null;
    } catch {
      // Blocked storage (privacy mode, sandboxed iframe): the choice just lasts until the page closes.
      return null;
    }
  }

  private read(): { preset?: string; keys: ZardMapKeys } {
    const { storage } = this;
    if (!storage || !this.storageKey) {
      return { keys: {} };
    }

    try {
      const preset = storage.getItem(this.storageKey) ?? undefined;
      return { preset, keys: parseKeys(storage.getItem(`${this.storageKey}:keys`)) };
    } catch {
      return { keys: {} };
    }
  }

  private write(): void {
    const { storage } = this;
    if (!storage || !this.storageKey) {
      return;
    }

    try {
      storage.setItem(this.storageKey, this.presetIdState());
      const keys = this.keysState();
      if (Object.keys(keys).length > 0) {
        storage.setItem(`${this.storageKey}:keys`, JSON.stringify(keys));
      } else {
        storage.removeItem(`${this.storageKey}:keys`);
      }
    } catch {
      // Quota exceeded or storage blocked: nothing to recover, the in-memory choice still applies.
    }
  }
}

/** Anything that is not an object of non-empty strings is dropped, so a corrupted value just means "no keys". */
function parseKeys(raw: string | null): ZardMapKeys {
  if (!raw) {
    return {};
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return {};
    }

    const keys: ZardMapKeys = {};
    for (const [provider, key] of Object.entries(parsed)) {
      if (typeof key === 'string' && key.trim()) {
        keys[provider as ZardMapProvider] = key.trim();
      }
    }
    return keys;
  } catch {
    return {};
  }
}
