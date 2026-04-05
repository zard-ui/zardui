import { COMMAND_DEMO_DEFAULT } from '@generated/components/command/demo/default';
import { COMMAND_CLI_ADD } from '@generated/installation/cli/add-command';
import { COMMAND_MANUAL_CODE } from '@generated/installation/manual/command';
import { COMMAND_USAGE_IMPORT, COMMAND_USAGE_CODE } from '@generated/usage/command';

import { ZardDemoCommandDefaultComponent } from './default';
import { COMMAND_API } from '../doc/api';

export const COMMAND = {
  api: COMMAND_API,
  componentName: 'command',
  componentType: 'command',
  description: 'Fast, composable, unstyled command menu for Angular.',
  installData: {
    cliAdd: COMMAND_CLI_ADD,
    manualCode: COMMAND_MANUAL_CODE,
  },
  usage: { importBlock: COMMAND_USAGE_IMPORT, codeBlock: COMMAND_USAGE_CODE },
  examples: [
    {
      name: 'default',
      component: ZardDemoCommandDefaultComponent,
      codeData: COMMAND_DEMO_DEFAULT,
    },
  ],
};
