import { ALERT_DEMO_BASIC } from '@generated/components/alert/demo/basic';
import { ALERT_CLI_ADD } from '@generated/installation/cli/add-alert';
import { ALERT_MANUAL_CODE } from '@generated/installation/manual/alert';
import { ALERT_USAGE_IMPORT, ALERT_USAGE_CODE } from '@generated/usage/alert';

import { ZardDemoAlertBasicComponent } from './basic';
import { ALERT_API } from '../doc/api';

export const ALERT = {
  api: ALERT_API,
  componentName: 'alert',
  componentType: 'alert',
  description: 'Displays a callout for user attention.',
  installData: {
    cliAdd: ALERT_CLI_ADD,
    manualCode: ALERT_MANUAL_CODE,
  },
  usage: { importBlock: ALERT_USAGE_IMPORT, codeBlock: ALERT_USAGE_CODE },
  examples: [
    {
      name: 'basic',
      component: ZardDemoAlertBasicComponent,
      codeData: ALERT_DEMO_BASIC,
    },
  ],
};
