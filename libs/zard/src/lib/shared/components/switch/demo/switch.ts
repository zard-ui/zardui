import { SWITCH_DEMO_DEFAULT } from '@generated/components/switch/demo/default';
import { SWITCH_DEMO_DESTRUCTIVE } from '@generated/components/switch/demo/destructive';
import { SWITCH_DEMO_DISABLED } from '@generated/components/switch/demo/disabled';
import { SWITCH_DEMO_SIZE } from '@generated/components/switch/demo/size';
import { SWITCH_CLI_ADD } from '@generated/installation/cli/add-switch';
import { SWITCH_MANUAL_CODE } from '@generated/installation/manual/switch';
import { SWITCH_USAGE_CODE, SWITCH_USAGE_IMPORT } from '@generated/usage/switch';

import { ZardDemoSwitchDefaultComponent } from './default';
import { ZardDemoSwitchDestructiveComponent } from './destructive';
import { ZardDemoSwitchDisabledComponent } from './disabled';
import { ZardDemoSwitchSizeComponent } from './size';
import { SWITCH_API } from '../doc/api';

export const SWITCH = {
  componentName: 'switch',
  componentType: 'switch',
  api: SWITCH_API,
  description: 'A control that allows the user to toggle between checked and unchecked.',
  installData: {
    cliAdd: SWITCH_CLI_ADD,
    manualCode: SWITCH_MANUAL_CODE,
  },
  usage: { importBlock: SWITCH_USAGE_IMPORT, codeBlock: SWITCH_USAGE_CODE },
  examples: [
    {
      name: 'default',
      component: ZardDemoSwitchDefaultComponent,
      codeData: SWITCH_DEMO_DEFAULT,
    },
    {
      name: 'destructive',
      component: ZardDemoSwitchDestructiveComponent,
      codeData: SWITCH_DEMO_DESTRUCTIVE,
    },
    {
      name: 'size',
      component: ZardDemoSwitchSizeComponent,
      codeData: SWITCH_DEMO_SIZE,
    },
    {
      name: 'disabled',
      component: ZardDemoSwitchDisabledComponent,
      codeData: SWITCH_DEMO_DISABLED,
    },
  ],
};
