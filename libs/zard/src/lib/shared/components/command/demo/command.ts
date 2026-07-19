import { COMMAND_DEMO_BASIC } from '@generated/components/command/demo/basic';
import { COMMAND_DEMO_DEFAULT } from '@generated/components/command/demo/default';
import { COMMAND_DEMO_GROUPS } from '@generated/components/command/demo/groups';
import { COMMAND_DEMO_SCROLLABLE } from '@generated/components/command/demo/scrollable';
import { COMMAND_DEMO_SHORTCUTS } from '@generated/components/command/demo/shortcuts';
import { COMMAND_CLI_ADD } from '@generated/installation/cli/add-command';
import { COMMAND_MANUAL_CODE } from '@generated/installation/manual/command';
import { COMMAND_USAGE_CODE, COMMAND_USAGE_IMPORT } from '@generated/usage/command';

import { ZardDemoCommandBasicComponent } from './basic';
import { ZardDemoCommandDefaultComponent } from './default';
import { ZardDemoCommandGroupsComponent } from './groups';
import { ZardDemoCommandScrollableComponent } from './scrollable';
import { ZardDemoCommandShortcutsComponent } from './shortcuts';
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
  preview: {
    name: 'preview',
    component: ZardDemoCommandDefaultComponent,
    codeData: COMMAND_DEMO_DEFAULT,
    column: false,
  },
  examples: [
    {
      name: 'basic',
      component: ZardDemoCommandBasicComponent,
      codeData: COMMAND_DEMO_BASIC,
    },
    {
      name: 'shortcuts',
      component: ZardDemoCommandShortcutsComponent,
      codeData: COMMAND_DEMO_SHORTCUTS,
    },
    {
      name: 'groups',
      component: ZardDemoCommandGroupsComponent,
      codeData: COMMAND_DEMO_GROUPS,
    },
    {
      name: 'scrollable',
      component: ZardDemoCommandScrollableComponent,
      codeData: COMMAND_DEMO_SCROLLABLE,
    },
  ],
};
