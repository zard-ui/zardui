import { SEPARATOR_DEMO_DEFAULT } from '@generated/components/separator/demo/default';
import { SEPARATOR_DEMO_VERTICAL } from '@generated/components/separator/demo/vertical';
import { SEPARATOR_CLI_ADD } from '@generated/installation/cli/add-separator';
import { SEPARATOR_MANUAL_CODE } from '@generated/installation/manual/separator';
import { SEPARATOR_USAGE_CODE, SEPARATOR_USAGE_IMPORT } from '@generated/usage/separator';

import { ZardDemoSeparatorDefaultComponent } from './default';
import { ZardDemoSeparatorVerticalComponent } from './vertical';
import { SEPARATOR_API } from '../doc/api';

export const SEPARATOR = {
  componentName: 'separator',
  componentType: 'separator',
  description: 'Visually or semantically separates content.',
  api: SEPARATOR_API,
  installData: {
    cliAdd: SEPARATOR_CLI_ADD,
    manualCode: SEPARATOR_MANUAL_CODE,
  },
  usage: { importBlock: SEPARATOR_USAGE_IMPORT, codeBlock: SEPARATOR_USAGE_CODE },
  examples: [
    {
      name: 'default',
      component: ZardDemoSeparatorDefaultComponent,
      codeData: SEPARATOR_DEMO_DEFAULT,
    },
    {
      name: 'vertical',
      component: ZardDemoSeparatorVerticalComponent,
      codeData: SEPARATOR_DEMO_VERTICAL,
    },
  ],
};
