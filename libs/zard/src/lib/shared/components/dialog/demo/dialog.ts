import { DIALOG_DEMO_BASIC } from '@generated/components/dialog/demo/basic';
import { DIALOG_DEMO_ICONS } from '@generated/components/dialog/demo/icons';
import { DIALOG_CLI_ADD } from '@generated/installation/cli/add-dialog';
import { DIALOG_MANUAL_CODE } from '@generated/installation/manual/dialog';

import { ZardDemoDialogBasicComponent } from './basic';
import { ZardDemoDialogWithIconsComponent } from './icons';

export const DIALOG = {
  componentName: 'dialog',
  componentType: 'dialog',
  description: 'Visually or semantically separates content.',
  installData: {
    cliAdd: DIALOG_CLI_ADD,
    manualCode: DIALOG_MANUAL_CODE,
  },
  examples: [
    {
      name: 'basic',
      component: ZardDemoDialogBasicComponent,
      codeData: DIALOG_DEMO_BASIC,
    },
    {
      name: 'with-icons',
      component: ZardDemoDialogWithIconsComponent,
      codeData: DIALOG_DEMO_ICONS,
    },
  ],
};
