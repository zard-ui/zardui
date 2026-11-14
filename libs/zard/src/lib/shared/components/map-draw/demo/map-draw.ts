import { MAP_DEMO_DRAW } from '@generated/components/map/demo/draw';
import { MAP_DRAW_CLI_ADD } from '@generated/installation/cli/add-map-draw';
import { MAP_DRAW_MANUAL_INSTALL_DEPS } from '@generated/installation/manual/install-deps-map-draw';
import { MAP_DRAW_MANUAL_CODE } from '@generated/installation/manual/map-draw';
import { MAP_DRAW_USAGE_CODE, MAP_DRAW_USAGE_IMPORT } from '@generated/usage/map-draw';

import { ZardDemoMapDrawComponent } from '@/shared/components/map/demo/draw';

import { MAP_DRAW_API } from '../doc/api';

/**
 * The draw tool is an optional layer over the map (`ng-mapcn/draw`, built on terra-draw), so its page is short: how
 * to install it, how to use it and its API. The live demo is the map's own draw example.
 */
export const MAP_DRAW = {
  api: MAP_DRAW_API,
  componentName: 'map-draw',
  componentType: 'map-draw',
  description: 'Draw, select and edit points, lines and polygons on a map. An optional addition to the map.',
  fullWidth: true,
  about: {
    description:
      'Needs the map item, and adds terra-draw and its MapLibre adapter. The core map never loads them, so apps that do not draw never pay for them. It comes from the ng-mapcn/draw entry point.',
    link: { label: 'ng-mapcn', href: 'https://ng-mapcn.vercel.app' },
  },
  installData: {
    cliAdd: MAP_DRAW_CLI_ADD,
    manualCode: MAP_DRAW_MANUAL_CODE,
    manualDeps: MAP_DRAW_MANUAL_INSTALL_DEPS,
  },
  usage: { importBlock: MAP_DRAW_USAGE_IMPORT, codeBlock: MAP_DRAW_USAGE_CODE },
  preview: {
    name: 'preview',
    description: 'Pick a tool, click the map, and double-click or press Enter to finish a shape.',
    component: ZardDemoMapDrawComponent,
    codeData: MAP_DEMO_DRAW,
    lazyRender: true,
    requiresWebgl2: true,
    compact: true,
    previewHeight: '32rem',
  },
  examples: [],
};
