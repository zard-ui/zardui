import { ALERT_DIALOG_DEMO_DEFAULT } from '@generated/components/alert-dialog/demo/default';
import { ALERT_DIALOG_CLI_ADD } from '@generated/installation/cli/add-alert-dialog';
import { ALERT_DIALOG_MANUAL_CODE } from '@generated/installation/manual/alert-dialog';

import { ZardDemoAlertDialogDefaultComponent } from './default';
import { ALERT_DIALOG_API } from '../doc/api';

export const ALERT_DIALOG = {
  api: ALERT_DIALOG_API,
  componentName: 'alert-dialog',
  componentType: 'alert-dialog',
  description: 'A modal dialog that interrupts the user with important content and expects a response.',
  installData: {
    cliAdd: ALERT_DIALOG_CLI_ADD,
    manualCode: ALERT_DIALOG_MANUAL_CODE,
  },
  examples: [
    {
      name: 'default',
      component: ZardDemoAlertDialogDefaultComponent,
      codeData: ALERT_DIALOG_DEMO_DEFAULT,
    },
  ],
};
