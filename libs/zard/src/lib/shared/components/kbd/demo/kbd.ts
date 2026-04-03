import { KBD_DEMO_DEFAULT } from '@generated/components/kbd/demo/default';
import { KBD_DEMO_GROUP } from '@generated/components/kbd/demo/group';
import { KBD_DEMO_TOOLTIP } from '@generated/components/kbd/demo/tooltip';
import { KBD_CLI_ADD } from '@generated/installation/cli/add-kbd';
import { KBD_MANUAL_CODE } from '@generated/installation/manual/kbd';

import { ZardDemoKbdDefaultComponent } from './default';
import { ZardDemoKbdGroupComponent } from './group';
import { ZardDemoKbdTooltipComponent } from './tooltip';
import { KBD_API } from '../doc/api';

export const KBD = {
  componentName: 'kbd',
  componentType: 'kbd',
  description: 'Display content as a keyboard key useful for documentation purposes.',
  api: KBD_API,
  fullWidth: true,
  installData: {
    cliAdd: KBD_CLI_ADD,
    manualCode: KBD_MANUAL_CODE,
  },
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
      name: 'tooltip',
      component: ZardDemoKbdTooltipComponent,
      column: true,
      codeData: KBD_DEMO_TOOLTIP,
    },
  ],
};
