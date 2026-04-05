import { TABS_DEMO_ALIGN } from '@generated/components/tabs/demo/align';
import { TABS_DEMO_ARROW } from '@generated/components/tabs/demo/arrow';
import { TABS_DEMO_DEFAULT } from '@generated/components/tabs/demo/default';
import { TABS_DEMO_POSITION } from '@generated/components/tabs/demo/position';
import { TABS_CLI_ADD } from '@generated/installation/cli/add-tabs';
import { TABS_MANUAL_CODE } from '@generated/installation/manual/tabs';
import { TABS_USAGE_CODE, TABS_USAGE_IMPORT } from '@generated/usage/tabs';

import { ZardDemoTabsAlignComponent } from './align';
import { ZardDemoTabsArrowComponent } from './arrow';
import { ZardDemoTabsDefaultComponent } from './default';
import { ZardDemoTabsPositionComponent } from './position';
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
  usage: { importBlock: TABS_USAGE_IMPORT, codeBlock: TABS_USAGE_CODE },
  examples: [
    {
      name: 'default',
      component: ZardDemoTabsDefaultComponent,
      codeData: TABS_DEMO_DEFAULT,
    },
    {
      name: 'position',
      component: ZardDemoTabsPositionComponent,
      codeData: TABS_DEMO_POSITION,
    },
    {
      name: 'align',
      component: ZardDemoTabsAlignComponent,
      codeData: TABS_DEMO_ALIGN,
    },
    {
      name: 'arrow',
      component: ZardDemoTabsArrowComponent,
      codeData: TABS_DEMO_ARROW,
    },
  ],
};
