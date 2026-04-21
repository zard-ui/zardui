import { KBD_DEMO_BUTTON } from '@generated/components/kbd/demo/button';
import { KBD_DEMO_DEFAULT } from '@generated/components/kbd/demo/default';
import { KBD_DEMO_GROUP } from '@generated/components/kbd/demo/group';
import { KBD_DEMO_TOOLTIP } from '@generated/components/kbd/demo/tooltip';
import { KBD_CLI_ADD } from '@generated/installation/cli/add-kbd';
import { KBD_MANUAL_CODE } from '@generated/installation/manual/kbd';
import { KBD_USAGE_IMPORT, KBD_USAGE_CODE } from '@generated/usage/kbd';

import { ZardDemoKbdButtonComponent } from '@/shared/components/kbd/demo/button';

import { ZardDemoKbdDefaultComponent } from './default';
import { ZardDemoKbdGroupComponent } from './group';
import { ZardDemoKbdTooltipComponent } from './tooltip';
import { KBD_API } from '../doc/api';

export const KBD = {
  componentName: 'kbd',
  componentType: 'kbd',
  description: 'Used to display textual user input from keyboard.',
  api: KBD_API,
  fullWidth: true,
  installData: {
    cliAdd: KBD_CLI_ADD,
    manualCode: KBD_MANUAL_CODE,
  },
  usage: { importBlock: KBD_USAGE_IMPORT, codeBlock: KBD_USAGE_CODE },
  examples: [
    {
      name: 'default',
      component: ZardDemoKbdDefaultComponent,
      column: true,
      codeData: KBD_DEMO_DEFAULT,
    },
    {
      name: 'group',
      component: ZardDemoKbdGroupComponent,
      column: true,
      codeData: KBD_DEMO_GROUP,
    },
    {
      name: 'button',
      component: ZardDemoKbdButtonComponent,
      column: true,
      codeData: KBD_DEMO_BUTTON,
    },
    {
      name: 'tooltip',
      component: ZardDemoKbdTooltipComponent,
      column: true,
      codeData: KBD_DEMO_TOOLTIP,
    },
  ],
};
