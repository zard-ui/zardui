import { SPINNER_DEMO_DEFAULT } from '@generated/components/spinner/demo/default';
import { SPINNER_DEMO_SIZE } from '@generated/components/spinner/demo/size';
import { SPINNER_CLI_ADD } from '@generated/installation/cli/add-spinner';
import { SPINNER_MANUAL_CODE } from '@generated/installation/manual/spinner';
import { SPINNER_USAGE_CODE, SPINNER_USAGE_IMPORT } from '@generated/usage/spinner';

import { ZardDemoSpinnerDefaultComponent } from './default';
import { ZardDemoSpinnerSizeComponent } from './size';
import { SPINNER_API } from '../doc/api';

export const SPINNER = {
  componentName: 'spinner',
  componentType: 'spinner',
  description:
    'A visual component that displays a loading animation to indicate that an action or process is in progress.',
  api: SPINNER_API,
  installData: {
    cliAdd: SPINNER_CLI_ADD,
    manualCode: SPINNER_MANUAL_CODE,
  },
  usage: { importBlock: SPINNER_USAGE_IMPORT, codeBlock: SPINNER_USAGE_CODE },
  examples: [
    {
      name: 'default',
      component: ZardDemoSpinnerDefaultComponent,
      codeData: SPINNER_DEMO_DEFAULT,
    },
    {
      name: 'size',
      component: ZardDemoSpinnerSizeComponent,
      codeData: SPINNER_DEMO_SIZE,
    },
  ],
};
