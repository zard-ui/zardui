import { MAP_DEMO_STYLE_OVERRIDE } from '@generated/components/map/demo/style-override';
import { MAP_DEMO_STYLE_PICKER } from '@generated/components/map/demo/style-picker';
import { MAP_STYLE_SELECT_CLI_ADD } from '@generated/installation/cli/add-map-style-select';
import { MAP_STYLE_SELECT_MANUAL_CODE } from '@generated/installation/manual/map-style-select';
import { MAP_STYLE_SELECT_USAGE_CODE, MAP_STYLE_SELECT_USAGE_IMPORT } from '@generated/usage/map-style-select';

import { ZardDemoMapStyleOverrideComponent } from '@/shared/components/map/demo/style-override';
import { ZardDemoMapStylePickerComponent } from '@/shared/components/map/demo/style-picker';

import { MAP_STYLE_SELECT_API } from '../doc/api';

/** The picker has its own item, and its guide is the "Map styles" section of the map page. */
export const MAP_STYLE_SELECT = {
  api: MAP_STYLE_SELECT_API,
  componentName: 'map-style-select',
  componentType: 'map-style-select',
  description: 'Picks the basemap of every map on the page, live. Presets are grouped by provider.',
  fullWidth: true,
  installData: {
    cliAdd: MAP_STYLE_SELECT_CLI_ADD,
    manualCode: MAP_STYLE_SELECT_MANUAL_CODE,
  },
  usage: { importBlock: MAP_STYLE_SELECT_USAGE_IMPORT, codeBlock: MAP_STYLE_SELECT_USAGE_CODE },
  preview: {
    name: 'preview',
    description:
      'Over a corner of a map here, but it is plain HTML: put it in a toolbar or your app header. Key-based presets ask for the key inline.',
    component: ZardDemoMapStylePickerComponent,
    codeData: MAP_DEMO_STYLE_PICKER,
    lazyRender: true,
    requiresWebgl2: true,
    compact: true,
    previewHeight: '30rem',
  },
  examples: [
    {
      name: 'style-override',
      description: 'A map with its own `[styles]` ignores the picker.',
      component: ZardDemoMapStyleOverrideComponent,
      codeData: MAP_DEMO_STYLE_OVERRIDE,
      lazyRender: true,
      requiresWebgl2: true,
      compact: true,
      previewHeight: '30rem',
    },
  ],
};
