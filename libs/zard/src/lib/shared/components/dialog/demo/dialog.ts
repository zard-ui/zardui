import { DIALOG_DEMO_BASIC } from '@generated/components/dialog/demo/basic';
import { DIALOG_DEMO_CUSTOM_CLOSE } from '@generated/components/dialog/demo/custom-close';
import { DIALOG_DEMO_NO_CLOSE_BUTTON } from '@generated/components/dialog/demo/no-close-button';
import { DIALOG_DEMO_SCROLLABLE_CONTENT } from '@generated/components/dialog/demo/scrollable-content';
import { DIALOG_DEMO_STICKY_FOOTER } from '@generated/components/dialog/demo/sticky-footer';
import { DIALOG_CLI_ADD } from '@generated/installation/cli/add-dialog';
import { DIALOG_MANUAL_CODE } from '@generated/installation/manual/dialog';
import { DIALOG_USAGE_CODE, DIALOG_USAGE_IMPORT } from '@generated/usage/dialog';

import { ZardDemoDialogBasicComponent } from './basic';
import { ZardDemoDialogCustomCloseComponent } from './custom-close';
import { ZardDemoDialogNoCloseButtonComponent } from './no-close-button';
import { ZardDemoDialogScrollableContentComponent } from './scrollable-content';
import { ZardDemoDialogStickyFooterComponent } from './sticky-footer';
import { DIALOG_API } from '../doc/api';

export const DIALOG = {
  componentName: 'dialog',
  componentType: 'dialog',
  description: 'Visually or semantically separates content.',
  api: DIALOG_API,
  installData: {
    cliAdd: DIALOG_CLI_ADD,
    manualCode: DIALOG_MANUAL_CODE,
  },
  usage: { importBlock: DIALOG_USAGE_IMPORT, codeBlock: DIALOG_USAGE_CODE },
  preview: {
    name: 'preview',
    component: ZardDemoDialogBasicComponent,
    codeData: DIALOG_DEMO_BASIC,
    column: false,
  },
  examples: [
    {
      name: 'custom-close',
      description: 'Replace the default close control with your own button.',
      component: ZardDemoDialogCustomCloseComponent,
      codeData: DIALOG_DEMO_CUSTOM_CLOSE,
    },
    {
      name: 'no-close-button',
      description: 'Use `zClosable: false` to hide the close button.',
      component: ZardDemoDialogNoCloseButtonComponent,
      codeData: DIALOG_DEMO_NO_CLOSE_BUTTON,
    },
    {
      name: 'sticky-footer',
      description: 'Keep actions visible while the content scrolls.',
      component: ZardDemoDialogStickyFooterComponent,
      codeData: DIALOG_DEMO_STICKY_FOOTER,
    },
    {
      name: 'scrollable-content',
      description: 'Long content can scroll while the header stays in view.',
      component: ZardDemoDialogScrollableContentComponent,
      codeData: DIALOG_DEMO_SCROLLABLE_CONTENT,
    },
  ],
};
