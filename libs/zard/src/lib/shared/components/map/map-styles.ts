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

/** The few colors the picker's mini-map swatch is drawn with: land, water, a park, minor roads and a major road. */
export interface ZardMapSwatchPalette {
  readonly land: string;
  readonly water: string;
  readonly park: string;
  readonly road: string;
  readonly casing: string;
  readonly major: string;
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
  /** What the basemap looks like in light and dark, as the colors of the mini-map swatch next to the label. */
  readonly swatch: { readonly light: ZardMapSwatchPalette; readonly dark: ZardMapSwatchPalette };
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
    swatch: {
      light: {
        land: '#fafaf8',
        water: '#d4dadc',
        park: '#e9ede4',
        road: '#ffffff',
        casing: '#e0e0e0',
        major: '#ffffff',
      },
      dark: {
        land: '#161616',
        water: '#2e3a42',
        park: '#1c241c',
        road: '#3a3a3a',
        casing: '#0c0c0c',
        major: '#5c5c5c',
      },
    },
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
    swatch: {
      light: {
        land: '#f3eee4',
        water: '#a8cfe0',
        park: '#cfe3c0',
        road: '#ffffff',
        casing: '#e0d6c4',
        major: '#f9d99a',
      },
      dark: {
        land: '#161616',
        water: '#2e3a42',
        park: '#1c241c',
        road: '#3a3a3a',
        casing: '#0c0c0c',
        major: '#5c5c5c',
      },
    },
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
    swatch: {
      light: {
        land: '#f2f3ec',
        water: '#9ec9e2',
        park: '#cfe5bd',
        road: '#ffffff',
        casing: '#d9d9d9',
        major: '#fcd6a4',
      },
      dark: {
        land: '#17181c',
        water: '#24384a',
        park: '#1d281d',
        road: '#3a3d44',
        casing: '#0e0f12',
        major: '#5d6170',
      },
    },
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
    swatch: {
      light: {
        land: '#f5efe0',
        water: '#a3d1f0',
        park: '#c8e6b0',
        road: '#ffffff',
        casing: '#e3d6b8',
        major: '#ffc97a',
      },
      dark: {
        land: '#17181c',
        water: '#24384a',
        park: '#1d281d',
        road: '#3a3d44',
        casing: '#0e0f12',
        major: '#5d6170',
      },
    },
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
    swatch: {
      light: {
        land: '#f2f3f0',
        water: '#c2c8ca',
        park: '#e3e8de',
        road: '#ffffff',
        casing: '#d9d9d9',
        major: '#ffffff',
      },
      dark: {
        land: '#17181c',
        water: '#24384a',
        park: '#1d281d',
        road: '#3a3d44',
        casing: '#0e0f12',
        major: '#5d6170',
      },
    },
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
    swatch: {
      light: {
        land: '#17181c',
        water: '#24384a',
        park: '#1d281d',
        road: '#3a3d44',
        casing: '#0e0f12',
        major: '#5d6170',
      },
      dark: {
        land: '#17181c',
        water: '#24384a',
        park: '#1d281d',
        road: '#3a3d44',
        casing: '#0e0f12',
        major: '#5d6170',
      },
    },
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
    swatch: {
      light: {
        land: '#45516e',
        water: '#2f3c58',
        park: '#4a5b70',
        road: '#5b6a88',
        casing: '#333e58',
        major: '#7a89a6',
      },
      dark: {
        land: '#45516e',
        water: '#2f3c58',
        park: '#4a5b70',
        road: '#5b6a88',
        casing: '#333e58',
        major: '#7a89a6',
      },
    },
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
    swatch: {
      light: {
        land: '#f2efe9',
        water: '#aad3df',
        park: '#c8facc',
        road: '#ffffff',
        casing: '#d6c9b6',
        major: '#fcd6a4',
      },
      dark: {
        land: '#3d3b36',
        water: '#2f4a52',
        park: '#3a4a3a',
        road: '#55524b',
        casing: '#2a2926',
        major: '#7a6a4f',
      },
    },
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
    swatch: {
      light: {
        land: '#f8f4f0',
        water: '#9ec7ef',
        park: '#d4e6c3',
        road: '#ffffff',
        casing: '#e2d6c8',
        major: '#ffd37f',
      },
      dark: {
        land: '#1f242b',
        water: '#14324d',
        park: '#21332a',
        road: '#3a4250',
        casing: '#12161b',
        major: '#9a7238',
      },
    },
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
    swatch: {
      light: {
        land: '#e8ecee',
        water: '#c4d3dc',
        park: '#dde6dc',
        road: '#ffffff',
        casing: '#d3d9dc',
        major: '#f0e4c8',
      },
      dark: {
        land: '#24292e',
        water: '#16222d',
        park: '#263029',
        road: '#3a4048',
        casing: '#181c20',
        major: '#5a636c',
      },
    },
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
    swatch: {
      light: {
        land: '#3f5a3b',
        water: '#1c3a52',
        park: '#2f4a2c',
        road: '#c9c3a8',
        casing: '#2b2f26',
        major: '#e6d9a8',
      },
      dark: {
        land: '#3f5a3b',
        water: '#1c3a52',
        park: '#2f4a2c',
        road: '#c9c3a8',
        casing: '#2b2f26',
        major: '#e6d9a8',
      },
    },
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
    swatch: {
      light: {
        land: '#dfe6cf',
        water: '#a5cbe0',
        park: '#c2dca8',
        road: '#ffffff',
        casing: '#cbc6b0',
        major: '#f5c77a',
      },
      dark: {
        land: '#2a3128',
        water: '#14324d',
        park: '#21332a',
        road: '#3f4a40',
        casing: '#151a14',
        major: '#8a7040',
      },
    },
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
    swatch: {
      light: {
        land: '#f4f4f1',
        water: '#b6d0e0',
        park: '#dbe7d4',
        road: '#ffffff',
        casing: '#e1e1dc',
        major: '#f2e3c6',
      },
      dark: {
        land: '#2a2c31',
        water: '#16181b',
        park: '#2c3a30',
        road: '#44474d',
        casing: '#1c1e21',
        major: '#62666d',
      },
    },
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
    swatch: {
      light: {
        land: '#e4ead6',
        water: '#a9cfe3',
        park: '#c9e0b0',
        road: '#ffffff',
        casing: '#d2d0bd',
        major: '#f5d28a',
      },
      dark: {
        land: '#e4ead6',
        water: '#a9cfe3',
        park: '#c9e0b0',
        road: '#ffffff',
        casing: '#d2d0bd',
        major: '#f5d28a',
      },
    },
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
    swatch: {
      light: {
        land: '#f3efe6',
        water: '#a8d3e8',
        park: '#c8e2b8',
        road: '#ffffff',
        casing: '#d9cdb8',
        major: '#fbc77d',
      },
      dark: {
        land: '#f3efe6',
        water: '#a8d3e8',
        park: '#c8e2b8',
        road: '#ffffff',
        casing: '#d9cdb8',
        major: '#fbc77d',
      },
    },
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
