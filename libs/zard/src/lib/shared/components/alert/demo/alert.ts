import { ALERT_DEMO_ACTION } from '@generated/components/alert/demo/action';
import { ALERT_DEMO_BASIC } from '@generated/components/alert/demo/basic';
import { ALERT_DEMO_CUSTOM_COLORS } from '@generated/components/alert/demo/custom-colors';
import { ALERT_DEMO_DESTRUCTIVE } from '@generated/components/alert/demo/destructive';
import { ALERT_CLI_ADD } from '@generated/installation/cli/add-alert';
import { ALERT_MANUAL_CODE } from '@generated/installation/manual/alert';
import { ALERT_USAGE_IMPORT, ALERT_USAGE_CODE } from '@generated/usage/alert';

import { ZardDemoAlertActionComponent } from '@/shared/components/alert/demo/action';
import { ZardDemoAlertCustomColorsComponent } from '@/shared/components/alert/demo/custom-colors';
import { ZardDemoAlertDestructiveComponent } from '@/shared/components/alert/demo/destructive';

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
    {
      name: 'destructive',
      component: ZardDemoAlertDestructiveComponent,
      codeData: ALERT_DEMO_DESTRUCTIVE,
    },
    {
      name: 'action',
      component: ZardDemoAlertActionComponent,
      codeData: ALERT_DEMO_ACTION,
    },
    {
      name: 'custom-colors',
      component: ZardDemoAlertCustomColorsComponent,
      codeData: ALERT_DEMO_CUSTOM_COLORS,
    },
  ],
};
