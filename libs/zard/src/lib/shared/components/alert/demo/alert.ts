import { ALERT_DEMO_ACTION } from '@generated/components/alert/demo/action';
import { ALERT_DEMO_BASIC } from '@generated/components/alert/demo/basic';
import { ALERT_DEMO_CUSTOM_COLORS } from '@generated/components/alert/demo/custom-colors';
import { ALERT_DEMO_DESTRUCTIVE } from '@generated/components/alert/demo/destructive';
import { ALERT_DEMO_PREVIEW } from '@generated/components/alert/demo/preview';
import { ALERT_CLI_ADD } from '@generated/installation/cli/add-alert';
import { ALERT_MANUAL_CODE } from '@generated/installation/manual/alert';
import { ALERT_USAGE_IMPORT, ALERT_USAGE_CODE } from '@generated/usage/alert';

import { ZardDemoAlertActionComponent } from './action';
import { ZardDemoAlertBasicComponent } from './basic';
import { ZardDemoAlertCustomColorsComponent } from './custom-colors';
import { ZardDemoAlertDestructiveComponent } from './destructive';
import { ZardDemoAlertPreviewComponent } from './preview';
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
  preview: {
    name: 'preview',
    component: ZardDemoAlertPreviewComponent,
    column: false,
    codeData: ALERT_DEMO_PREVIEW,
  },
  examples: [
    {
      name: 'basic',
      description:
        'Use `zIcon`, `zTitle`, and `zDescription` on `z-alert` to render a callout with an icon, title, and description.',
      component: ZardDemoAlertBasicComponent,
      codeData: ALERT_DEMO_BASIC,
    },
    {
      name: 'destructive',
      description:
        'Set `zType="destructive"` on `z-alert` to flag a critical message. When `zIcon` is not set, it defaults to `lucideCircleAlert`.',
      component: ZardDemoAlertDestructiveComponent,
      codeData: ALERT_DEMO_DESTRUCTIVE,
    },
    {
      name: 'action',
      description: 'Pass a `TemplateRef` to `zAction` to render a `z-button` inside the alert.',
      component: ZardDemoAlertActionComponent,
      codeData: ALERT_DEMO_ACTION,
    },
    {
      name: 'custom-colors',
      description: 'Override the `class` input on `z-alert` to customize its border, background, and text colors.',
      component: ZardDemoAlertCustomColorsComponent,
      codeData: ALERT_DEMO_CUSTOM_COLORS,
    },
  ],
};
