import { ALERT_DEMO_BASIC } from '@generated/components/alert/demo/basic';
import { ALERT_CLI_ADD } from '@generated/installation/cli/add-alert';
import { ALERT_MANUAL_CODE } from '@generated/installation/manual/alert';

import { ZardDemoAlertBasicComponent } from './basic';

export const ALERT = {
  componentName: 'alert',
  componentType: 'alert',
  description: 'Displays a callout for user attention.',
  installData: {
    cliAdd: ALERT_CLI_ADD,
    manualCode: ALERT_MANUAL_CODE,
  },
  examples: [
    {
      name: 'basic',
      component: ZardDemoAlertBasicComponent,
      codeData: ALERT_DEMO_BASIC,
    },
  ],
};
