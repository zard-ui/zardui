import { TABLE_DEMO_PAYMENTS } from '@generated/components/table/demo/payments';
import { TABLE_DEMO_SIMPLE } from '@generated/components/table/demo/simple';
import { TABLE_CLI_ADD } from '@generated/installation/cli/add-table';
import { TABLE_MANUAL_CODE } from '@generated/installation/manual/table';
import { TABLE_USAGE_CODE, TABLE_USAGE_IMPORT } from '@generated/usage/table';

import { ZardDemoTablePaymentsComponent } from './payments';
import { ZardDemoTableSimpleComponent } from './simple';
import { TABLE_API } from '../doc/api';

export const TABLE = {
  componentName: 'table',
  componentType: 'table',
  api: TABLE_API,
  description: 'Displays data in a structured table format with styling variants and semantic HTML structure.',
  installData: {
    cliAdd: TABLE_CLI_ADD,
    manualCode: TABLE_MANUAL_CODE,
  },
  usage: { importBlock: TABLE_USAGE_IMPORT, codeBlock: TABLE_USAGE_CODE },
  examples: [
    {
      name: 'simple',
      component: ZardDemoTableSimpleComponent,
      codeData: TABLE_DEMO_SIMPLE,
    },
    {
      name: 'payments',
      component: ZardDemoTablePaymentsComponent,
      codeData: TABLE_DEMO_PAYMENTS,
    },
  ],
};
