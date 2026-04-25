import { TABS_DEMO_DEFAULT } from '@generated/components/tabs/demo/default';
import { TABS_DEMO_DISABLED } from '@generated/components/tabs/demo/disabled';
import { TABS_DEMO_ICONS } from '@generated/components/tabs/demo/icons';
import { TABS_DEMO_LINE } from '@generated/components/tabs/demo/line';
import { TABS_DEMO_VERTICAL } from '@generated/components/tabs/demo/vertical';
import { TABS_CLI_ADD } from '@generated/installation/cli/add-tabs';
import { TABS_MANUAL_CODE } from '@generated/installation/manual/tabs';
import { TABS_USAGE_CODE, TABS_USAGE_IMPORT } from '@generated/usage/tabs';

import { ZardDemoTabsDefaultComponent } from './default';
import { ZardDemoTabsDisabledComponent } from './disabled';
import { ZardDemoTabsIconsComponent } from './icons';
import { ZardDemoTabsLineComponent } from './line';
import { ZardDemoTabsVerticalComponent } from './vertical';
import { TABS_API } from '../doc/api';

export const TABS = {
  componentName: 'tabs',
  componentType: 'tabs',
  api: TABS_API,
  description: 'A set of layered sections of content—known as tab panels—that are displayed one at a time.',
  installData: {
    cliAdd: TABS_CLI_ADD,
    manualCode: TABS_MANUAL_CODE,
  },
  preview: {
    name: 'preview',
    component: ZardDemoTabsDefaultComponent,
    codeData: TABS_DEMO_DEFAULT,
    column: false,
  },
  usage: { importBlock: TABS_USAGE_IMPORT, codeBlock: TABS_USAGE_CODE },
  examples: [
    {
      name: 'line',
      description: 'Use the `zVariant="line"` prop on `z-tab-group` for a line style.',
      component: ZardDemoTabsLineComponent,
      codeData: TABS_DEMO_LINE,
    },
    {
      name: 'vertical',
      description: 'Use `zOrientation="vertical"` for vertical tabs.',
      component: ZardDemoTabsVerticalComponent,
      codeData: TABS_DEMO_VERTICAL,
    },
    {
      name: 'disabled',
      component: ZardDemoTabsDisabledComponent,
      codeData: TABS_DEMO_DISABLED,
    },
    {
      name: 'icons',
      component: ZardDemoTabsIconsComponent,
      codeData: TABS_DEMO_ICONS,
    },
  ],
};
