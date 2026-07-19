import { LAYOUT_DEMO_BASIC } from '@generated/components/layout/demo/basic';
import { LAYOUT_DEMO_FULL_LAYOUT } from '@generated/components/layout/demo/full-layout';
import { LAYOUT_DEMO_SIDEBAR } from '@generated/components/layout/demo/sidebar';
import { LAYOUT_CLI_ADD } from '@generated/installation/cli/add-layout';
import { LAYOUT_MANUAL_CODE } from '@generated/installation/manual/layout';
import { LAYOUT_USAGE_IMPORT, LAYOUT_USAGE_CODE } from '@generated/usage/layout';

import { LayoutDemoBasicComponent } from './basic';
import { LayoutDemoFullComponent } from './full-layout';
import { LayoutDemoSidebarComponent } from './sidebar';
import { LAYOUT_API } from '../doc/api';

export const LAYOUT = {
  componentName: 'layout',
  componentType: 'layout',
  description:
    'A set of layout components for creating common page structures with header, footer, sidebar, and content areas.',
  api: LAYOUT_API,
  fullWidth: true,
  installData: {
    cliAdd: LAYOUT_CLI_ADD,
    manualCode: LAYOUT_MANUAL_CODE,
  },
  usage: { importBlock: LAYOUT_USAGE_IMPORT, codeBlock: LAYOUT_USAGE_CODE },
  examples: [
    {
      name: 'basic',
      component: LayoutDemoBasicComponent,
      codeData: LAYOUT_DEMO_BASIC,
    },
    {
      name: 'sidebar',
      component: LayoutDemoSidebarComponent,
      fullScreen: true,
      codeData: LAYOUT_DEMO_SIDEBAR,
    },
    {
      name: 'full-layout',
      component: LayoutDemoFullComponent,
      fullScreen: true,
      codeData: LAYOUT_DEMO_FULL_LAYOUT,
    },
  ],
};
