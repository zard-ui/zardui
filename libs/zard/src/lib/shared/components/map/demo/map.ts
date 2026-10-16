import { MAP_DEMO_ARCS } from '@generated/components/map/demo/arcs';
import { MAP_DEMO_BASIC } from '@generated/components/map/demo/basic';
import { MAP_DEMO_CLUSTERS } from '@generated/components/map/demo/clusters';
import { MAP_DEMO_CONTROLS } from '@generated/components/map/demo/controls';
import { MAP_DEMO_CUSTOM_STYLES } from '@generated/components/map/demo/custom-styles';
import { MAP_DEMO_DRAW } from '@generated/components/map/demo/draw';
import { MAP_DEMO_GEOJSON } from '@generated/components/map/demo/geojson';
import { MAP_DEMO_HEATMAP } from '@generated/components/map/demo/heatmap';
import { MAP_DEMO_MARKERS } from '@generated/components/map/demo/markers';
import { MAP_DEMO_POPUP } from '@generated/components/map/demo/popup';
import { MAP_DEMO_PREVIEW } from '@generated/components/map/demo/preview';
import { MAP_DEMO_ROUTE } from '@generated/components/map/demo/route';
import { MAP_DEMO_STYLE_BLANK } from '@generated/components/map/demo/style-blank';
import { MAP_DEMO_STYLE_OVERRIDE } from '@generated/components/map/demo/style-override';
import { MAP_DEMO_STYLE_PICKER } from '@generated/components/map/demo/style-picker';
import { MAP_DEMO_THREE_D } from '@generated/components/map/demo/three-d';
import { MAP_DEMO_TILE_SOURCES } from '@generated/components/map/demo/tile-sources';
import { MAP_DEMO_VIEWPORT } from '@generated/components/map/demo/viewport';
import {
  MAP_SNIPPET_GLOBAL_STYLES,
  MAP_SNIPPET_LAZY_LOADING,
  MAP_SNIPPET_STYLE_CONFIG,
  MAP_SNIPPET_STYLE_SERVICE,
  MAP_SNIPPET_WEBGL2,
  MAP_SNIPPET_WORKER_ASSETS,
} from '@generated/components/map/snippets';
import { MAP_CLI_ADD } from '@generated/installation/cli/add-map';
import { MAP_MANUAL_INSTALL_DEPS } from '@generated/installation/manual/install-deps-map';
import { MAP_MANUAL_CODE } from '@generated/installation/manual/map';
import { MAP_REGISTER } from '@generated/installation/register/register-map';
import { MAP_USAGE_CODE, MAP_USAGE_IMPORT } from '@generated/usage/map';

import { ZardDemoMapArcsComponent } from '@/shared/components/map/demo/arcs';
import { ZardDemoMapBasicComponent } from '@/shared/components/map/demo/basic';
import { ZardDemoMapClustersComponent } from '@/shared/components/map/demo/clusters';
import { ZardDemoMapControlsComponent } from '@/shared/components/map/demo/controls';
import { ZardDemoMapCustomStylesComponent } from '@/shared/components/map/demo/custom-styles';
import { ZardDemoMapDrawComponent } from '@/shared/components/map/demo/draw';
import { ZardDemoMapGeojsonComponent } from '@/shared/components/map/demo/geojson';
import { ZardDemoMapHeatmapComponent } from '@/shared/components/map/demo/heatmap';
import { ZardDemoMapMarkersComponent } from '@/shared/components/map/demo/markers';
import { ZardDemoMapPopupComponent } from '@/shared/components/map/demo/popup';
import { ZardDemoMapPreviewComponent } from '@/shared/components/map/demo/preview';
import { ZardDemoMapRouteComponent } from '@/shared/components/map/demo/route';
import { ZardDemoMapStyleBlankComponent } from '@/shared/components/map/demo/style-blank';
import { ZardDemoMapStyleOverrideComponent } from '@/shared/components/map/demo/style-override';
import { ZardDemoMapStylePickerComponent } from '@/shared/components/map/demo/style-picker';
import { ZardDemoMapThreeDComponent } from '@/shared/components/map/demo/three-d';
import { ZardDemoMapTileSourcesComponent } from '@/shared/components/map/demo/tile-sources';
import { ZardDemoMapViewportComponent } from '@/shared/components/map/demo/viewport';
import { ZARD_MAP_PRESETS, ZARD_MAP_PROVIDERS } from '@/shared/components/map/map-styles';
import { ZardMapStyleSelectComponent } from '@/shared/components/map-style-select/map-style-select.component';

import { MAP_API } from '../doc/api';

/** Every map is a WebGL context: mount them as they come into view, and say so when WebGL2 is missing. */
const LIVE = { lazyRender: true, requiresWebgl2: true, compact: true, previewHeight: '30rem' } as const;

const providerOf = (id: string) => ZARD_MAP_PROVIDERS.find(provider => provider.id === id);

export const MAP = {
  api: MAP_API,
  componentName: 'map',
  componentType: 'map',
  description: 'Beautiful maps built on MapLibre GL, themed with zard. Copy and paste into your apps.',
  fullWidth: true,
  headerAction: ZardMapStyleSelectComponent,
  about: {
    title: 'Credits',
    description:
      'The map is powered by ng-mapcn on top of MapLibre GL, and ng-mapcn is an Angular port of mapcn. Zard themes it and adds the basemap presets and the picker.',
    links: [
      {
        label: 'ng-mapcn',
        href: 'https://ng-mapcn.vercel.app',
        description: 'The Angular map components this item is built on (MIT).',
      },
      { label: 'MapLibre GL JS', href: 'https://maplibre.org', description: 'The rendering engine (BSD-3-Clause).' },
      {
        label: 'mapcn',
        href: 'https://www.mapcn.dev',
        description: 'The React library whose component API and look ng-mapcn ports.',
      },
    ],
    note: 'ng-mapcn is still pre-1.0 upstream and ships betas only, so zard pins it to an exact version. Updating it is a deliberate step. Basemap attribution, such as © OpenStreetMap and © CARTO, stays visible on every map.',
  },
  installData: {
    cliAdd: MAP_CLI_ADD,
    manualCode: [
      ...MAP_MANUAL_CODE,
      {
        ...MAP_SNIPPET_GLOBAL_STYLES,
        step: {
          title: 'Load the stylesheets',
          subtitle: 'Import MapLibre’s stylesheet, then the zard one, in your global styles.',
        },
      },
      {
        ...MAP_SNIPPET_WORKER_ASSETS,
        step: {
          title: 'Serve the MapLibre worker',
          subtitle:
            'MapLibre 6 loads its web worker from the app root. Add both files to the build assets, or the console shows "Worker failed to load" and the map stays blank.',
        },
      },
    ],
    manualDeps: MAP_MANUAL_INSTALL_DEPS,
    register: MAP_REGISTER,
  },
  usage: { importBlock: MAP_USAGE_IMPORT, codeBlock: MAP_USAGE_CODE },
  preview: {
    name: 'preview',
    description: 'A basemap with zoom controls and a marker that opens a popup and shows a tooltip on hover.',
    component: ZardDemoMapPreviewComponent,
    codeData: MAP_DEMO_PREVIEW,
    ...LIVE,
  },
  examples: [
    {
      name: 'basic',
      description:
        'A map fills its parent, so give the parent a height. The basemap is Carto Positron in light mode and Dark Matter in dark mode: toggle the theme and it swaps with the page.',
      component: ZardDemoMapBasicComponent,
      codeData: MAP_DEMO_BASIC,
      ...LIVE,
    },
    {
      name: 'controls',
      description:
        '`ng-map-controls` adds zoom, compass, locate and fullscreen buttons in any corner. They are plain HTML styled with the zard tokens.',
      component: ZardDemoMapControlsComponent,
      codeData: MAP_DEMO_CONTROLS,
      ...LIVE,
    },
    {
      name: 'markers',
      description:
        'A marker can carry its own content, a label, a popup that opens on click and a tooltip that shows on hover or focus. Drag the red one, or focus it and use the arrow keys. Add `ng-marker-content` for the default dot.',
      component: ZardDemoMapMarkersComponent,
      codeData: MAP_DEMO_MARKERS,
      ...LIVE,
    },
    {
      name: 'popup',
      description:
        '`ng-map-popup` sits at any coordinate, with no marker. Bind `[(open)]` to open and close it from your own UI.',
      component: ZardDemoMapPopupComponent,
      codeData: MAP_DEMO_POPUP,
      ...LIVE,
    },
    {
      name: 'route',
      description:
        '`ng-map-route` draws a line through coordinates. Bind `[progress]` and add `ng-route-progress` for the covered part, and `ng-route-marker` for a marker that rides along.',
      component: ZardDemoMapRouteComponent,
      codeData: MAP_DEMO_ROUTE,
      ...LIVE,
    },
    {
      name: 'arcs',
      description:
        '`ng-map-arc` curves a line between two points, such as flights. Arcs that cross the antimeridian, like Sydney to San Francisco, take the short way across it. Hover one.',
      component: ZardDemoMapArcsComponent,
      codeData: MAP_DEMO_ARCS,
      ...LIVE,
    },
    {
      name: 'geojson',
      description:
        '`ng-map-geojson` renders GeoJSON as fill and outline layers. With `[blank]` on the map it makes a choropleth. Set `promoteId` and `fillHoverPaint` for a declarative hover highlight.',
      component: ZardDemoMapGeojsonComponent,
      codeData: MAP_DEMO_GEOJSON,
      ...LIVE,
    },
    {
      name: 'clusters',
      description:
        '`ng-map-cluster-layer` groups points into clusters with counts and colors by size. Click a cluster to zoom into it, or a single point to select it. Use it, not hundreds of markers, for dense data.',
      component: ZardDemoMapClustersComponent,
      codeData: MAP_DEMO_CLUSTERS,
      ...LIVE,
    },
    {
      name: 'heatmap',
      description:
        '`ng-map-heatmap` turns points into a density map. Give it a URL and it fetches the GeoJSON; `weightProperty` makes some points count more than others.',
      component: ZardDemoMapHeatmapComponent,
      codeData: MAP_DEMO_HEATMAP,
      ...LIVE,
    },
    {
      name: 'tile-sources',
      description:
        '`ng-map-raster-source` adds XYZ raster tiles on top of the basemap. `ng-map-vector-source` adds vector tiles (MVT, TileJSON or PMTiles), and a layer component such as `ng-map-fill-extrusion` draws them.',
      component: ZardDemoMapTileSourcesComponent,
      codeData: MAP_DEMO_TILE_SOURCES,
      ...LIVE,
    },
    {
      name: '3d',
      description:
        'Tilt the map (hold right-click and drag, or Ctrl and drag) to see `ng-map-fill-extrusion` lift the buildings and `ng-map-terrain` raise the relief. Extrusions read the Carto `building` layer, so this map pins Carto with `[styles]`.',
      component: ZardDemoMapThreeDComponent,
      codeData: MAP_DEMO_THREE_D,
      ...LIVE,
    },
    {
      name: 'custom-styles',
      description:
        '`[styles]` takes a style URL or a full MapLibre style JSON for each theme. Define the objects once, outside the component: the map compares styles by identity before it restyles.',
      component: ZardDemoMapCustomStylesComponent,
      codeData: MAP_DEMO_CUSTOM_STYLES,
      ...LIVE,
    },
    {
      name: 'viewport',
      description:
        'Bind `[viewport]` and `(viewportChange)` to own the camera: the readout follows every frame while you pan, zoom, rotate and tilt, and the buttons move the map.',
      component: ZardDemoMapViewportComponent,
      codeData: MAP_DEMO_VIEWPORT,
      ...LIVE,
    },
    {
      name: 'draw',
      description:
        '`ng-map-draw` draws, selects and edits points, lines and polygons. It comes from the optional `map-draw` item (`npx zard-cli add map-draw`), which adds `terra-draw`; the core map never loads it. Pick a tool, click the map, and double-click or press Enter to finish.',
      component: ZardDemoMapDrawComponent,
      codeData: MAP_DEMO_DRAW,
      ...LIVE,
    },
    {
      name: 'lazy-loading',
      description:
        'MapLibre is heavy and ng-mapcn is not tree-shakeable, so keep it out of the initial bundle: render maps from a lazy route, or inside `@defer`. For the same reason, register `provideZardMap()` on that lazy route and not in `app.config.ts`.',
      codeData: MAP_SNIPPET_LAZY_LOADING,
    },
    {
      name: 'webgl2',
      description:
        'MapLibre 6 needs WebGL2. Without it the map cannot start, so check first and show a message instead of an empty box. `(mapError)` also reports tile and style failures, so it is not the right signal for this.',
      codeData: MAP_SNIPPET_WEBGL2,
    },
  ],
  sections: [
    {
      id: 'map-styles',
      title: 'Map styles',
      description: [
        'Every map without a `[styles]` input follows one app-wide basemap, and it changes live: pick another preset and every map on the page swaps, with no reload and no remount. The precedence is `[styles]`, then `[blank]`, then the app-wide basemap, then Carto.',
        '- **Presets** pair a light and a dark style, so the preset and the dark mode compose.',
        '- **`z-map-style-select`** is the shipped picker (`npx zard-cli add map-style-select`) and **`ZardMapStyleService`** is the state behind it.',
        '- **Key-based presets** never ship a key. Give it to `provideZardMap({ keys })`, or the picker asks for it inline and keeps it in this browser.',
        'The picker at the top of this page drives every map on it, and your choice carries over to the `/maps` gallery.',
      ].join('\n'),
      table: {
        columns: ['Preset', 'Provider', 'Key', 'Light / dark', 'Attribution', 'Usage'],
        rows: ZARD_MAP_PRESETS.map(preset => {
          const provider = providerOf(preset.provider);
          return [
            `\`${preset.id}\``,
            provider ? { text: provider.label, href: provider.url } : preset.provider,
            preset.requiresKey ? 'Required' : 'None',
            `${preset.variants.light} / ${preset.variants.dark}`,
            preset.attribution,
            preset.devOnly ? 'Development only' : (provider?.limits ?? ''),
          ];
        }),
      },
      examples: [
        {
          name: 'style-picker',
          description:
            'Drop `z-map-style-select` anywhere: over a corner of a map, in a toolbar or in your app header. Pick a key-based preset such as MapTiler and it asks for the key inline; nothing changes, and no request goes out, until you give one.',
          component: ZardDemoMapStylePickerComponent,
          codeData: MAP_DEMO_STYLE_PICKER,
          codeBefore: { title: 'Register', codeData: MAP_SNIPPET_STYLE_CONFIG },
          codeAfter: {
            title: 'Without the picker',
            description: 'The service is plain signals, so any UI can switch the basemap.',
            codeData: MAP_SNIPPET_STYLE_SERVICE,
          },
          ...LIVE,
        },
        {
          name: 'style-override',
          description:
            'A map with its own `[styles]` ignores the picker. Change the preset and only the left map moves.',
          component: ZardDemoMapStyleOverrideComponent,
          codeData: MAP_DEMO_STYLE_OVERRIDE,
          lazyRender: true,
          requiresWebgl2: true,
          compact: true,
          previewHeight: '30rem',
        },
        {
          name: 'style-blank',
          description:
            '`[blank]` swaps the basemap for an empty, transparent style. Whatever sits behind the map shows through, and the layers you add are the whole map.',
          component: ZardDemoMapStyleBlankComponent,
          codeData: MAP_DEMO_STYLE_BLANK,
          lazyRender: true,
          requiresWebgl2: true,
          compact: true,
          previewHeight: '24rem',
        },
      ],
    },
  ],
};
