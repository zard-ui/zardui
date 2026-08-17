import { COLLAPSIBLE_DEMO_CONTROLLED } from '@generated/components/collapsible/demo/controlled';
import { COLLAPSIBLE_DEMO_DEFAULT } from '@generated/components/collapsible/demo/default';
import { COLLAPSIBLE_DEMO_DISABLED } from '@generated/components/collapsible/demo/disabled';
import { COLLAPSIBLE_CLI_ADD } from '@generated/installation/cli/add-collapsible';
import { COLLAPSIBLE_MANUAL_CODE } from '@generated/installation/manual/collapsible';
import { COLLAPSIBLE_USAGE_CODE, COLLAPSIBLE_USAGE_IMPORT } from '@generated/usage/collapsible';

import { ZardDemoCollapsibleControlledComponent } from './controlled';
import { ZardDemoCollapsibleDefaultComponent } from './default';
import { ZardDemoCollapsibleDisabledComponent } from './disabled';
import { COLLAPSIBLE_API } from '../doc/api';

export const COLLAPSIBLE = {
  componentName: 'collapsible',
  componentType: 'collapsible',
  description: 'An interactive component which expands and collapses a panel.',
  api: COLLAPSIBLE_API,
  installData: {
    cliAdd: COLLAPSIBLE_CLI_ADD,
    manualCode: COLLAPSIBLE_MANUAL_CODE,
  },
  usage: { importBlock: COLLAPSIBLE_USAGE_IMPORT, codeBlock: COLLAPSIBLE_USAGE_CODE },
  preview: {
    name: 'default',
    component: ZardDemoCollapsibleDefaultComponent,
    column: false,
    codeData: COLLAPSIBLE_DEMO_DEFAULT,
  },
  examples: [
    {
      name: 'controlled',
      description:
        'Bind `zOpen` to a signal and listen to `zOpenChange` to drive the panel from outside the component.',
      component: ZardDemoCollapsibleControlledComponent,
      column: true,
      codeData: COLLAPSIBLE_DEMO_CONTROLLED,
    },
    {
      name: 'disabled',
      description: 'Use `zDisabled` to block the trigger. The panel keeps whatever state it was rendered with.',
      component: ZardDemoCollapsibleDisabledComponent,
      column: true,
      codeData: COLLAPSIBLE_DEMO_DISABLED,
    },
  ],
};
