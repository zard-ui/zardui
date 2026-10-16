---
title: Map
description: Beautiful maps built on MapLibre GL, themed with zard. Copy and paste into your apps.
---

# Map

Beautiful maps built on MapLibre GL, themed with zard. Copy and paste into your apps.

## About

The map is powered by ng-mapcn on top of MapLibre GL, and ng-mapcn is an Angular port of mapcn. Zard themes it and adds the basemap presets and the picker.

- [ng-mapcn](https://ng-mapcn.vercel.app): The Angular map components this item is built on (MIT).
- [MapLibre GL JS](https://maplibre.org): The rendering engine (BSD-3-Clause).
- [mapcn](https://www.mapcn.dev): The React library whose component API and look ng-mapcn ports.

ng-mapcn is still pre-1.0 upstream and ships betas only, so zard pins it to an exact version. Updating it is a deliberate step. Basemap attribution, such as © OpenStreetMap and © CARTO, stays visible on every map.

## Installation

### CLI

```bash
npx zard-cli@latest add map
```

### Manual

```angular-ts
// Nothing here touches MapLibre when the module is evaluated: `ng-mapcn` only creates a map inside
// `afterNextRender`, so the barrel is safe to import on the server. Lazy-load the routes or `@defer`
// blocks that render `<ng-map>` to keep the engine out of the initial bundle.
export * from './map.imports';
export * from './map.provider';
export * from './map-style.service';
export * from './map-styles';
```

```angular-ts
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
```

```angular-ts
import type { StyleSpecification } from 'maplibre-gl';

// Plain data: this file must not import `ng-mapcn` (or anything that evaluates MapLibre), because the picker, the
// docs and any non-lazy code read the catalogue. `maplibre-gl` is imported for types only and is erased.

/** Who serves the tiles. Drives the grouping of the picker and the usage notes of the docs. */
export type ZardMapProvider = 'carto' | 'openfreemap' | 'osm' | 'maptiler' | 'stadia';

/** A MapLibre style: a style JSON URL, or the style object itself. */
export type ZardMapStyleValue = string | StyleSpecification;

/** One basemap per theme, the shape `<ng-map [styles]>` and `provideMapStyles()` take. */
export interface ZardMapStyles {
  readonly light: ZardMapStyleValue;
  readonly dark: ZardMapStyleValue;
}

export interface ZardMapPreset {
  /** Stable id: what `provideZardMap({ style })` takes and what `persist` stores. */
  readonly id: string;
  readonly label: string;
  readonly provider: ZardMapProvider;
  /** The name of the style in each theme, for the docs table. */
  readonly variants: { readonly light: string; readonly dark: string };
  /** What the basemap looks like in light and dark, in one line. */
  readonly description: string;
  /** Needs an API key from the provider. The key is never part of the catalogue: it comes from config or the picker. */
  readonly requiresKey: boolean;
  /** Not for production traffic: the provider's usage policy forbids it. */
  readonly devOnly: boolean;
  /** Attribution the basemap requires. MapLibre prints it in the corner of every map, keep it visible. */
  readonly attribution: string;
  /** Representative colors of the two variants, for the small swatch next to the label. */
  readonly swatch: { readonly light: string; readonly dark: string };
  /**
   * The light and dark styles. Key-based presets get the key; the keyless ones ignore it. Keep the returned objects
   * referentially stable for the same input: `<ng-map>` compares styles by identity before it calls `setStyle`.
   */
  readonly styles: (key?: string) => ZardMapStyles;
}

export interface ZardMapProviderInfo {
  readonly id: ZardMapProvider;
  readonly label: string;
  readonly url: string;
  readonly requiresKey: boolean;
  /** Where to get a key, for the providers that need one. */
  readonly keyUrl?: string;
  /** What to know before shipping it. */
  readonly limits: string;
}

export const ZARD_MAP_PROVIDERS: readonly ZardMapProviderInfo[] = [
  {
    id: 'carto',
    label: 'Carto',
    url: 'https://carto.com/basemaps',
    requiresKey: false,
    limits: 'Free for non-commercial and low-traffic use. Commercial products need a Carto plan.',
  },
  {
    id: 'openfreemap',
    label: 'OpenFreeMap',
    url: 'https://openfreemap.org',
    requiresKey: false,
    limits: 'Free with no registration and no hard limit. Donations keep it running.',
  },
  {
    id: 'osm',
    label: 'OpenStreetMap',
    url: 'https://operations.osmfoundation.org/policies/tiles/',
    requiresKey: false,
    limits: 'Development and demos only. The tile usage policy forbids heavy or production traffic.',
  },
  {
    id: 'maptiler',
    label: 'MapTiler',
    url: 'https://www.maptiler.com/cloud/',
    requiresKey: true,
    keyUrl: 'https://cloud.maptiler.com/account/keys/',
    limits: 'Free plan for non-commercial use with a monthly request quota. Restrict the key to your domain.',
  },
  {
    id: 'stadia',
    label: 'Stadia Maps',
    url: 'https://stadiamaps.com',
    requiresKey: true,
    keyUrl: 'https://client.stadiamaps.com/dashboard/',
    limits: 'Works without a key on localhost. Production domains need a (free) account and a key.',
  },
];

const OSM_ATTRIBUTION = '© OpenStreetMap contributors';
const CARTO_ATTRIBUTION = '© OpenStreetMap contributors © CARTO';
const OPENFREEMAP_ATTRIBUTION = '© OpenFreeMap © OpenMapTiles Data from OpenStreetMap';
const MAPTILER_ATTRIBUTION = '© MapTiler © OpenStreetMap contributors';
const STADIA_ATTRIBUTION = '© Stadia Maps © OpenMapTiles © OpenStreetMap contributors';

const carto = (name: string): string => `https://basemaps.cartocdn.com/gl/${name}-gl-style/style.json`;
const openFreeMap = (name: string): string => `https://tiles.openfreemap.org/styles/${name}`;
const mapTiler = (name: string, key: string): string =>
  `https://api.maptiler.com/maps/${name}/style.json?key=${encodeURIComponent(key)}`;
const stadia = (name: string, key: string): string =>
  `https://tiles.stadiamaps.com/styles/${name}.json?api_key=${encodeURIComponent(key)}`;

/** Raster tiles are a style of their own. Built once so `<ng-map>` sees the same object every time. */
const osmRasterStyle = (dim: boolean): StyleSpecification => ({
  version: 8,
  sources: {
    osm: {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      maxzoom: 19,
      attribution: OSM_ATTRIBUTION,
    },
  },
  layers: [
    {
      id: 'osm',
      type: 'raster',
      source: 'osm',
      paint: dim ? { 'raster-brightness-max': 0.45, 'raster-saturation': -0.6 } : {},
    },
  ],
});

const OSM_STYLES: ZardMapStyles = Object.freeze({ light: osmRasterStyle(false), dark: osmRasterStyle(true) });

/** Id of the preset every app starts with: the Carto Positron / Dark Matter pair. */
export const ZARD_MAP_DEFAULT_PRESET_ID = 'carto-positron';

/** Keyless presets cache their (constant) styles, keyed ones one object per key. */
const keyless = (styles: ZardMapStyles): ((key?: string) => ZardMapStyles) => {
  const frozen = Object.freeze(styles);
  return () => frozen;
};

const keyed = (build: (key: string) => ZardMapStyles): ((key?: string) => ZardMapStyles) => {
  const cache = new Map<string, ZardMapStyles>();
  return (key = '') => {
    let styles = cache.get(key);
    if (!styles) {
      styles = Object.freeze(build(key));
      cache.set(key, styles);
    }
    return styles;
  };
};

/**
 * The basemaps zard ships, in the order the picker lists them. Keyless presets work out of the box; the key-based ones
 * (MapTiler, Stadia) need a key from `provideZardMap({ keys })` or the picker, and are never hard-coded.
 */
export const ZARD_MAP_PRESETS: readonly ZardMapPreset[] = [
  {
    id: 'carto-positron',
    label: 'Positron',
    provider: 'carto',
    variants: { light: 'Positron', dark: 'Dark Matter' },
    description: 'Clean light gray basemap that turns into Dark Matter in dark mode. The default.',
    requiresKey: false,
    devOnly: false,
    attribution: CARTO_ATTRIBUTION,
    swatch: { light: '#f1f1ef', dark: '#1f1f1f' },
    styles: keyless({ light: carto('positron'), dark: carto('dark-matter') }),
  },
  {
    id: 'carto-voyager',
    label: 'Voyager',
    provider: 'carto',
    variants: { light: 'Voyager', dark: 'Dark Matter' },
    description: 'Warm, colorful street map in light mode, Dark Matter in dark mode.',
    requiresKey: false,
    devOnly: false,
    attribution: CARTO_ATTRIBUTION,
    swatch: { light: '#ede5d3', dark: '#1f1f1f' },
    styles: keyless({ light: carto('voyager'), dark: carto('dark-matter') }),
  },
  {
    id: 'openfreemap-liberty',
    label: 'Liberty',
    provider: 'openfreemap',
    variants: { light: 'Liberty', dark: 'Dark' },
    description: 'Detailed, softly colored street map. Dark mode uses the OpenFreeMap dark style.',
    requiresKey: false,
    devOnly: false,
    attribution: OPENFREEMAP_ATTRIBUTION,
    swatch: { light: '#d4e3c6', dark: '#1e232b' },
    styles: keyless({ light: openFreeMap('liberty'), dark: openFreeMap('dark') }),
  },
  {
    id: 'openfreemap-bright',
    label: 'Bright',
    provider: 'openfreemap',
    variants: { light: 'Bright', dark: 'Dark' },
    description: 'Saturated, high-contrast street map. Dark mode uses the OpenFreeMap dark style.',
    requiresKey: false,
    devOnly: false,
    attribution: OPENFREEMAP_ATTRIBUTION,
    swatch: { light: '#f3ead7', dark: '#1e232b' },
    styles: keyless({ light: openFreeMap('bright'), dark: openFreeMap('dark') }),
  },
  {
    id: 'openfreemap-positron',
    label: 'Positron',
    provider: 'openfreemap',
    variants: { light: 'Positron', dark: 'Dark' },
    description: 'Minimal light basemap for data on top. Dark mode uses the OpenFreeMap dark style.',
    requiresKey: false,
    devOnly: false,
    attribution: OPENFREEMAP_ATTRIBUTION,
    swatch: { light: '#eceae6', dark: '#1e232b' },
    styles: keyless({ light: openFreeMap('positron'), dark: openFreeMap('dark') }),
  },
  {
    id: 'openfreemap-dark',
    label: 'Dark',
    provider: 'openfreemap',
    variants: { light: 'Dark', dark: 'Dark' },
    description: 'Always dark, in light mode too.',
    requiresKey: false,
    devOnly: false,
    attribution: OPENFREEMAP_ATTRIBUTION,
    swatch: { light: '#1e232b', dark: '#1e232b' },
    styles: keyless({ light: openFreeMap('dark'), dark: openFreeMap('dark') }),
  },
  {
    id: 'openfreemap-fiord',
    label: 'Fiord',
    provider: 'openfreemap',
    variants: { light: 'Fiord', dark: 'Fiord' },
    description: 'Muted blue-gray basemap, the same in both themes.',
    requiresKey: false,
    devOnly: false,
    attribution: OPENFREEMAP_ATTRIBUTION,
    swatch: { light: '#45516e', dark: '#45516e' },
    styles: keyless({ light: openFreeMap('fiord'), dark: openFreeMap('fiord') }),
  },
  {
    id: 'osm-raster',
    label: 'Standard',
    provider: 'osm',
    variants: { light: 'Standard', dark: 'Standard, dimmed' },
    description: 'The classic OpenStreetMap raster tiles. Dimmed in dark mode. Development only.',
    requiresKey: false,
    devOnly: true,
    attribution: OSM_ATTRIBUTION,
    swatch: { light: '#e7e3d8', dark: '#3d3b36' },
    styles: () => OSM_STYLES,
  },
  {
    id: 'maptiler-streets',
    label: 'Streets',
    provider: 'maptiler',
    variants: { light: 'Streets', dark: 'Streets Dark' },
    description: 'General-purpose street map with a matching dark variant.',
    requiresKey: true,
    devOnly: false,
    attribution: MAPTILER_ATTRIBUTION,
    swatch: { light: '#f1efe9', dark: '#262a31' },
    styles: keyed(key => ({ light: mapTiler('streets-v4', key), dark: mapTiler('streets-v4-dark', key) })),
  },
  {
    id: 'maptiler-dataviz',
    label: 'Dataviz',
    provider: 'maptiler',
    variants: { light: 'Dataviz', dark: 'Dataviz Dark' },
    description: 'Muted basemap made for data on top, with a dark variant.',
    requiresKey: true,
    devOnly: false,
    attribution: MAPTILER_ATTRIBUTION,
    swatch: { light: '#e8ecee', dark: '#24292e' },
    styles: keyed(key => ({ light: mapTiler('dataviz-v4', key), dark: mapTiler('dataviz-v4-dark', key) })),
  },
  {
    id: 'maptiler-satellite',
    label: 'Satellite',
    provider: 'maptiler',
    variants: { light: 'Hybrid', dark: 'Hybrid' },
    description: 'Satellite imagery with labels, the same in both themes.',
    requiresKey: true,
    devOnly: false,
    attribution: MAPTILER_ATTRIBUTION,
    swatch: { light: '#3f5a3b', dark: '#3f5a3b' },
    styles: keyed(key => ({ light: mapTiler('hybrid', key), dark: mapTiler('hybrid', key) })),
  },
  {
    id: 'maptiler-outdoor',
    label: 'Outdoor',
    provider: 'maptiler',
    variants: { light: 'Outdoor', dark: 'Outdoor Dark' },
    description: 'Terrain, trails and contour lines, with a dark variant.',
    requiresKey: true,
    devOnly: false,
    attribution: MAPTILER_ATTRIBUTION,
    swatch: { light: '#dfe6cf', dark: '#2a3128' },
    styles: keyed(key => ({ light: mapTiler('outdoor-v4', key), dark: mapTiler('outdoor-v4-dark', key) })),
  },
  {
    id: 'stadia-alidade-smooth',
    label: 'Alidade Smooth',
    provider: 'stadia',
    variants: { light: 'Alidade Smooth', dark: 'Alidade Smooth Dark' },
    description: 'Soft, low-contrast basemap with Alidade Smooth Dark in dark mode.',
    requiresKey: true,
    devOnly: false,
    attribution: STADIA_ATTRIBUTION,
    swatch: { light: '#eeeeec', dark: '#23252b' },
    styles: keyed(key => ({ light: stadia('alidade_smooth', key), dark: stadia('alidade_smooth_dark', key) })),
  },
  {
    id: 'stadia-outdoors',
    label: 'Outdoors',
    provider: 'stadia',
    variants: { light: 'Outdoors', dark: 'Outdoors' },
    description: 'Hiking and cycling map with terrain, the same in both themes.',
    requiresKey: true,
    devOnly: false,
    attribution: STADIA_ATTRIBUTION,
    swatch: { light: '#d9e6c8', dark: '#d9e6c8' },
    styles: keyed(key => ({ light: stadia('outdoors', key), dark: stadia('outdoors', key) })),
  },
  {
    id: 'stadia-osm-bright',
    label: 'OSM Bright',
    provider: 'stadia',
    variants: { light: 'OSM Bright', dark: 'OSM Bright' },
    description: 'Familiar OpenStreetMap colors on vector tiles, the same in both themes.',
    requiresKey: true,
    devOnly: false,
    attribution: STADIA_ATTRIBUTION,
    swatch: { light: '#f3efe6', dark: '#f3efe6' },
    styles: keyed(key => ({ light: stadia('osm_bright', key), dark: stadia('osm_bright', key) })),
  },
];

/** The Carto Positron / Dark Matter pair every map falls back to. Keyless; the attribution is mandatory. */
export const ZARD_MAP_DEFAULT_STYLES: ZardMapStyles & { readonly light: string; readonly dark: string } = {
  light: carto('positron'),
  dark: carto('dark-matter'),
};

export function findZardMapPreset(
  id: string | null | undefined,
  presets: readonly ZardMapPreset[] = ZARD_MAP_PRESETS,
): ZardMapPreset | undefined {
  return id ? presets.find(preset => preset.id === id) : undefined;
}
```

```css
/*
 * Global styles for the map. Load it together with `maplibre-gl/dist/maplibre-gl.css`:
 *
 *   @import 'maplibre-gl/dist/maplibre-gl.css';
 *   @import './map.css';
 *
 * Both imports stay unlayered. MapLibre's own sheet then wins over Tailwind's preflight (which would
 * otherwise reset its buttons and images), and the `.ng-*` rules below live in `@layer components`, so a
 * Tailwind utility on a popup or a marker label still overrides them.
 *
 * ng-mapcn renders its popups, tooltips and labels as plain DOM inside MapLibre, outside Angular's
 * component styles. This file styles them with the zard tokens so they look like a `z-popover`.
 */

/* MapLibre's popup chrome is neutralised: the card below is the only visible surface. */
.maplibregl-popup-content {
  background: transparent !important;
  box-shadow: none !important;
  padding: 0 !important;
  border-radius: 0 !important;
  max-width: none !important;
}

.maplibregl-popup-tip {
  display: none !important;
}

/* Attribution follows the theme. It must stay visible: the basemaps require it. */
.maplibregl-ctrl-attrib.maplibregl-compact,
.maplibregl-ctrl-attrib {
  background-color: color-mix(in oklab, var(--background) 75%, transparent) !important;
  color: var(--muted-foreground) !important;
  font-size: 11px;
}

.maplibregl-ctrl-attrib a {
  color: inherit !important;
}

.maplibregl-ctrl-attrib a:hover {
  color: var(--foreground) !important;
}

.maplibregl-ctrl-attrib-button {
  filter: none !important;
}

.dark .maplibregl-ctrl-attrib-button {
  filter: invert(1) !important;
}

.maplibregl-map {
  font-family: inherit;
}

@layer components {
  /* Popup card: the same surface as z-popover (radius, bg-popover, ring and shadow-md). */
  .ng-popup-card {
    min-width: 180px;
    max-width: 320px;
    padding: calc(var(--spacing, 0.25rem) * 2.5);
    border-radius: var(--radius-lg, var(--radius, 0.625rem));
    background-color: var(--popover);
    color: var(--popover-foreground);
    font-size: 0.875rem;
    line-height: 1.25rem;
    box-shadow:
      0 0 0 1px color-mix(in oklab, var(--foreground) 10%, transparent),
      0 4px 6px -1px rgb(0 0 0 / 0.1),
      0 2px 4px -2px rgb(0 0 0 / 0.1);
    animation: ng-popup-enter 0.1s ease-out;
  }

  .ng-popup-close {
    position: absolute;
    top: 6px;
    right: 6px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    padding: 0;
    border: none;
    border-radius: var(--radius-sm, 4px);
    background: transparent;
    color: var(--muted-foreground);
    cursor: pointer;
  }

  .ng-popup-close:hover {
    background: var(--accent);
    color: var(--accent-foreground);
  }

  .ng-popup-close:focus-visible {
    outline: 2px solid var(--ring);
    outline-offset: 1px;
  }

  /* Tooltip: the zard tooltip is an inverted pill (foreground on background). */
  .ng-tooltip-pill {
    padding: 0.375rem 0.625rem;
    border-radius: var(--radius-md, 6px);
    background-color: var(--foreground);
    color: var(--background);
    font-size: 0.75rem;
    font-weight: 500;
    line-height: 1.4;
    white-space: nowrap;
    pointer-events: none;
    box-shadow:
      0 4px 6px -1px rgb(0 0 0 / 0.1),
      0 2px 4px -2px rgb(0 0 0 / 0.1);
    animation: ng-tooltip-enter 0.1s ease-out;
  }

  .ng-marker-label {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    padding: 2px 6px;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm, 4px);
    background: var(--background);
    color: var(--foreground);
    font-size: 0.75rem;
    font-weight: 600;
    line-height: 1.2;
    white-space: nowrap;
    pointer-events: none;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  }

  .ng-marker-label--top {
    bottom: calc(100% + 6px);
  }

  .ng-marker-label--bottom {
    top: calc(100% + 6px);
  }

  .ng-marker-content {
    position: relative;
    cursor: pointer;
  }

  .ng-marker-default-icon {
    width: 16px;
    height: 16px;
    border: 2px solid var(--background);
    border-radius: 9999px;
    background: var(--primary);
    box-shadow:
      0 4px 6px rgb(0 0 0 / 0.1),
      0 2px 4px rgb(0 0 0 / 0.1);
  }

  /* The dot of a marker with no <ng-marker-content>: the marker element itself, or an empty child of it. */
  .maplibregl-marker:empty,
  .maplibregl-marker > div:empty {
    width: 16px;
    height: 16px;
    border: 2px solid var(--background);
    border-radius: 9999px;
    background: var(--primary);
    box-shadow: 0 2px 4px rgb(0 0 0 / 0.25);
    cursor: pointer;
    transition:
      transform 150ms cubic-bezier(0.4, 0, 0.2, 1),
      box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  .maplibregl-marker > div:empty:hover {
    transform: scale(1.15);
    box-shadow: 0 4px 8px rgb(0 0 0 / 0.35);
  }

  .ng-sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  /* `className="ng-popup-passthrough"` makes a popup ignore the pointer (hover tooltips on layers). */
  .maplibregl-popup:has(.ng-popup-passthrough),
  .maplibregl-popup:has(.ng-popup-passthrough) .maplibregl-popup-content {
    pointer-events: none !important;
  }

  @media (prefers-reduced-motion: reduce) {
    .ng-popup-card,
    .ng-tooltip-pill {
      animation: none;
    }
  }
}

@keyframes ng-popup-enter {
  from {
    opacity: 0;
    transform: translateY(4px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes ng-tooltip-enter {
  from {
    opacity: 0;
    transform: translateY(-2px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
```

```angular-ts
import {
  MapArcComponent,
  MapClusterLayerComponent,
  MapComponent,
  MapControlsComponent,
  MapFillExtrusionComponent,
  MapGeoJSONComponent,
  MapHeatmapComponent,
  MapImageOverlayComponent,
  MapMarkerComponent,
  MapPopupComponent,
  MapRasterSourceComponent,
  MapRouteComponent,
  MapTerrainComponent,
  MapVectorSourceComponent,
  MarkerContentComponent,
  MarkerLabelComponent,
  MarkerPopupComponent,
  MarkerTooltipComponent,
  RouteMarkerComponent,
  RouteProgressComponent,
} from 'ng-mapcn';

/**
 * The map is powered by ng-mapcn, so its elements keep the upstream selectors (`ng-map`,
 * `ng-map-marker`, ...) instead of `z-*`. Import this bundle, or pick what you need from `ng-mapcn`.
 */
export const ZardMapImports = [
  MapComponent,
  MapControlsComponent,
  MapMarkerComponent,
  MarkerContentComponent,
  MarkerLabelComponent,
  MarkerPopupComponent,
  MarkerTooltipComponent,
  MapPopupComponent,
  MapRouteComponent,
  RouteProgressComponent,
  RouteMarkerComponent,
  MapArcComponent,
  MapGeoJSONComponent,
  MapClusterLayerComponent,
  MapHeatmapComponent,
  MapRasterSourceComponent,
  MapVectorSourceComponent,
  MapImageOverlayComponent,
  MapFillExtrusionComponent,
  MapTerrainComponent,
] as const;
```

```angular-ts
import { inject, type Provider, type Signal } from '@angular/core';

import { type MapLabels, type MapStylesConfig, provideMapLabels, provideMapStyles } from 'ng-mapcn';

import { ZARD_MAP_STYLE_CONFIG, ZardMapStyleService, type ZardMapStyleConfig } from './map-style.service';

type ZardMapSource<T> = T | Signal<T | undefined> | (() => Signal<T | undefined>);

export interface ZardMapConfig extends ZardMapStyleConfig {
  /**
   * A fixed basemap for every `<ng-map>`, one style per theme. A missing theme keeps the Carto default. Pass a signal
   * (or a factory returning one) to swap the basemap yourself. When it is set, `ZardMapStyleService` and
   * `<z-map-style-select>` no longer drive the maps: use `style` / `persist` for the shipped picker instead.
   * A map with its own `[styles]` ignores this.
   */
  styles?: ZardMapSource<MapStylesConfig>;
  /** Translations for the control tooltips, the loader and the popup close button. Missing keys stay English. */
  labels?: ZardMapSource<Partial<MapLabels>>;
}

/**
 * Registers the map defaults. Returns plain providers, so it fits a route's `providers`, a component's `providers` or
 * `app.config.ts`.
 *
 * Register it where the maps live, in the `providers` of the lazy route (or component) that renders them. ng-mapcn is
 * not tree-shakeable: importing it from `app.config.ts` puts the engine and MapLibre (about 1 MB) in the initial
 * bundle of every route. Without overrides it is optional, since ng-mapcn's own defaults are the same Carto pair.
 *
 * The basemap is driven by `ZardMapStyleService`, so `<z-map-style-select>` (or `service.select(id)`) changes every
 * map live. `style` picks the preset to start with, `keys` gives the key-based presets their API keys and `persist`
 * remembers the choice in the browser.
 *
 * The theme is not configured here: `<ng-map>` follows the `dark` class on `<html>`, which `ZardDarkMode`
 * toggles, so the basemap and the chrome switch together.
 */
export function provideZardMap(config: ZardMapConfig = {}): Provider[] {
  const { styles, labels, ...styleConfig } = config;

  return [
    { provide: ZARD_MAP_STYLE_CONFIG, useValue: styleConfig },
    provideMapStyles(
      styles ??
        (() => {
          const service = inject(ZardMapStyleService);
          service.configure(inject(ZARD_MAP_STYLE_CONFIG));
          return service.styles;
        }),
    ),
    ...(labels ? [provideMapLabels(labels)] : []),
  ];
}
```

```css
@import 'maplibre-gl/dist/maplibre-gl.css';
@import './app/shared/components/map/map.css';
```

```json
{
  "projects": {
    "your-app": {
      "architect": {
        "build": {
          "options": {
            "assets": [
              { "glob": "**/*", "input": "public" },
              { "glob": "maplibre-gl-worker.mjs", "input": "node_modules/maplibre-gl/dist", "output": "/" },
              { "glob": "maplibre-gl-shared.mjs", "input": "node_modules/maplibre-gl/dist", "output": "/" }
            ]
          }
        }
      }
    }
  }
}
```

### Register

```angular-ts
import { Routes } from '@angular/router';
import { provideZardMap } from '@/shared/components/map/map.provider';

export const routes: Routes = [
  {
    path: 'map',
    loadComponent: () => import('./map.page').then(m => m.MapPage),
    // Register it on the lazy route that renders the maps: ng-mapcn pulls in all of MapLibre (about 1 MB),
    // so keep it out of app.config.ts and the initial bundle of every other route.
    providers: [provideZardMap({ persist: true })],
  },
];
```

## Usage

```angular-ts
import { ZardMapImports } from '@/shared/components/map/map.imports';
```

```angular-html
<div class="h-96 overflow-hidden rounded-xl border">
  <ng-map [center]="[-46.63, -23.55]" [zoom]="10">
    <ng-map-controls />
    <ng-map-marker [longitude]="-46.63" [latitude]="-23.55">
      <ng-marker-content />
      <ng-marker-popup>São Paulo</ng-marker-popup>
    </ng-map-marker>
  </ng-map>
</div>
```

## Examples

### Basic

A map fills its parent, so give the parent a height. The basemap is Carto Positron in light mode and Dark Matter in dark mode: toggle the theme and it swaps with the page.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardMapImports } from '@/shared/components/map/map.imports';

@Component({
  selector: 'z-demo-map-basic',
  imports: [ZardMapImports],
  template: `
    <div class="h-[420px] w-full overflow-hidden rounded-xl border">
      <ng-map [center]="[2.3522, 48.8566]" [zoom]="11" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoMapBasicComponent {}
```

### Controls

`ng-map-controls` adds zoom, compass, locate and fullscreen buttons in any corner. They are plain HTML styled with the zard tokens.

```angular-ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardMapImports } from '@/shared/components/map/map.imports';
import {
  ZardToggleGroupComponent,
  type ZardToggleGroupItem,
} from '@/shared/components/toggle-group/toggle-group.component';

type ControlsPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

@Component({
  selector: 'z-demo-map-controls',
  imports: [ZardMapImports, ZardToggleGroupComponent],
  template: `
    <div class="flex w-full flex-col gap-3">
      <z-toggle-group
        zMode="single"
        zType="outline"
        zSize="sm"
        [zItems]="positions"
        [zDefaultValue]="position()"
        (valueChange)="onPositionChange($event)"
      />

      <div class="h-[420px] w-full overflow-hidden rounded-xl border">
        <ng-map [center]="[139.6917, 35.6895]" [zoom]="10">
          <ng-map-controls
            [position]="position()"
            [showZoom]="true"
            [showCompass]="true"
            [showLocate]="true"
            [showFullscreen]="true"
          />
        </ng-map>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoMapControlsComponent {
  protected readonly position = signal<ControlsPosition>('bottom-right');

  protected readonly positions: ZardToggleGroupItem[] = [
    { value: 'top-left', label: 'Top left' },
    { value: 'top-right', label: 'Top right' },
    { value: 'bottom-left', label: 'Bottom left' },
    { value: 'bottom-right', label: 'Bottom right' },
  ];

  protected onPositionChange(value: string | string[]): void {
    if (typeof value === 'string' && value) {
      this.position.set(value as ControlsPosition);
    }
  }
}
```

### Markers

A marker can carry its own content, a label, a popup that opens on click and a tooltip that shows on hover or focus. Drag the red one, or focus it and use the arrow keys. Add `ng-marker-content` for the default dot.

```angular-ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { provideIcons, NgIcon } from '@ng-icons/core';
import { lucideCoffee, lucideLandmark, lucideMapPin } from '@ng-icons/lucide';

import { ZardBadgeComponent } from '@/shared/components/badge/badge.component';
import { ZardMapImports } from '@/shared/components/map/map.imports';

@Component({
  selector: 'z-demo-map-markers',
  imports: [ZardMapImports, NgIcon, ZardBadgeComponent],
  template: `
    <div class="relative h-[420px] w-full overflow-hidden rounded-xl border">
      <ng-map [center]="[-9.1393, 38.7223]" [zoom]="13">
        <ng-map-controls />

        <!-- Default dot. The tooltip shows on hover and on keyboard focus. -->
        <ng-map-marker [longitude]="-9.1333" [latitude]="38.7139" ariaLabel="Alfama">
          <ng-marker-content />
          <ng-marker-tooltip>Alfama</ng-marker-tooltip>
        </ng-map-marker>

        <!-- Custom content and a label under it. -->
        <ng-map-marker [longitude]="-9.1459" [latitude]="38.7103" ariaLabel="Café A Brasileira">
          <ng-marker-content>
            <div
              class="bg-primary text-primary-foreground border-background flex size-9 items-center justify-center rounded-full border-2 shadow-lg"
            >
              <ng-icon name="lucideCoffee" class="size-4" aria-hidden="true" />
            </div>
          </ng-marker-content>
          <ng-marker-label position="bottom">A Brasileira</ng-marker-label>
        </ng-map-marker>

        <!-- A popup opens on click. Its content is plain HTML, so zard components fit right in. -->
        <ng-map-marker [longitude]="-9.1598" [latitude]="38.6916" ariaLabel="Torre de Belém">
          <ng-marker-content>
            <div
              class="bg-background text-foreground flex size-9 items-center justify-center rounded-full border shadow-lg"
            >
              <ng-icon name="lucideLandmark" class="size-4" aria-hidden="true" />
            </div>
          </ng-marker-content>
          <ng-marker-popup [closeButton]="true">
            <div class="flex flex-col gap-1.5 pr-4">
              <p class="font-medium">Torre de Belém</p>
              <p class="text-muted-foreground text-xs">A 16th century fortress on the Tagus river.</p>
              <z-badge zType="secondary">UNESCO World Heritage</z-badge>
            </div>
          </ng-marker-popup>
        </ng-map-marker>

        <!-- Drag it, or focus it and use the arrow keys. -->
        <ng-map-marker
          [longitude]="position().lng"
          [latitude]="position().lat"
          [draggable]="true"
          ariaLabel="Draggable marker"
          (dragEnd)="position.set($event)"
        >
          <ng-marker-content>
            <div
              class="bg-destructive border-background flex size-9 cursor-grab items-center justify-center rounded-full border-2 text-white shadow-lg"
            >
              <ng-icon name="lucideMapPin" class="size-4" aria-hidden="true" />
            </div>
          </ng-marker-content>
          <ng-marker-tooltip>Drag me</ng-marker-tooltip>
        </ng-map-marker>
      </ng-map>

      <z-badge zType="secondary" class="absolute top-3 left-3 font-mono">
        {{ position().lng.toFixed(4) }}, {{ position().lat.toFixed(4) }}
      </z-badge>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideCoffee, lucideLandmark, lucideMapPin })],
})
export class ZardDemoMapMarkersComponent {
  protected readonly position = signal({ lng: -9.1393, lat: 38.7223 });
}
```

### Popup

`ng-map-popup` sits at any coordinate, with no marker. Bind `[(open)]` to open and close it from your own UI.

```angular-ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardMapImports } from '@/shared/components/map/map.imports';

@Component({
  selector: 'z-demo-map-popup',
  imports: [ZardMapImports, ZardButtonComponent],
  template: `
    <div class="relative h-[420px] w-full overflow-hidden rounded-xl border">
      <ng-map [center]="[-0.1278, 51.5074]" [zoom]="12">
        <ng-map-controls />

        <!-- No marker needed: a popup can sit at any coordinate. [(open)] keeps your state in sync. -->
        <ng-map-popup
          [longitude]="-0.1195"
          [latitude]="51.5033"
          [closeButton]="true"
          [closeOnClick]="false"
          [(open)]="open"
        >
          <div class="flex flex-col gap-1 pr-4">
            <p class="font-medium">London Eye</p>
            <p class="text-muted-foreground text-xs">135 m tall, on the south bank of the Thames.</p>
          </div>
        </ng-map-popup>
      </ng-map>

      <button z-button zType="secondary" zSize="sm" class="absolute top-3 left-3" (click)="open.set(!open())">
        {{ open() ? 'Close popup' : 'Open popup' }}
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoMapPopupComponent {
  protected readonly open = signal(true);
}
```

### Route

`ng-map-route` draws a line through coordinates. Bind `[progress]` and add `ng-route-progress` for the covered part, and `ng-route-marker` for a marker that rides along.

```angular-ts
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePause, lucidePlay } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardMapImports } from '@/shared/components/map/map.imports';
import { ZardSliderComponent } from '@/shared/components/slider/slider.component';

/** Pacific Coast Highway, San Francisco to San Simeon, as [longitude, latitude] pairs. */
const COAST: [number, number][] = [
  [-122.4194, 37.7749],
  [-122.5075, 37.6879],
  [-122.4286, 37.4636],
  [-122.3086, 37.1836],
  [-122.1236, 37.0036],
  [-122.0308, 36.9741],
  [-121.9486, 36.9631],
  [-121.8947, 36.6002],
  [-121.9276, 36.5552],
  [-121.9496, 36.4616],
  [-121.9021, 36.3015],
  [-121.8081, 36.2704],
  [-121.5946, 35.9988],
  [-121.3441, 35.7655],
  [-121.1665, 35.6852],
];

@Component({
  selector: 'z-demo-map-route',
  imports: [ZardMapImports, ZardButtonComponent, ZardSliderComponent, NgIcon],
  template: `
    <div class="flex w-full flex-col gap-3">
      <div class="h-[420px] w-full overflow-hidden rounded-xl border">
        <ng-map [center]="[-121.9, 36.45]" [zoom]="7">
          <ng-map-controls />

          <!-- The line is drawn faint; <ng-route-progress> paints the covered part on top. -->
          <ng-map-route [coordinates]="route" [width]="4" [opacity]="0.5" [progress]="progress()">
            <ng-route-progress color="#2563eb" />
            <ng-route-marker at="start"><ng-marker-content /></ng-route-marker>
            <ng-route-marker at="end"><ng-marker-content /></ng-route-marker>
            <ng-route-marker at="progress">
              <ng-marker-content>
                <div class="bg-primary border-background size-4 rounded-full border-2 shadow-lg"></div>
              </ng-marker-content>
            </ng-route-marker>
          </ng-map-route>
        </ng-map>
      </div>

      <div class="flex items-center gap-4">
        <button
          z-button
          zType="outline"
          zSize="icon"
          type="button"
          [attr.aria-label]="playing() ? 'Pause' : 'Play'"
          (click)="toggle()"
        >
          <ng-icon [name]="playing() ? 'lucidePause' : 'lucidePlay'" />
        </button>
        <z-slider
          class="flex-1"
          aria-label="Route progress"
          [zValue]="[progress() * 100]"
          (zSlideIndexChange)="setProgress($event[0] / 100)"
        />
        <span class="text-muted-foreground w-10 text-right text-sm tabular-nums">
          {{ (progress() * 100).toFixed(0) }}%
        </span>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucidePause, lucidePlay })],
})
export class ZardDemoMapRouteComponent {
  private timer: ReturnType<typeof setInterval> | undefined;

  protected readonly route = COAST;
  protected readonly progress = signal(0.35);
  protected readonly playing = signal(false);

  constructor() {
    inject(DestroyRef).onDestroy(() => this.stop());
  }

  protected setProgress(value: number): void {
    this.progress.set(Math.min(1, Math.max(0, value)));
  }

  protected toggle(): void {
    if (this.playing()) {
      this.stop();
      return;
    }

    if (this.progress() >= 1) {
      this.progress.set(0);
    }
    this.playing.set(true);
    this.timer = setInterval(() => {
      this.setProgress(this.progress() + 0.004);
      if (this.progress() >= 1) {
        this.stop();
      }
    }, 16);
  }

  private stop(): void {
    clearInterval(this.timer);
    this.timer = undefined;
    this.playing.set(false);
  }
}
```

### Arcs

`ng-map-arc` curves a line between two points, such as flights. Arcs that cross the antimeridian, like Sydney to San Francisco, take the short way across it. Hover one.

```angular-ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import type { MapArcDatum, MapArcEvent } from 'ng-mapcn';

import { ZardBadgeComponent } from '@/shared/components/badge/badge.component';
import { ZardMapImports } from '@/shared/components/map/map.imports';

interface Flight extends MapArcDatum {
  label: string;
  duration: string;
}

/** Extra keys on a datum travel with it: they come back in the events and are readable from paint expressions. */
const FLIGHTS: Flight[] = [
  { id: 'jfk-lhr', from: [-73.7781, 40.6413], to: [-0.4543, 51.47], label: 'New York to London', duration: '7 h' },
  { id: 'lhr-dxb', from: [-0.4543, 51.47], to: [55.3644, 25.2532], label: 'London to Dubai', duration: '7 h 10 min' },
  {
    id: 'dxb-sin',
    from: [55.3644, 25.2532],
    to: [103.9915, 1.3644],
    label: 'Dubai to Singapore',
    duration: '7 h 20 min',
  },
  {
    id: 'sin-syd',
    from: [103.9915, 1.3644],
    to: [151.1772, -33.9399],
    label: 'Singapore to Sydney',
    duration: '7 h 50 min',
  },
  // Longitudes run past 180: the arc takes the short way across the antimeridian.
  {
    id: 'syd-sfo',
    from: [151.1772, -33.9399],
    to: [-122.379, 37.6213],
    label: 'Sydney to San Francisco',
    duration: '13 h 5 min',
  },
  {
    id: 'sfo-hnd',
    from: [-122.379, 37.6213],
    to: [139.7798, 35.5494],
    label: 'San Francisco to Tokyo',
    duration: '11 h 10 min',
  },
  {
    id: 'hnd-sin',
    from: [139.7798, 35.5494],
    to: [103.9915, 1.3644],
    label: 'Tokyo to Singapore',
    duration: '7 h 40 min',
  },
  {
    id: 'gru-jfk',
    from: [-46.4731, -23.4356],
    to: [-73.7781, 40.6413],
    label: 'São Paulo to New York',
    duration: '10 h',
  },
  {
    id: 'jnb-lhr',
    from: [28.2461, -26.1392],
    to: [-0.4543, 51.47],
    label: 'Johannesburg to London',
    duration: '11 h 20 min',
  },
];

@Component({
  selector: 'z-demo-map-arcs',
  imports: [ZardMapImports, ZardBadgeComponent],
  template: `
    <div class="relative h-[420px] w-full overflow-hidden rounded-xl border">
      <ng-map [center]="[10, 20]" [zoom]="1.2">
        <ng-map-controls />
        <ng-map-arc
          [data]="flights"
          [curvature]="0.25"
          [paint]="{ 'line-color': '#6366f1', 'line-width': 2, 'line-opacity': 0.7 }"
          [hoverPaint]="{ 'line-color': '#f97316', 'line-width': 4, 'line-opacity': 1 }"
          (arcHover)="onHover($event)"
        />
      </ng-map>

      <z-badge zType="secondary" class="absolute top-3 left-3">
        @if (hovered(); as flight) {
          {{ flight.label }} · {{ flight.duration }}
        } @else {
          Hover an arc
        }
      </z-badge>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoMapArcsComponent {
  protected readonly flights = FLIGHTS;
  protected readonly hovered = signal<Flight | null>(null);

  protected onHover(event: MapArcEvent<Flight> | null): void {
    this.hovered.set(event?.arc ?? null);
  }
}
```

### Geojson

`ng-map-geojson` renders GeoJSON as fill and outline layers. With `[blank]` on the map it makes a choropleth. Set `promoteId` and `fillHoverPaint` for a declarative hover highlight.

```angular-ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import type { ExpressionSpecification } from 'maplibre-gl';
import type { MapGeoJSONEvent } from 'ng-mapcn';

import { ZardMapImports } from '@/shared/components/map/map.imports';

interface Country {
  ADM0_A3: string;
  NAME: string;
  POP_EST: number;
}

/** Natural Earth countries (public domain). A URL works as well as inline GeoJSON. */
const COUNTRIES =
  'https://cdn.jsdelivr.net/gh/nvkelso/natural-earth-vector@master/geojson/ne_110m_admin_0_countries.geojson';

/** The legend: the same steps and colors as the fill expression below. */
const STEPS = [
  { from: 0, color: '#dbeafe', label: '< 10 M' },
  { from: 1e7, color: '#93c5fd', label: '10 M' },
  { from: 5e7, color: '#60a5fa', label: '50 M' },
  { from: 1e8, color: '#3b82f6', label: '100 M' },
  { from: 3e8, color: '#1d4ed8', label: '300 M+' },
];

@Component({
  selector: 'z-demo-map-geojson',
  imports: [ZardMapImports],
  template: `
    <div class="relative h-[420px] w-full overflow-hidden rounded-xl border">
      <!-- [blank] drops the basemap: the choropleth is the map. -->
      <ng-map [blank]="true" [center]="[10, 25]" [zoom]="1.4">
        <ng-map-controls />
        <ng-map-geojson
          [data]="countries"
          promoteId="ADM0_A3"
          [interactive]="true"
          [fillPaint]="fillPaint"
          [fillHoverPaint]="{ 'fill-color': '#f97316' }"
          [linePaint]="{ 'line-color': '#94a3b8', 'line-width': 0.5 }"
          (featureHover)="onHover($event)"
        />
      </ng-map>

      <div
        class="bg-popover text-popover-foreground ring-foreground/10 absolute top-3 left-3 rounded-lg px-3 py-2 text-sm shadow-md ring-1"
        aria-live="polite"
      >
        @if (hovered(); as country) {
          <span class="font-medium">{{ country.NAME }}</span>
          <span class="text-muted-foreground">· {{ (country.POP_EST / 1e6).toFixed(1) }} M people</span>
        } @else {
          <span class="text-muted-foreground">Hover a country</span>
        }
      </div>

      <ul
        class="bg-popover text-popover-foreground ring-foreground/10 absolute bottom-3 left-3 flex flex-wrap gap-x-3 gap-y-1 rounded-lg px-3 py-2 text-xs shadow-md ring-1"
        aria-label="Population legend"
      >
        @for (step of steps; track step.from) {
          <li class="flex items-center gap-1.5">
            <span class="size-3 rounded-sm" [style.background]="step.color"></span>
            {{ step.label }}
          </li>
        }
      </ul>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoMapGeojsonComponent {
  protected readonly countries = COUNTRIES;
  protected readonly steps = STEPS;
  protected readonly hovered = signal<Country | null>(null);

  protected readonly fillPaint: { 'fill-color': ExpressionSpecification; 'fill-opacity': number } = {
    'fill-color': [
      'step',
      ['get', 'POP_EST'],
      '#dbeafe',
      1e7,
      '#93c5fd',
      5e7,
      '#60a5fa',
      1e8,
      '#3b82f6',
      3e8,
      '#1d4ed8',
    ],
    'fill-opacity': 0.85,
  };

  protected onHover(event: MapGeoJSONEvent | null): void {
    // The data is a URL, so the compiler cannot know the properties: say what Natural Earth puts in them.
    this.hovered.set((event?.feature.properties as Country | undefined) ?? null);
  }
}
```

### Clusters

`ng-map-cluster-layer` groups points into clusters with counts and colors by size. Click a cluster to zoom into it, or a single point to select it. Use it, not hundreds of markers, for dense data.

```angular-ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import type { FeatureCollection, Point } from 'geojson';
import type { ClusterPointClickEvent } from 'ng-mapcn';

import { ZardBadgeComponent } from '@/shared/components/badge/badge.component';
import { ZardMapImports } from '@/shared/components/map/map.imports';

interface Store {
  id: number;
  name: string;
}

const CITIES: [string, number, number][] = [
  ['London', -0.1276, 51.5072],
  ['Paris', 2.3522, 48.8566],
  ['Berlin', 13.405, 52.52],
  ['Madrid', -3.7038, 40.4168],
  ['Rome', 12.4964, 41.9028],
  ['Amsterdam', 4.9041, 52.3676],
  ['Vienna', 16.3738, 48.2082],
  ['Warsaw', 21.0122, 52.2297],
  ['Lisbon', -9.1393, 38.7223],
  ['Stockholm', 18.0686, 59.3293],
];

/** A small seeded generator, so the demo draws the same stores on every load. */
function random(seed: number): () => number {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function createStores(count: number): FeatureCollection<Point, Store> {
  const next = random(7);

  return {
    type: 'FeatureCollection',
    features: Array.from({ length: count }, (_, id) => {
      const [city, lng, lat] = CITIES[id % CITIES.length];
      // Most stores sit in the center, a few far out: that is what makes the clusters read well.
      const spread = 0.35 * next() ** 2;
      const angle = next() * Math.PI * 2;

      return {
        type: 'Feature',
        properties: { id, name: `${city} store ${id + 1}` },
        geometry: {
          type: 'Point',
          coordinates: [lng + Math.cos(angle) * spread * 1.5, lat + Math.sin(angle) * spread],
        },
      };
    }),
  };
}

@Component({
  selector: 'z-demo-map-clusters',
  imports: [ZardMapImports, ZardBadgeComponent],
  template: `
    <div class="relative h-[420px] w-full overflow-hidden rounded-xl border">
      <ng-map [center]="[8, 48]" [zoom]="3.6">
        <ng-map-controls />
        <!-- Click a cluster to zoom into it. Click a single point to select it. -->
        <ng-map-cluster-layer
          [data]="stores"
          [clusterColors]="['#60a5fa', '#3b82f6', '#1d4ed8']"
          [clusterThresholds]="[25, 100]"
          pointColor="#f97316"
          (pointClick)="onPointClick($event)"
        />
      </ng-map>

      <z-badge zType="secondary" class="absolute top-3 left-3">
        {{ selected() ?? stores.features.length + ' stores, click a cluster to zoom in' }}
      </z-badge>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoMapClustersComponent {
  protected readonly stores = createStores(600);
  protected readonly selected = signal<string | null>(null);

  protected onPointClick(event: ClusterPointClickEvent<Store>): void {
    this.selected.set(event.feature.properties.name);
  }
}
```

### Heatmap

`ng-map-heatmap` turns points into a density map. Give it a URL and it fetches the GeoJSON; `weightProperty` makes some points count more than others.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import type { ExpressionSpecification } from 'maplibre-gl';

import { ZardBadgeComponent } from '@/shared/components/badge/badge.component';
import { ZardMapImports } from '@/shared/components/map/map.imports';

/** Every earthquake of magnitude 2.5 or more in the last 30 days, from the USGS (public domain). No key needed. */
const EARTHQUAKES = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson';

@Component({
  selector: 'z-demo-map-heatmap',
  imports: [ZardMapImports, ZardBadgeComponent],
  template: `
    <div class="relative h-[420px] w-full overflow-hidden rounded-xl border">
      <ng-map [center]="[150, 10]" [zoom]="1.6">
        <ng-map-controls />
        <!-- A URL is fetched by the map. The weight of each point comes from its magnitude. -->
        <ng-map-heatmap
          [data]="earthquakes"
          weightProperty="mag"
          [weightRange]="[2.5, 7]"
          [radius]="radius"
          [intensity]="1.4"
          [opacity]="0.9"
        />
      </ng-map>

      <z-badge zType="secondary" class="absolute top-3 left-3">Earthquakes in the last 30 days · USGS</z-badge>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoMapHeatmapComponent {
  protected readonly earthquakes = EARTHQUAKES;

  /** The radius grows with the zoom, so the heat keeps its shape as you move in. */
  protected readonly radius: ExpressionSpecification = ['interpolate', ['linear'], ['zoom'], 0, 8, 4, 22, 8, 40];
}
```

### Tile Sources

`ng-map-raster-source` adds XYZ raster tiles on top of the basemap. `ng-map-vector-source` adds vector tiles (MVT, TileJSON or PMTiles), and a layer component such as `ng-map-fill-extrusion` draws them.

```angular-ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardMapImports } from '@/shared/components/map/map.imports';
import { ZardSliderComponent } from '@/shared/components/slider/slider.component';
import {
  ZardToggleGroupComponent,
  type ZardToggleGroupItem,
} from '@/shared/components/toggle-group/toggle-group.component';

type TileSource = 'satellite' | 'topo' | 'buildings';

@Component({
  selector: 'z-demo-map-tile-sources',
  imports: [ZardMapImports, ZardToggleGroupComponent, ZardSliderComponent],
  template: `
    <div class="flex w-full flex-col gap-3">
      <div class="flex flex-wrap items-center gap-4">
        <z-toggle-group
          zMode="single"
          zType="outline"
          zSize="sm"
          [zItems]="sources"
          [zDefaultValue]="source()"
          (valueChange)="onSourceChange($event)"
        />
        @if (source() !== 'buildings') {
          <z-slider
            class="w-40"
            aria-label="Layer opacity"
            [zValue]="[opacity() * 100]"
            (zSlideIndexChange)="opacity.set($event[0] / 100)"
          />
        }
      </div>

      <div class="h-[420px] w-full overflow-hidden rounded-xl border">
        <ng-map [center]="[-74.0134, 40.7061]" [zoom]="14.2" [options]="{ pitch: 50, bearing: -17 }">
          <ng-map-controls />

          <!-- Raster tiles: XYZ URL templates, drawn above the basemap. -->
          @switch (source()) {
            @case ('satellite') {
              <ng-map-raster-source
                id="imagery"
                [tiles]="[
                  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
                ]"
                [tileSize]="256"
                [maxzoom]="19"
                attribution="Tiles © Esri"
                [opacity]="opacity()"
              />
            }
            @case ('topo') {
              <ng-map-raster-source
                id="topo"
                [tiles]="[
                  'https://a.tile.opentopomap.org/{z}/{x}/{y}.png',
                  'https://b.tile.opentopomap.org/{z}/{x}/{y}.png',
                  'https://c.tile.opentopomap.org/{z}/{x}/{y}.png',
                ]"
                [tileSize]="256"
                [maxzoom]="17"
                attribution="© OpenStreetMap contributors, SRTM · © OpenTopoMap (CC-BY-SA)"
                [opacity]="opacity()"
              />
            }
            @case ('buildings') {
              <!-- Vector tiles: the source only adds the data. A layer decides how to draw it. -->
              <ng-map-vector-source
                id="openfreemap"
                url="https://tiles.openfreemap.org/planet"
                attribution="© OpenFreeMap © OpenMapTiles"
              />
              <ng-map-fill-extrusion
                source="openfreemap"
                sourceLayer="building"
                heightProperty="render_height"
                baseProperty="render_min_height"
                color="#6366f1"
                [opacity]="0.75"
                [minZoom]="13"
              />
            }
          }
        </ng-map>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoMapTileSourcesComponent {
  protected readonly source = signal<TileSource>('satellite');
  protected readonly opacity = signal(0.85);

  protected readonly sources: ZardToggleGroupItem[] = [
    { value: 'satellite', label: 'Satellite (raster)' },
    { value: 'topo', label: 'Topographic (raster)' },
    { value: 'buildings', label: 'Buildings (vector)' },
  ];

  protected onSourceChange(value: string | string[]): void {
    if (typeof value === 'string' && value) {
      this.source.set(value as TileSource);
    }
  }
}
```

### 3d

Tilt the map (hold right-click and drag, or Ctrl and drag) to see `ng-map-fill-extrusion` lift the buildings and `ng-map-terrain` raise the relief. Extrusions read the Carto `building` layer, so this map pins Carto with `[styles]`.

```angular-ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import type { Map as MapLibreMap } from 'maplibre-gl';

import { ZARD_MAP_DEFAULT_STYLES } from '@/shared/components/map/map-styles';
import { ZardMapImports } from '@/shared/components/map/map.imports';
import { ZardSwitchComponent } from '@/shared/components/switch/switch.component';
import {
  ZardToggleGroupComponent,
  type ZardToggleGroupItem,
} from '@/shared/components/toggle-group/toggle-group.component';

type Place = 'manhattan' | 'matterhorn';

const CAMERAS: Record<Place, { center: [number, number]; zoom: number; pitch: number; bearing: number }> = {
  manhattan: { center: [-74.0134, 40.7061], zoom: 15.6, pitch: 62, bearing: -20 },
  matterhorn: { center: [7.6586, 45.9763], zoom: 11.6, pitch: 72, bearing: 25 },
};

@Component({
  selector: 'z-demo-map-three-d',
  imports: [ZardMapImports, ZardToggleGroupComponent, ZardSwitchComponent],
  template: `
    <div class="flex w-full flex-col gap-3">
      <div class="flex flex-wrap items-center gap-4">
        <z-toggle-group
          zMode="single"
          zType="outline"
          zSize="sm"
          [zItems]="places"
          [zDefaultValue]="place()"
          (valueChange)="onPlaceChange($event)"
        />
        <z-switch [(zChecked)]="terrain">Terrain</z-switch>
      </div>

      <div class="h-[420px] w-full overflow-hidden rounded-xl border">
        <!-- Extrusions read the "building" layer of the Carto basemap, so this map pins Carto instead of following
             the app-wide basemap. -->
        <ng-map
          [styles]="carto"
          [center]="camera.center"
          [zoom]="camera.zoom"
          [options]="{ pitch: camera.pitch, bearing: camera.bearing }"
          (mapReady)="map = $event"
        >
          <ng-map-controls [showCompass]="true" />
          <!-- Buildings appear from zoom 14, with the heights the basemap carries. -->
          <ng-map-fill-extrusion />
          @if (terrain()) {
            <!-- Elevation from public Terrarium tiles, plus a hillshade so the relief reads. -->
            <ng-map-terrain [exaggeration]="1.5" [hillshade]="true" />
          }
        </ng-map>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoMapThreeDComponent {
  protected readonly carto = ZARD_MAP_DEFAULT_STYLES;
  protected readonly camera = CAMERAS.manhattan;
  protected map: MapLibreMap | null = null;

  protected readonly place = signal<Place>('manhattan');
  protected readonly terrain = signal(true);

  protected readonly places: ZardToggleGroupItem[] = [
    { value: 'manhattan', label: 'Manhattan (buildings)' },
    { value: 'matterhorn', label: 'Matterhorn (terrain)' },
  ];

  protected onPlaceChange(value: string | string[]): void {
    if (typeof value !== 'string' || !value) {
      return;
    }

    this.place.set(value as Place);
    this.map?.flyTo({ ...CAMERAS[value as Place], duration: 3500, essential: true });
  }
}
```

### Custom Styles

`[styles]` takes a style URL or a full MapLibre style JSON for each theme. Define the objects once, outside the component: the map compares styles by identity before it restyles.

```angular-ts
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import type { StyleSpecification } from 'maplibre-gl';

import { ZardMapImports } from '@/shared/components/map/map.imports';
import {
  ZardToggleGroupComponent,
  type ZardToggleGroupItem,
} from '@/shared/components/toggle-group/toggle-group.component';

const COUNTRIES =
  'https://cdn.jsdelivr.net/gh/nvkelso/natural-earth-vector@master/geojson/ne_110m_admin_0_countries.geojson';

/** A MapLibre style is plain JSON: sources say where the data is, layers say how to draw it. */
function blueprint(colors: { sea: string; land: string; line: string }): StyleSpecification {
  return {
    version: 8,
    sources: { countries: { type: 'geojson', data: COUNTRIES, attribution: 'Natural Earth' } },
    layers: [
      { id: 'sea', type: 'background', paint: { 'background-color': colors.sea } },
      { id: 'land', type: 'fill', source: 'countries', paint: { 'fill-color': colors.land } },
      {
        id: 'borders',
        type: 'line',
        source: 'countries',
        paint: { 'line-color': colors.line, 'line-width': 0.8, 'line-dasharray': [2, 1] },
      },
    ],
  };
}

/** Define styles once, outside the component: `<ng-map>` compares them by identity before it restyles. */
const BLUEPRINT = {
  light: blueprint({ sea: '#eff6ff', land: '#bfdbfe', line: '#2563eb' }),
  dark: blueprint({ sea: '#0b1220', land: '#14213d', line: '#3b82f6' }),
};

const LIBERTY = {
  light: 'https://tiles.openfreemap.org/styles/liberty',
  dark: 'https://tiles.openfreemap.org/styles/dark',
};

@Component({
  selector: 'z-demo-map-custom-styles',
  imports: [ZardMapImports, ZardToggleGroupComponent],
  template: `
    <div class="flex w-full flex-col gap-3">
      <z-toggle-group
        zMode="single"
        zType="outline"
        zSize="sm"
        [zItems]="options"
        [zDefaultValue]="choice()"
        (valueChange)="onChoiceChange($event)"
      />

      <div class="h-[420px] w-full overflow-hidden rounded-xl border">
        <!-- Light and dark are separate styles: the map picks one from the theme and swaps live. -->
        <ng-map [styles]="styles()" [center]="[12, 38]" [zoom]="2.4">
          <ng-map-controls />
        </ng-map>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoMapCustomStylesComponent {
  protected readonly choice = signal<'liberty' | 'blueprint'>('blueprint');
  protected readonly styles = computed(() => (this.choice() === 'blueprint' ? BLUEPRINT : LIBERTY));

  protected readonly options: ZardToggleGroupItem[] = [
    { value: 'blueprint', label: 'Blueprint (style JSON)' },
    { value: 'liberty', label: 'Liberty (style URL)' },
  ];

  protected onChoiceChange(value: string | string[]): void {
    if (value === 'blueprint' || value === 'liberty') {
      this.choice.set(value);
    }
  }
}
```

### Viewport

Bind `[viewport]` and `(viewportChange)` to own the camera: the readout follows every frame while you pan, zoom, rotate and tilt, and the buttons move the map.

```angular-ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import type { MapViewport } from 'ng-mapcn';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardMapImports } from '@/shared/components/map/map.imports';

const PLACES: { name: string; viewport: MapViewport }[] = [
  { name: 'Tokyo', viewport: { center: [139.6917, 35.6895], zoom: 10, bearing: 0, pitch: 0 } },
  { name: 'New York', viewport: { center: [-74.006, 40.7128], zoom: 11, bearing: 29, pitch: 45 } },
  { name: 'Cape Town', viewport: { center: [18.4241, -33.9249], zoom: 10.5, bearing: 0, pitch: 0 } },
];

@Component({
  selector: 'z-demo-map-viewport',
  imports: [ZardMapImports, ZardButtonComponent],
  template: `
    <div class="flex w-full flex-col gap-3">
      <div class="flex flex-wrap items-center gap-2">
        @for (place of places; track place.name) {
          <button z-button zType="outline" zSize="sm" type="button" (click)="viewport.set(place.viewport)">
            {{ place.name }}
          </button>
        }
      </div>

      <div class="relative h-[420px] w-full overflow-hidden rounded-xl border">
        <!-- The map reports every frame, you hand the state back: the viewport is yours. -->
        <ng-map [viewport]="viewport()" (viewportChange)="viewport.set($event)">
          <ng-map-controls [showCompass]="true" />
        </ng-map>

        <dl
          class="bg-popover text-popover-foreground ring-foreground/10 absolute top-3 left-3 grid grid-cols-[auto_auto] gap-x-3 gap-y-0.5 rounded-lg px-3 py-2 font-mono text-xs shadow-md ring-1"
          aria-live="off"
        >
          <dt class="text-muted-foreground">lng</dt>
          <dd class="text-right tabular-nums">{{ viewport().center[0].toFixed(4) }}</dd>
          <dt class="text-muted-foreground">lat</dt>
          <dd class="text-right tabular-nums">{{ viewport().center[1].toFixed(4) }}</dd>
          <dt class="text-muted-foreground">zoom</dt>
          <dd class="text-right tabular-nums">{{ viewport().zoom.toFixed(2) }}</dd>
          <dt class="text-muted-foreground">bearing</dt>
          <dd class="text-right tabular-nums">{{ viewport().bearing.toFixed(0) }}°</dd>
          <dt class="text-muted-foreground">pitch</dt>
          <dd class="text-right tabular-nums">{{ viewport().pitch.toFixed(0) }}°</dd>
        </dl>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoMapViewportComponent {
  protected readonly places = PLACES;
  protected readonly viewport = signal<MapViewport>(PLACES[0].viewport);
}
```

### Draw

`ng-map-draw` draws, selects and edits points, lines and polygons. It comes from the optional `map-draw` item (`npx zard-cli add map-draw`), which adds `terra-draw`; the core map never loads it. Pick a tool, click the map, and double-click or press Enter to finish.

```angular-ts
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import type { MapDrawFeature, MapDrawFeatureCollection, MapDrawMode } from 'ng-mapcn/draw';

import { ZardBadgeComponent } from '@/shared/components/badge/badge.component';
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardMapDrawImports } from '@/shared/components/map-draw/map-draw.imports';
import {
  ZardToggleGroupComponent,
  type ZardToggleGroupItem,
} from '@/shared/components/toggle-group/toggle-group.component';

const EARTH_RADIUS_M = 6_371_008.8;
const toRad = (degrees: number): number => (degrees * Math.PI) / 180;

/** Great-circle distance in meters (haversine). */
function distance([lng1, lat1]: number[], [lng2, lat2]: number[]): number {
  const a =
    Math.sin(toRad(lat2 - lat1) / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(toRad(lng2 - lng1) / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(a));
}

/** Area of a polygon ring on the sphere, in square meters. */
function ringArea(ring: number[][]): number {
  let sum = 0;
  for (let i = 0; i < ring.length - 1; i++) {
    const [lng1, lat1] = ring[i];
    const [lng2, lat2] = ring[i + 1];
    sum += toRad(lng2 - lng1) * (2 + Math.sin(toRad(lat1)) + Math.sin(toRad(lat2)));
  }
  return Math.abs((sum * EARTH_RADIUS_M ** 2) / 2);
}

function measure(feature: MapDrawFeature): string {
  const { geometry } = feature;

  switch (geometry.type) {
    case 'Point':
      return `${geometry.coordinates[1].toFixed(4)}, ${geometry.coordinates[0].toFixed(4)}`;
    case 'LineString': {
      const meters = geometry.coordinates
        .slice(1)
        .reduce((sum, point, i) => sum + distance(geometry.coordinates[i], point), 0);
      return meters < 1000 ? `${meters.toFixed(0)} m` : `${(meters / 1000).toFixed(2)} km`;
    }
    case 'Polygon': {
      const km2 = ringArea(geometry.coordinates[0]) / 1e6;
      return km2 < 1 ? `${(km2 * 1e6).toFixed(0)} m²` : `${km2.toFixed(2)} km²`;
    }
  }
}

@Component({
  selector: 'z-demo-map-draw',
  imports: [ZardMapDrawImports, ZardToggleGroupComponent, ZardButtonComponent, ZardBadgeComponent],
  template: `
    <div class="flex w-full flex-col gap-3">
      <div class="flex flex-wrap items-center gap-2">
        <z-toggle-group
          zMode="single"
          zType="outline"
          zSize="sm"
          [zItems]="modes"
          [zValue]="mode()"
          (valueChange)="onModeChange($event)"
        />
        <button
          z-button
          zType="ghost"
          zSize="sm"
          type="button"
          [disabled]="!features().features.length"
          (click)="clear()"
        >
          Clear
        </button>
      </div>

      <div class="h-[420px] w-full overflow-hidden rounded-xl border">
        <ng-map [center]="[-73.9654, 40.7829]" [zoom]="12.8">
          <ng-map-controls />
          <!-- Two-way: [(features)] is a GeoJSON FeatureCollection, [(mode)] the active tool. -->
          <ng-map-draw
            [(mode)]="mode"
            [(features)]="features"
            [modes]="['point', 'line', 'polygon']"
            [editable]="true"
          />
        </ng-map>
      </div>

      <ul class="flex min-h-7 flex-wrap gap-2" aria-label="Drawn features" aria-live="polite">
        @for (feature of readout(); track feature.id) {
          <li>
            <z-badge zType="secondary" class="gap-1.5">
              <span class="font-medium capitalize">{{ feature.kind }}</span>
              <span class="tabular-nums">{{ feature.value }}</span>
            </z-badge>
          </li>
        } @empty {
          <li class="text-muted-foreground text-sm">
            Pick a tool, then click the map. Double-click or press Enter to finish.
          </li>
        }
      </ul>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoMapDrawComponent {
  protected readonly mode = signal<MapDrawMode>('polygon');
  protected readonly features = signal<MapDrawFeatureCollection>({ type: 'FeatureCollection', features: [] });

  protected readonly readout = computed(() =>
    this.features().features.map(feature => ({
      id: feature.id,
      kind: feature.geometry.type === 'LineString' ? 'line' : feature.geometry.type.toLowerCase(),
      value: measure(feature as MapDrawFeature),
    })),
  );

  protected readonly modes: ZardToggleGroupItem[] = [
    { value: 'static', label: 'View' },
    { value: 'select', label: 'Select' },
    { value: 'point', label: 'Point' },
    { value: 'line', label: 'Line' },
    { value: 'polygon', label: 'Polygon' },
  ];

  protected onModeChange(value: string | string[]): void {
    if (typeof value === 'string' && value) {
      this.mode.set(value as MapDrawMode);
    }
  }

  protected clear(): void {
    this.features.set({ type: 'FeatureCollection', features: [] });
  }
}
```

### Lazy Loading

MapLibre is heavy and ng-mapcn is not tree-shakeable, so keep it out of the initial bundle: render maps from a lazy route, or inside `@defer`. For the same reason, register `provideZardMap()` on that lazy route and not in `app.config.ts`.

```angular-ts
import { Component } from '@angular/core';

import { ZardMapImports } from '@/shared/components/map/map.imports';

// MapLibre is heavy: keep it out of the initial bundle with a lazy route (loadComponent), or with @defer when the
// map is only part of a page.
@Component({
  selector: 'app-map-page',
  imports: [ZardMapImports],
  template: `
    @defer (on viewport) {
      <div class="h-96">
        <ng-map [center]="[2.35, 48.85]" [zoom]="10" />
      </div>
    } @placeholder {
      <div class="bg-muted h-96 animate-pulse rounded-xl"></div>
    }
  `,
})
export class MapPage {}
```

### Webgl2

MapLibre 6 needs WebGL2. Without it the map cannot start, so check first and show a message instead of an empty box. `(mapError)` also reports tile and style failures, so it is not the right signal for this.

```angular-ts
import { afterNextRender, Component, signal } from '@angular/core';

import { ZardMapImports } from '@/shared/components/map/map.imports';

// MapLibre 6 needs WebGL2. Without it the map cannot start, so check first and show something useful instead of an
// empty box. (mapError) also reports tile and style failures, so do not use it as the "no WebGL2" signal.
@Component({
  selector: 'app-map-page',
  imports: [ZardMapImports],
  template: `
    <div class="h-96">
      @if (supported()) {
        <ng-map [center]="[2.35, 48.85]" [zoom]="10" (mapError)="onError($event)" />
      } @else {
        <p class="text-muted-foreground p-6 text-sm">Maps need WebGL2, which this browser does not provide.</p>
      }
    </div>
  `,
})
export class MapPage {
  protected readonly supported = signal(true);

  constructor() {
    afterNextRender(() => this.supported.set(!!document.createElement('canvas').getContext('webgl2')));
  }

  protected onError(error: Error): void {
    console.warn('Map error', error);
  }
}
```

## Map styles

Every map without a `[styles]` input follows one app-wide basemap, and it changes live: pick another preset and every map on the page swaps, with no reload and no remount. The precedence is `[styles]`, then `[blank]`, then the app-wide basemap, then Carto.
- **Presets** pair a light and a dark style, so the preset and the dark mode compose.
- **`z-map-style-select`** is the shipped picker (`npx zard-cli add map-style-select`) and **`ZardMapStyleService`** is the state behind it.
- **Key-based presets** never ship a key. Give it to `provideZardMap({ keys })`, or the picker asks for it inline and keeps it in this browser.
The picker at the top of this page drives every map on it, and your choice carries over to the `/maps` gallery.

| Preset | Provider | Key | Light / dark | Attribution | Usage |
| --- | --- | --- | --- | --- | --- |
| `carto-positron` | [Carto](https://carto.com/basemaps) | None | Positron / Dark Matter | © OpenStreetMap contributors © CARTO | Free for non-commercial and low-traffic use. Commercial products need a Carto plan. |
| `carto-voyager` | [Carto](https://carto.com/basemaps) | None | Voyager / Dark Matter | © OpenStreetMap contributors © CARTO | Free for non-commercial and low-traffic use. Commercial products need a Carto plan. |
| `openfreemap-liberty` | [OpenFreeMap](https://openfreemap.org) | None | Liberty / Dark | © OpenFreeMap © OpenMapTiles Data from OpenStreetMap | Free with no registration and no hard limit. Donations keep it running. |
| `openfreemap-bright` | [OpenFreeMap](https://openfreemap.org) | None | Bright / Dark | © OpenFreeMap © OpenMapTiles Data from OpenStreetMap | Free with no registration and no hard limit. Donations keep it running. |
| `openfreemap-positron` | [OpenFreeMap](https://openfreemap.org) | None | Positron / Dark | © OpenFreeMap © OpenMapTiles Data from OpenStreetMap | Free with no registration and no hard limit. Donations keep it running. |
| `openfreemap-dark` | [OpenFreeMap](https://openfreemap.org) | None | Dark / Dark | © OpenFreeMap © OpenMapTiles Data from OpenStreetMap | Free with no registration and no hard limit. Donations keep it running. |
| `openfreemap-fiord` | [OpenFreeMap](https://openfreemap.org) | None | Fiord / Fiord | © OpenFreeMap © OpenMapTiles Data from OpenStreetMap | Free with no registration and no hard limit. Donations keep it running. |
| `osm-raster` | [OpenStreetMap](https://operations.osmfoundation.org/policies/tiles/) | None | Standard / Standard, dimmed | © OpenStreetMap contributors | Development only |
| `maptiler-streets` | [MapTiler](https://www.maptiler.com/cloud/) | Required | Streets / Streets Dark | © MapTiler © OpenStreetMap contributors | Free plan for non-commercial use with a monthly request quota. Restrict the key to your domain. |
| `maptiler-dataviz` | [MapTiler](https://www.maptiler.com/cloud/) | Required | Dataviz / Dataviz Dark | © MapTiler © OpenStreetMap contributors | Free plan for non-commercial use with a monthly request quota. Restrict the key to your domain. |
| `maptiler-satellite` | [MapTiler](https://www.maptiler.com/cloud/) | Required | Hybrid / Hybrid | © MapTiler © OpenStreetMap contributors | Free plan for non-commercial use with a monthly request quota. Restrict the key to your domain. |
| `maptiler-outdoor` | [MapTiler](https://www.maptiler.com/cloud/) | Required | Outdoor / Outdoor Dark | © MapTiler © OpenStreetMap contributors | Free plan for non-commercial use with a monthly request quota. Restrict the key to your domain. |
| `stadia-alidade-smooth` | [Stadia Maps](https://stadiamaps.com) | Required | Alidade Smooth / Alidade Smooth Dark | © Stadia Maps © OpenMapTiles © OpenStreetMap contributors | Works without a key on localhost. Production domains need a (free) account and a key. |
| `stadia-outdoors` | [Stadia Maps](https://stadiamaps.com) | Required | Outdoors / Outdoors | © Stadia Maps © OpenMapTiles © OpenStreetMap contributors | Works without a key on localhost. Production domains need a (free) account and a key. |
| `stadia-osm-bright` | [Stadia Maps](https://stadiamaps.com) | Required | OSM Bright / OSM Bright | © Stadia Maps © OpenMapTiles © OpenStreetMap contributors | Works without a key on localhost. Production domains need a (free) account and a key. |

### Style Picker

Drop `z-map-style-select` anywhere: over a corner of a map, in a toolbar or in your app header. Pick a key-based preset such as MapTiler and it asks for the key inline; nothing changes, and no request goes out, until you give one.

**Register**

```angular-ts
import { provideZardMap } from '@/shared/components/map/map.provider';

export const routes: Routes = [
  {
    path: 'map',
    loadComponent: () => import('./map.page').then(m => m.MapPage),
    providers: [
      provideZardMap({
        // The preset every map starts with (see the table below). Carto Positron / Dark Matter by default.
        style: 'openfreemap-liberty',
        // Key-based presets only unlock with a key. Never commit a real one: read it from your environment.
        keys: { maptiler: environment.maptilerKey },
        // Remember the choice in localStorage (browser only), so it survives reloads and page changes.
        persist: true,
      }),
    ],
  },
];
```

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardMapImports } from '@/shared/components/map/map.imports';
import { ZardMapStyleSelectComponent } from '@/shared/components/map-style-select/map-style-select.component';

@Component({
  selector: 'z-demo-map-style-picker',
  imports: [ZardMapImports, ZardMapStyleSelectComponent],
  template: `
    <div class="relative h-[420px] w-full overflow-hidden rounded-xl border">
      <!-- No [styles] here: this map follows the app-wide basemap that provideZardMap() registers. -->
      <ng-map [center]="[-0.1276, 51.5072]" [zoom]="11.5">
        <ng-map-controls />
        <ng-map-marker [longitude]="-0.1276" [latitude]="51.5072" ariaLabel="London">
          <ng-marker-content />
        </ng-map-marker>
      </ng-map>

      <!-- The picker is plain HTML, so it can sit over a corner of the map, in a toolbar or in your app header. -->
      <z-map-style-select class="absolute top-3 left-3 w-60" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoMapStylePickerComponent {}
```

**Without the picker**

The service is plain signals, so any UI can switch the basemap.

```angular-ts
import { Component, inject } from '@angular/core';

import { ZardMapStyleService } from '@/shared/components/map/map-style.service';

@Component({
  selector: 'app-basemap-toggle',
  template: `
    <button (click)="service.select('carto-voyager')">Voyager</button>
    <button (click)="service.select('openfreemap-liberty')">Liberty</button>
    <p>Now showing {{ service.preset().label }}</p>
  `,
})
export class BasemapToggle {
  // Every <ng-map> without its own [styles] swaps live: no reload, no remount.
  protected readonly service = inject(ZardMapStyleService);
}
```

### Style Override

A map with its own `[styles]` ignores the picker. Change the preset and only the left map moves.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardBadgeComponent } from '@/shared/components/badge/badge.component';
import { ZardMapImports } from '@/shared/components/map/map.imports';
import { ZardMapStyleSelectComponent } from '@/shared/components/map-style-select/map-style-select.component';

/** Defined once, outside the component: `<ng-map>` compares styles by identity before it restyles. */
const FIORD = {
  light: 'https://tiles.openfreemap.org/styles/fiord',
  dark: 'https://tiles.openfreemap.org/styles/fiord',
};

@Component({
  selector: 'z-demo-map-style-override',
  imports: [ZardMapImports, ZardMapStyleSelectComponent, ZardBadgeComponent],
  template: `
    <div class="flex w-full flex-col gap-3">
      <z-map-style-select class="max-w-60" />

      <div class="grid gap-4 md:grid-cols-2">
        <div class="relative h-[320px] overflow-hidden rounded-xl border">
          <ng-map [center]="[4.9041, 52.3676]" [zoom]="11" />
          <z-badge zType="secondary" class="absolute top-3 left-3">Follows the picker</z-badge>
        </div>

        <div class="relative h-[320px] overflow-hidden rounded-xl border">
          <!-- A map with its own [styles] ignores the picker. -->
          <ng-map [styles]="fiord" [center]="[4.9041, 52.3676]" [zoom]="11" />
          <z-badge zType="secondary" class="absolute top-3 left-3">Own [styles]: Fiord</z-badge>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoMapStyleOverrideComponent {
  protected readonly fiord = FIORD;
}
```

### Style Blank

`[blank]` swaps the basemap for an empty, transparent style. Whatever sits behind the map shows through, and the layers you add are the whole map.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import type { Feature, Polygon } from 'geojson';

import { ZardMapImports } from '@/shared/components/map/map.imports';

/** A delivery zone around the Eiffel Tower. With [blank] there is no basemap behind it. */
const ZONE: Feature<Polygon> = {
  type: 'Feature',
  properties: {},
  geometry: {
    type: 'Polygon',
    coordinates: [
      [
        [2.2945, 48.8584],
        [2.31, 48.8641],
        [2.3262, 48.8606],
        [2.3301, 48.8512],
        [2.3128, 48.8449],
        [2.2965, 48.8478],
        [2.2945, 48.8584],
      ],
    ],
  },
};

@Component({
  selector: 'z-demo-map-style-blank',
  imports: [ZardMapImports],
  template: `
    <!-- [blank] swaps the basemap for an empty, transparent style: whatever is behind the map shows through. -->
    <div class="bg-muted/40 h-[320px] w-full overflow-hidden rounded-xl border">
      <ng-map [blank]="true" [center]="[2.3125, 48.8546]" [zoom]="12.6">
        <ng-map-geojson
          [data]="zone"
          [fillPaint]="{ 'fill-color': '#6366f1', 'fill-opacity': 0.25 }"
          [linePaint]="{ 'line-color': '#6366f1', 'line-width': 2 }"
        />
        <ng-map-marker [longitude]="2.2945" [latitude]="48.8584" ariaLabel="Eiffel Tower">
          <ng-marker-content />
          <ng-marker-tooltip>Eiffel Tower</ng-marker-tooltip>
        </ng-map-marker>
      </ng-map>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoMapStyleBlankComponent {
  protected readonly zone = ZONE;
}
```

## API Reference

### ng-map

The map host. It fills its parent, so give the parent an explicit height. The map follows the `dark` class on `<html>`, which `ZardDarkMode` toggles, and swaps its basemap live. Every other `ng-*` element goes inside it.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[center]` | Initial center as [longitude, latitude] | `[number, number]` | `[0, 0]` |
| `[zoom]` | Initial zoom level | `number` | `2` |
| `[viewport]` | Controlled camera: center, zoom, bearing and pitch. Pair it with `(viewportChange)` | `Partial<MapViewport>` | `-` |
| `[styles]` | Basemap for this map, one style per theme (a style URL or a style JSON). Wins over the app-wide basemap | `MapStylesConfig` | `app-wide basemap` |
| `[blank]` | Tile-less style with a transparent background, for dataviz. Ignored when `[styles]` is set | `boolean` | `false` |
| `[theme]` | Leave it on `auto`: the map follows the `dark` class on `<html>` | `'light' \| 'dark' \| 'auto'` | `'auto'` |
| `[projection]` | MapLibre projection, for example `{ type: "globe" }` | `ProjectionSpecification` | `-` |
| `[fitBounds]` | Fits the camera to `bounds`, or to the data of the children (markers, GeoJSON, routes, arcs, clusters, heatmaps) once loaded | `MapFitBoundsOptions` | `-` |
| `[loading]` | Shows the loader on top of the map | `boolean` | `false` |
| `[labels]` | Label overrides for this map, merged over `provideZardMap({ labels })` and the English defaults | `Partial<MapLabels>` | `-` |
| `[options]` | Raw MapLibre `MapOptions` (pitch, bearing, minZoom, maxBounds, ...) spread into the constructor | `Omit<MapOptions, "container" \| "style">` | `-` |

| Output | Description | Type | Default |
| --- | --- | --- | --- |
| `(mapReady)` | Emits the MapLibre map once it has loaded | `Map` | `-` |
| `(viewportChange)` | Emits on every camera frame while the map moves | `MapViewport` | `-` |
| `(mapClick)` | Emits when the map is clicked | `MapMouseEvent` | `-` |
| `(mapError)` | Emits when MapLibre reports an error: no WebGL2, a failed style or tile request, a rejected layer | `Error` | `-` |

### ng-map-controls

Zoom, compass, locate and fullscreen buttons, styled with the zard tokens.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[position]` | Corner of the map | `'top-left' \| 'top-right' \| 'bottom-left' \| 'bottom-right'` | `'bottom-right'` |
| `[showZoom]` | Shows the zoom in and out buttons | `boolean` | `true` |
| `[showCompass]` | Shows the compass: click to reset north and pitch | `boolean` | `false` |
| `[showLocate]` | Shows the locate button (browser geolocation) | `boolean` | `false` |
| `[showFullscreen]` | Shows the fullscreen button | `boolean` | `false` |
| `[labels]` | Label overrides for the tooltips of the buttons, merged over `provideZardMap({ labels })` and the English defaults | `Partial<MapLabels>` | `-` |
| `[className]` | Extra space-separated classes for the controls element. The built-in classes are kept | `string` | `-` |

| Output | Description | Type | Default |
| --- | --- | --- | --- |
| `(locateChange)` | Emits after a successful geolocation. Treat the coordinates as personal data | `{ longitude: number; latitude: number }` | `-` |
| `(locateError)` | Emits when geolocation fails (permission denied, timeout) or the browser has none | `Error \| GeolocationPositionError` | `-` |

### ng-map-marker

A marker with optional `ng-marker-content`, `ng-marker-label`, `ng-marker-popup` and `ng-marker-tooltip` children. Keyboard: Enter and Space click it, and the arrow keys drag a draggable one.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[longitude]` | Longitude | `number` | `-` |
| `[latitude]` | Latitude | `number` | `-` |
| `[draggable]` | Lets the user drag the marker | `boolean` | `false` |
| `[offset]` | Pixel offset of the marker from its position | `PointLike` | `-` |
| `[rotation]` | Rotation in degrees | `number` | `0` |
| `[anchor]` | Which part of the marker sits on the position. Applied at creation only | `PositionAnchor` | `'center'` |
| `[rotationAlignment]` | What the rotation is relative to | `Alignment` | `'auto'` |
| `[pitchAlignment]` | What the pitch is relative to | `Alignment` | `'auto'` |
| `[ariaLabel]` | Accessible name of the marker. An interactive marker without text falls back to the `marker` label | `string` | `-` |
| `[labels]` | Label overrides for the marker, merged over `provideZardMap({ labels })` and the English defaults | `Partial<MapLabels>` | `-` |
| `[keyboardStep]` | Pixels an arrow key drags a focused draggable marker | `number` | `10` |
| `[keyboardStepLarge]` | The same with Shift held | `number` | `50` |

| Output | Description | Type | Default |
| --- | --- | --- | --- |
| `(markerClick)` | Emits on click, and on Enter or Space when focused | `MouseEvent` | `-` |
| `(markerMouseEnter)` | Emits when the pointer enters the marker | `MouseEvent` | `-` |
| `(markerMouseLeave)` | Emits when the pointer leaves the marker | `MouseEvent` | `-` |
| `(dragStart)` | Emits when a drag starts | `{ lng: number; lat: number }` | `-` |
| `(drag)` | Emits on every frame of a drag | `{ lng: number; lat: number }` | `-` |
| `(dragEnd)` | Emits the new position after a drag | `{ lng: number; lat: number }` | `-` |

### ng-marker-content

Custom HTML for the marker. Empty, it renders the default dot, so always include it for a plain marker.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[className]` | Extra space-separated classes for the marker content. The built-in classes are kept | `string` | `-` |

### ng-marker-label

A text label above or below the marker.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[position]` | Side of the marker | `'top' \| 'bottom'` | `'top'` |

### ng-marker-popup

A popup that opens when the marker is clicked. Styled as a zard popover.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[closeButton]` | Shows a close button | `boolean` | `false` |
| `[offset]` | Pixel offset from the marker | `Offset` | `-` |
| `[anchor]` | Side of the marker the popup anchors to. Applied at creation only | `PositionAnchor` | `auto` |
| `[maxWidth]` | CSS max-width of the popup | `string` | `'none'` |
| `[closeOnClick]` | Closes the popup when the map is clicked. Applied at creation only | `boolean` | `false` |
| `[labels]` | Label overrides for the close button, merged over `provideZardMap({ labels })` and the English defaults | `Partial<MapLabels>` | `-` |
| `[className]` | Extra space-separated classes for the popup card. The built-in classes are kept | `string` | `-` |

| Output | Description | Type | Default |
| --- | --- | --- | --- |
| `(popupClose)` | Emits whenever the popup closes | `void` | `-` |

### ng-marker-tooltip

A tooltip that shows while the marker is hovered or focused.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[offset]` | Pixel offset from the marker | `Offset` | `16` |
| `[anchor]` | Side of the marker the tooltip anchors to. Applied at creation only | `PositionAnchor` | `auto` |
| `[className]` | Extra space-separated classes for the tooltip pill. The built-in classes are kept | `string` | `-` |

### ng-map-popup

A standalone popup at a longitude and latitude, with no marker.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[longitude]` | Longitude | `number` | `-` |
| `[latitude]` | Latitude | `number` | `-` |
| `[(open)]` | Whether the popup is shown. Closing it from the map updates the binding | `boolean` | `true` |
| `[closeButton]` | Shows a close button | `boolean` | `false` |
| `[offset]` | Pixel offset from the position | `Offset` | `16` |
| `[maxWidth]` | CSS max-width of the popup | `string` | `'none'` |
| `[closeOnClick]` | Closes the popup when the map is clicked. Applied at creation only | `boolean` | `true` |
| `[labels]` | Label overrides for the close button, merged over `provideZardMap({ labels })` and the English defaults | `Partial<MapLabels>` | `-` |
| `[className]` | Extra space-separated classes for the popup card. The built-in classes are kept | `string` | `-` |

| Output | Description | Type | Default |
| --- | --- | --- | --- |
| `(popupClose)` | Emits whenever the popup closes | `void` | `-` |

### ng-map-route

A line through a list of coordinates. Add `ng-route-progress` for a covered part and `ng-route-marker` for markers along it.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[coordinates]` | The path as [longitude, latitude] pairs | `[number, number][]` | `-` |
| `[id]` | Identifier prefix of the source and layer. Generated when omitted. Changing it recreates them | `string` | `auto` |
| `[color]` | Line color | `string` | `'#4285F4'` |
| `[width]` | Line width in pixels | `number` | `3` |
| `[opacity]` | Line opacity | `number` | `0.8` |
| `[dashArray]` | Dash pattern as [dash, gap] | `[number, number]` | `-` |
| `[interactive]` | Whether the route responds to mouse events | `boolean` | `true` |
| `[progress]` | Covered fraction of the route, from 0 to 1, drawn by `ng-route-progress` | `number` | `-` |
| `[active]` | Highlights the route: the `active*` inputs override the base paint | `boolean` | `false` |
| `[activeColor]` | Color while `active` | `string` | `-` |
| `[activeWidth]` | Width while `active` | `number` | `-` |
| `[activeOpacity]` | Opacity while `active` | `number` | `-` |
| `[activeDashArray]` | Dash pattern while `active` | `[number, number]` | `-` |
| `[beforeId]` | Id of an existing layer to insert the route and its progress line before, for z-order control. Applied at creation only | `string` | `-` |

| Output | Description | Type | Default |
| --- | --- | --- | --- |
| `(routeClick)` | Emits when the route is clicked | `MapMouseEvent` | `-` |
| `(routeMouseEnter)` | Emits when the pointer enters the route | `MapMouseEvent` | `-` |
| `(routeMouseLeave)` | Emits when the pointer leaves the route | `MapMouseEvent` | `-` |

### ng-route-progress

The covered part of the parent `ng-map-route`, drawn up to its `[progress]`.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[color]` | Line color | `string` | `'#22c55e'` |
| `[width]` | Line width in pixels | `number` | `width of the route` |
| `[opacity]` | Line opacity | `number` | `1` |
| `[dashArray]` | Dash pattern as [dash, gap] | `[number, number]` | `-` |

### ng-route-marker

A marker placed along the parent `ng-map-route`. Project an `ng-marker-content` into it.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[at]` | Where it sits: the start, the end, the current progress, or a fraction from 0 to 1 | `'start' \| 'end' \| 'progress' \| number` | `'start'` |

### ng-map-arc

Curved arcs between origin and destination points, such as flight paths. An invisible wide layer under the line keeps hover and click comfortable. Arcs that cross the antimeridian take the short way.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[data]` | The arcs. Extra keys travel with the datum: they come back in the events and in paint expressions | `MapArcDatum[]` | `-` |
| `[id]` | Identifier prefix of the source and layers. Generated when omitted. Changing it recreates them | `string` | `auto` |
| `[curvature]` | Bend of the arc relative to its length. 0 is a straight line | `number` | `0.2` |
| `[samples]` | Segments used to approximate each arc | `number` | `64` |
| `[paint]` | Paint of the line. Datum keys are readable with ["get", key] | `MapLibre paint properties` | `-` |
| `[layout]` | Layout of the line | `MapLibre line layout` | `-` |
| `[hoverPaint]` | Paint applied to the hovered arc | `MapLibre paint properties` | `-` |
| `[interactive]` | Whether arcs respond to mouse events | `boolean` | `true` |
| `[beforeId]` | Id of an existing layer to insert the arc layers before, for z-order control. Applied at creation only | `string` | `-` |

| Output | Description | Type | Default |
| --- | --- | --- | --- |
| `(arcClick)` | Emits the clicked arc | `MapArcEvent` | `-` |
| `(arcHover)` | Emits the hovered arc, or null when the pointer leaves | `MapArcEvent \| null` | `-` |

### ng-map-geojson

Renders GeoJSON as fill and outline layers. With `[blank]` on the map it makes a choropleth. Declarative hover needs `promoteId` and `fillHoverPaint`.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[data]` | A FeatureCollection, Feature or Geometry, or a URL to fetch it from | `MapGeoJSONData \| string` | `-` |
| `[id]` | Identifier prefix of the source and layers. Generated when omitted. Changing it recreates them | `string` | `auto` |
| `[promoteId]` | Feature property to promote to the feature id. Required for hover feature-state | `string` | `-` |
| `[fillPaint]` | Paint of the fill layer, merged onto theme defaults. `false` omits the layer | `MapLibre paint properties` | `-` |
| `[linePaint]` | Paint of the outline layer, merged onto a hairline. `false` omits the layer | `MapLibre paint properties` | `-` |
| `[fillHoverPaint]` | Paint applied to the hovered feature. Requires `promoteId` | `MapLibre paint properties` | `-` |
| `[interactive]` | Whether features respond to mouse events | `boolean` | `false` |
| `[beforeId]` | Id of an existing layer to insert the layers before, for z-order control. Applied at creation only | `string` | `-` |

| Output | Description | Type | Default |
| --- | --- | --- | --- |
| `(featureClick)` | Emits the clicked feature | `MapGeoJSONEvent` | `-` |
| `(featureHover)` | Emits the hovered feature, or null when the pointer leaves | `MapGeoJSONEvent \| null` | `-` |

### ng-map-cluster-layer

Clustered points with count labels and threshold-based colors and sizes. A click on a cluster zooms into it.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[data]` | A FeatureCollection of points, or a URL to fetch it from | `FeatureCollection<Point> \| string` | `-` |
| `[id]` | Identifier prefix of the source and layers. Generated when omitted. Changing it recreates them | `string` | `auto` |
| `[clusterMaxZoom]` | Highest zoom level that still clusters | `number` | `14` |
| `[clusterRadius]` | Radius of a cluster in pixels | `number` | `50` |
| `[clusterColors]` | Colors of the small, medium and large clusters | `[string, string, string]` | `['#22c55e', '#eab308', '#ef4444']` |
| `[clusterThresholds]` | Point counts where the medium and large steps start | `[number, number]` | `[100, 750]` |
| `[pointColor]` | Color of a single, unclustered point | `string` | `'#3b82f6'` |
| `[zoomOnClusterClick]` | Zooms into a cluster when it is clicked | `boolean` | `true` |
| `[beforeId]` | Id of an existing layer to insert the cluster layers before, for z-order control. Applied at creation only | `string` | `-` |

| Output | Description | Type | Default |
| --- | --- | --- | --- |
| `(pointClick)` | Emits a clicked single point | `ClusterPointClickEvent` | `-` |
| `(clusterClick)` | Emits a clicked cluster | `ClusterClickEvent` | `-` |

### ng-map-heatmap

A point-density heatmap with a theme-aware gradient.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[data]` | A FeatureCollection of points, or a URL to fetch it from | `FeatureCollection<Point> \| string` | `-` |
| `[id]` | Identifier prefix of the source and layer. Generated when omitted. Changing it recreates them | `string` | `auto` |
| `[weightProperty]` | Feature property used as the weight of a point | `string` | `-` |
| `[weightRange]` | [min, max] of the weight property, mapped to a weight from 0 to 1 | `[number, number]` | `[0, 1]` |
| `[radius]` | Influence radius of a point in pixels, or an expression | `number \| Expression` | `30` |
| `[intensity]` | Global intensity multiplier, or an expression | `number \| Expression` | `1` |
| `[opacity]` | Layer opacity, or an expression | `number \| Expression` | `1` |
| `[gradient]` | Color ramp over the density. A theme-aware default when omitted | `HeatmapGradient` | `-` |
| `[minZoom]` | Lowest zoom the heatmap is drawn at | `number` | `0` |
| `[maxZoom]` | Zoom from which the heatmap is no longer drawn | `number` | `24` |
| `[paint]` | Heatmap paint properties merged last, over everything above | `MapLibre paint properties` | `-` |
| `[beforeId]` | Id of an existing layer to insert the layer before, for z-order control. Applied at creation only | `string` | `-` |

### ng-map-raster-source

A raster tile source (XYZ, TMS or WMS) plus the layer that draws it.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[id]` | Identifier prefix of the source and layer. Generated when omitted. Changing it recreates them | `string` | `auto` |
| `[tiles]` | Tile URL templates, such as https://example.com/{z}/{x}/{y}.png | `string[]` | `-` |
| `[url]` | URL of a TileJSON document, instead of `tiles` | `string` | `-` |
| `[tileSize]` | Tile size in pixels. Applied at creation | `number` | `256` |
| `[minzoom]` | Lowest zoom of the tiles. Applied at creation | `number` | `0` |
| `[maxzoom]` | Highest zoom of the tiles. Applied at creation | `number` | `22` |
| `[attribution]` | Shown in the attribution control. Applied at creation | `string` | `-` |
| `[bounds]` | [west, south, east, north] limit of the tiles. Applied at creation | `[number, number, number, number]` | `-` |
| `[scheme]` | Tile scheme. Applied at creation | `'xyz' \| 'tms'` | `'xyz'` |
| `[opacity]` | Layer opacity, or an expression | `number \| Expression` | `1` |
| `[visible]` | Whether the layer is drawn. The source stays loaded when hidden | `boolean` | `true` |
| `[paint]` | Raster paint properties merged last, such as `raster-saturation` | `MapLibre paint properties` | `-` |
| `[beforeId]` | Id of an existing layer to insert the layer before, for z-order control. Applied at creation only | `string` | `-` |

### ng-map-vector-source

A vector tile source (MVT, TileJSON or `pmtiles://`). It only adds the source: draw it with a layer component such as `ng-map-fill-extrusion`, which waits for it.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[id]` | Identifier prefix of the source. Generated when omitted. Changing it recreates them | `string` | `auto` |
| `[tiles]` | Tile URL templates, such as https://example.com/{z}/{x}/{y}.mvt | `string[]` | `-` |
| `[url]` | URL of a TileJSON document, or `pmtiles://<archive url>`. Takes precedence over `tiles` | `string` | `-` |
| `[minzoom]` | Lowest zoom of the tiles. Applied at creation | `number` | `0` |
| `[maxzoom]` | Highest zoom of the tiles. Applied at creation | `number` | `22` |
| `[attribution]` | Shown in the attribution control. Applied at creation | `string` | `-` |
| `[bounds]` | [west, south, east, north] limit of the tiles. Applied at creation | `[number, number, number, number]` | `-` |
| `[scheme]` | Tile scheme. Applied at creation | `'xyz' \| 'tms'` | `'xyz'` |
| `[promoteId]` | Feature property used as the feature id, which enables feature-state | `PromoteIdSpecification` | `-` |

### ng-map-image-overlay

An image pinned to four corner coordinates, such as a scanned map or a radar frame.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[id]` | Identifier prefix of the source and layer. Generated when omitted. Changing it recreates them | `string` | `auto` |
| `[url]` | Image URL | `string` | `-` |
| `[coordinates]` | The four [longitude, latitude] corners, clockwise from the top left | `ImageOverlayCoordinates` | `-` |
| `[opacity]` | Layer opacity, or an expression | `number \| Expression` | `1` |
| `[visible]` | Whether the layer is drawn | `boolean` | `true` |
| `[paint]` | Raster paint properties merged last | `MapLibre paint properties` | `-` |
| `[beforeId]` | Id of an existing layer to insert the layer before, for z-order control. Applied at creation only | `string` | `-` |

### ng-map-fill-extrusion

A 3D extrusion of polygons, such as buildings. It defaults to the `building` layer of the Carto basemaps, so pin Carto with `[styles]` on that map. Tilt the map to see it.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[id]` | Identifier prefix of the layer. Generated when omitted. Changing it recreates them | `string` | `auto` |
| `[source]` | Id of the source to extrude: a basemap source or a source component | `string` | `'carto'` |
| `[sourceLayer]` | Layer of a vector source | `string` | `'building' for carto` |
| `[heightProperty]` | Feature property with the height in meters | `string` | `'render_height'` |
| `[baseProperty]` | Feature property with the base height in meters | `string` | `'render_min_height'` |
| `[color]` | Fill color, or an expression. A theme-aware gray by default | `string \| Expression` | `-` |
| `[opacity]` | Layer opacity, from 0 to 1 | `number` | `0.8` |
| `[minZoom]` | Lowest zoom the extrusion is drawn at | `number` | `14` |
| `[maxZoom]` | Zoom from which the extrusion is no longer drawn | `number` | `24` |
| `[filter]` | MapLibre filter. Skips `hide_3d` buildings by default; `null` for none | `FilterSpecification \| null` | `-` |
| `[paint]` | Fill-extrusion paint properties merged last | `MapLibre paint properties` | `-` |
| `[beforeId]` | Id of an existing layer to insert the layer before, for z-order control. Applied at creation only | `string` | `-` |

### ng-map-terrain

3D terrain from a `raster-dem` source, with an optional hillshade. Public Terrarium tiles by default. Only one terrain per map.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[id]` | Identifier prefix of the sources and layers. Generated when omitted. Changing it recreates them | `string` | `auto` |
| `[tiles]` | Elevation tile URL templates. Public Terrarium tiles by default | `string[]` | `-` |
| `[url]` | TileJSON URL, instead of `tiles` | `string` | `-` |
| `[encoding]` | Encoding of the elevation tiles | `'terrarium' \| 'mapbox'` | `'terrarium'` |
| `[tileSize]` | Tile size in pixels | `number` | `256` |
| `[minzoom]` | Lowest zoom of the elevation tiles | `number` | `0` |
| `[maxzoom]` | Highest zoom of the elevation tiles | `number` | `15` |
| `[attribution]` | Shown in the attribution control | `string` | `-` |
| `[exaggeration]` | How tall the terrain looks. 1 is true scale | `number` | `1` |
| `[hillshade]` | Draws a hillshade layer over the terrain | `boolean` | `false` |
| `[hillshadeExaggeration]` | Hillshade intensity, from 0 to 1 | `number` | `0.5` |
| `[hillshadeShadowColor]` | Color of the shaded slopes | `string` | `-` |
| `[hillshadeHighlightColor]` | Color of the lit slopes | `string` | `-` |
| `[hillshadeAccentColor]` | Accent color of steep slopes | `string` | `-` |
| `[hillshadePaint]` | Hillshade paint properties merged last | `MapLibre paint properties` | `-` |
| `[beforeId]` | Id of an existing layer to insert the hillshade layer before, for z-order control. Applied at creation only | `string` | `-` |

### provideZardMap(config?)

Registers the map defaults. Put it in the `providers` of the lazy route that renders the maps, not in `app.config.ts`: ng-mapcn is not tree-shakeable and would join the initial bundle of every route.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `style` | Id of the preset every map starts with. A stored choice wins when `persist` is on | `string` | `'carto-positron'` |
| `keys` | API keys of the key-based providers, such as `{ maptiler: "..." }`. Never hard-code them | `Partial<Record<'maptiler' \| 'stadia', string>>` | `{}` |
| `persist` | Remembers the picked preset (and the keys typed into the picker) in `localStorage`, browser only. A string picks the storage key | `boolean \| string` | `false` |
| `presets` | The catalogue the picker lists. Add your own presets to `ZARD_MAP_PRESETS` | `readonly ZardMapPreset[]` | `ZARD_MAP_PRESETS` |
| `styles` | A fixed basemap per theme, or a signal of one. When set, the service and the picker no longer drive the maps | `MapStylesConfig \| Signal<MapStylesConfig \| undefined> \| (() => Signal<MapStylesConfig \| undefined>)` | `-` |
| `labels` | Translations for the control tooltips, the loader and the popup close button | `Partial<MapLabels> \| Signal<Partial<MapLabels> \| undefined> \| (() => Signal<Partial<MapLabels> \| undefined>)` | `English` |

### ZardMapStyleService

Holds the basemap preset of every map. A root service, so a choice made on one page is the one the next page opens with. Inject it to switch the basemap from your own UI.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `select(id, key?)` | Switches every map to a preset, live. Returns "selected", "unknown-preset" or "needs-key" | `ZardMapSelectResult` | `-` |
| `setKey(provider, key)` | Stores the API key of a provider. An empty key forgets it | `void` | `-` |
| `reset()` | Back to the default preset | `void` | `-` |
| `presetId` | Id of the preset in use | `Signal<string>` | `'carto-positron'` |
| `preset` | The preset in use. A key-based preset without a key falls back to the default | `Signal<ZardMapPreset>` | `-` |
| `presets` | Every preset the picker lists | `Signal<readonly ZardMapPreset[]>` | `ZARD_MAP_PRESETS` |
| `styles` | The light and dark styles of the preset in use: what `provideZardMap()` hands to ng-mapcn | `Signal<ZardMapStyles>` | `-` |
| `keys` | The API keys the service knows, by provider | `Signal<ZardMapKeys>` | `{}` |

### z-map-style-select

Picks the basemap of every map on the page, live. It lists the presets of `ZardMapStyleService` grouped by provider, with a swatch per style, and asks for an API key inline when a key-based preset is picked. It has an effect wherever `provideZardMap()` is registered, and a map with its own `[styles]` ignores it.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Custom CSS classes | `ClassValue` | `''` |
| `[zAriaLabel]` | Accessible name of the picker | `string` | `'Map style'` |
| `(zStyleChange)` | Emits the preset in use after a pick, and for a key-based preset after its key was accepted | `ZardMapPreset` | `-` |

### ng-map-draw

Draws, selects and edits points, lines and polygons on the map, built on terra-draw. Install it with `zard-cli add map-draw`; the core map never loads terra-draw. Enter finishes a shape, Escape cancels it and Delete removes the selected feature.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[modes]` | The shapes the user can draw | `readonly ('point' \| 'line' \| 'polygon')[]` | `['point', 'line', 'polygon']` |
| `[(mode)]` | The active tool: a shape, `select` to pick and edit features, or `static` to only display them | `'point' \| 'line' \| 'polygon' \| 'select' \| 'static'` | `'static'` |
| `[(features)]` | The drawn features as a GeoJSON FeatureCollection. It is the source of truth: it updates when a draw, edit or delete completes, and assigning a new collection replaces what is shown | `MapDrawFeatureCollection` | `empty collection` |
| `[editable]` | Enables the `select` mode: select, drag, reshape and delete features | `boolean` | `false` |
| `[color]` | Accent color of the drawn shapes as `#rrggbb`. A theme-aware blue by default | `DrawHexColor` | `-` |

| Output | Description | Type | Default |
| --- | --- | --- | --- |
| `(drawEnd)` | Emits when a new shape is completed | `MapDrawEvent` | `-` |
| `(featureEdit)` | Emits when an existing feature is moved, reshaped or otherwise edited | `MapDrawEvent` | `-` |
| `(featureSelect)` | Emits the feature selected in `select` mode | `MapDrawFeature` | `-` |
| `(featureDeselect)` | Emits the id of the feature that was deselected | `string \| number` | `-` |

---

[Open in browser](https://zardui.com/docs/components/map)
