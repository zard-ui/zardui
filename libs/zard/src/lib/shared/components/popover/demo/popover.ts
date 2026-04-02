import { POPOVER_DEMO_DEFAULT } from '@generated/components/popover/demo/default';
import { POPOVER_DEMO_HOVER } from '@generated/components/popover/demo/hover';
import { POPOVER_DEMO_INTERACTIVE } from '@generated/components/popover/demo/interactive';
import { POPOVER_DEMO_PLACEMENT } from '@generated/components/popover/demo/placement';
import { POPOVER_CLI_ADD } from '@generated/installation/cli/add-popover';
import { POPOVER_MANUAL_CODE } from '@generated/installation/manual/popover';

import { ZardDemoPopoverDefaultComponent } from './default';
import { ZardDemoPopoverHoverComponent } from './hover';
import { ZardDemoPopoverInteractiveComponent } from './interactive';
import { ZardDemoPopoverPlacementComponent } from './placement';

export const POPOVER = {
  componentName: 'popover',
  componentType: 'popover',
  description: 'Displays rich content in a portal, triggered by a button.',
  installData: {
    cliAdd: POPOVER_CLI_ADD,
    manualCode: POPOVER_MANUAL_CODE,
  },
  examples: [
    {
      name: 'default',
      component: ZardDemoPopoverDefaultComponent,
      codeData: POPOVER_DEMO_DEFAULT,
    },
    {
      name: 'hover',
      component: ZardDemoPopoverHoverComponent,
      codeData: POPOVER_DEMO_HOVER,
    },
    {
      name: 'placement',
      component: ZardDemoPopoverPlacementComponent,
      codeData: POPOVER_DEMO_PLACEMENT,
    },
    {
      name: 'interactive',
      component: ZardDemoPopoverInteractiveComponent,
      codeData: POPOVER_DEMO_INTERACTIVE,
    },
  ],
};
