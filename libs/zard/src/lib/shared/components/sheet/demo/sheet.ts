import { SHEET_DEMO_BASIC } from '@generated/components/sheet/demo/basic';
import { SHEET_DEMO_DIMENSIONS } from '@generated/components/sheet/demo/dimensions';
import { SHEET_DEMO_SIDE } from '@generated/components/sheet/demo/side';
import { SHEET_CLI_ADD } from '@generated/installation/cli/add-sheet';
import { SHEET_MANUAL_CODE } from '@generated/installation/manual/sheet';
import { SHEET_USAGE_CODE, SHEET_USAGE_IMPORT } from '@generated/usage/sheet';

import { ZardDemoSheetBasicComponent } from './basic';
import { ZardDemoSheetDimensionsComponent } from './dimensions';
import { ZardDemoSheetSideComponent } from './side';
import { SHEET_API } from '../doc/api';

export const SHEET = {
  componentName: 'sheet',
  componentType: 'sheet',
  api: SHEET_API,
  description: 'Extends the Dialog component to display content that complements the main content of the screen.',
  installData: {
    cliAdd: SHEET_CLI_ADD,
    manualCode: SHEET_MANUAL_CODE,
  },
  usage: { importBlock: SHEET_USAGE_IMPORT, codeBlock: SHEET_USAGE_CODE },
  examples: [
    {
      name: 'basic',
      component: ZardDemoSheetBasicComponent,
      codeData: SHEET_DEMO_BASIC,
    },
    {
      name: 'side',
      component: ZardDemoSheetSideComponent,
      codeData: SHEET_DEMO_SIDE,
    },
    {
      name: 'dimensions',
      component: ZardDemoSheetDimensionsComponent,
      codeData: SHEET_DEMO_DIMENSIONS,
    },
  ],
};
