import { ALERT_DIALOG_DEMO_BASIC } from '@generated/components/alert-dialog/demo/basic';
import { ALERT_DIALOG_DEMO_DESTRUCTIVE } from '@generated/components/alert-dialog/demo/destructive';
import { ALERT_DIALOG_DEMO_MEDIA } from '@generated/components/alert-dialog/demo/media';
import { ALERT_DIALOG_DEMO_PREVIEW } from '@generated/components/alert-dialog/demo/preview';
import { ALERT_DIALOG_DEMO_SMALL } from '@generated/components/alert-dialog/demo/small';
import { ALERT_DIALOG_DEMO_SMALL_WITH_MEDIA } from '@generated/components/alert-dialog/demo/small-with-media';
import { ALERT_DIALOG_CLI_ADD } from '@generated/installation/cli/add-alert-dialog';
import { ALERT_DIALOG_MANUAL_CODE } from '@generated/installation/manual/alert-dialog';
import { ALERT_DIALOG_USAGE_CODE, ALERT_DIALOG_USAGE_IMPORT } from '@generated/usage/alert-dialog';

import { ZardDemoAlertDialogBasicComponent } from './basic';
import { ZardDemoAlertDialogDestructiveComponent } from './destructive';
import { ZardDemoAlertDialogMediaComponent } from './media';
import { ZardDemoAlertDialogPreviewComponent } from './preview';
import { ZardDemoAlertDialogSmallComponent } from './small';
import { ZardDemoAlertDialogSmallWithMediaComponent } from './small-with-media';
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
  usage: { importBlock: ALERT_DIALOG_USAGE_IMPORT, codeBlock: ALERT_DIALOG_USAGE_CODE },
  preview: {
    name: 'preview',
    description: 'A basic alert dialog with a title, description, and cancel and continue buttons.',
    component: ZardDemoAlertDialogPreviewComponent,
    codeData: ALERT_DIALOG_DEMO_PREVIEW,
    column: false,
  },
  examples: [
    {
      name: 'basic',
      description: 'The minimal alert dialog: a title and the cancel/continue buttons, with no description.',
      component: ZardDemoAlertDialogBasicComponent,
      codeData: ALERT_DIALOG_DEMO_BASIC,
    },
    {
      name: 'small',
      description: 'Use the `zSize: "sm"` option to make the alert dialog smaller.',
      component: ZardDemoAlertDialogSmallComponent,
      codeData: ALERT_DIALOG_DEMO_SMALL,
    },
    {
      name: 'media',
      description:
        'Pass a `<ng-template>` via `zMedia` to add a media element such as an icon or image to the alert dialog.',
      component: ZardDemoAlertDialogMediaComponent,
      codeData: ALERT_DIALOG_DEMO_MEDIA,
    },
    {
      name: 'small-with-media',
      description:
        'Combine `zSize: "sm"` with the `zMedia` template to add a media element to the smaller alert dialog.',
      component: ZardDemoAlertDialogSmallWithMediaComponent,
      codeData: ALERT_DIALOG_DEMO_SMALL_WITH_MEDIA,
    },
    {
      name: 'destructive',
      description:
        'Use `zOkDestructive: true` along with `zMediaClass` to add a destructive action to the alert dialog.',
      component: ZardDemoAlertDialogDestructiveComponent,
      codeData: ALERT_DIALOG_DEMO_DESTRUCTIVE,
    },
  ],
};
