import { DIVIDER_DEMO_DEFAULT } from '@generated/components/divider/demo/default';
import { DIVIDER_DEMO_VERTICAL } from '@generated/components/divider/demo/vertical';
import { DIVIDER_CLI_ADD } from '@generated/installation/cli/add-divider';
import { DIVIDER_MANUAL_CODE } from '@generated/installation/manual/divider';

import { ZardDemoDividerDefaultComponent } from './default';
import { ZardDemoDividerVerticalComponent } from './vertical';

export const DIVIDER = {
  componentName: 'divider',
  componentType: 'divider',
  description: 'The Divider component is used to visually separate content with a horizontal or vertical line.',
  installData: {
    cliAdd: DIVIDER_CLI_ADD,
    manualCode: DIVIDER_MANUAL_CODE,
  },
  examples: [
    {
      name: 'default',
      component: ZardDemoDividerDefaultComponent,
      codeData: DIVIDER_DEMO_DEFAULT,
    },
    {
      name: 'vertical',
      component: ZardDemoDividerVerticalComponent,
      codeData: DIVIDER_DEMO_VERTICAL,
    },
  ],
};
