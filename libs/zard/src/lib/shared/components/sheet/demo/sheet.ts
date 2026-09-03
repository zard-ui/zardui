import { SHEET_DEMO_NO_CLOSE_BUTTON } from '@generated/components/sheet/demo/no-close-button';
import { SHEET_DEMO_PREVIEW } from '@generated/components/sheet/demo/preview';
import { SHEET_DEMO_SIDE } from '@generated/components/sheet/demo/side';
import { SHEET_CLI_ADD } from '@generated/installation/cli/add-sheet';
import { SHEET_MANUAL_CODE } from '@generated/installation/manual/sheet';
import { SHEET_USAGE_CODE, SHEET_USAGE_IMPORT } from '@generated/usage/sheet';

import { ZardDemoSheetNoCloseButtonComponent } from './no-close-button';
import { ZardDemoSheetPreviewComponent } from './preview';
import { ZardDemoSheetSideComponent } from './side';
import { SHEET_API } from '../doc/api';

export const SHEET = {
  componentName: 'sheet',
  componentType: 'sheet',
  api: SHEET_API,
  description: 'Extends the Dialog component to display content that complements the main content of the screen.',
  about: {
    description:
      'A sheet is a dialog anchored to an edge of the screen — pick the edge with `zSide` — for secondary or detail content that keeps the surrounding page visible instead of covering it entirely. Reach for `ZardDialogService` instead when the content is centered and self-contained, `ZardDrawerService` for a touch-first panel with swipe-to-dismiss and snap points, and `ZardAlertDialogService` when the user must explicitly acknowledge an interruptive confirmation before continuing.',
  },
  installData: {
    cliAdd: SHEET_CLI_ADD,
    manualCode: SHEET_MANUAL_CODE,
  },
  usage: { importBlock: SHEET_USAGE_IMPORT, codeBlock: SHEET_USAGE_CODE },
  preview: {
    name: 'preview',
    component: ZardDemoSheetPreviewComponent,
    codeData: SHEET_DEMO_PREVIEW,
    column: false,
  },
  examples: [
    {
      name: 'side',
      description:
        'Use the `zSide` option to set the edge of the screen where the sheet appears. Values are `top`, `right`, `bottom`, or `left`.',
      component: ZardDemoSheetSideComponent,
      codeData: SHEET_DEMO_SIDE,
    },
    {
      name: 'no-close-button',
      description:
        'Use `zClosable: false` to hide the close button; press Escape or click outside the sheet to close it.',
      component: ZardDemoSheetNoCloseButtonComponent,
      codeData: SHEET_DEMO_NO_CLOSE_BUTTON,
    },
  ],
};
