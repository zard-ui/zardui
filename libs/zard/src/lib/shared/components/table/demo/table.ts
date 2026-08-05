import { TABLE_DEMO_FOOTER } from '@generated/components/table/demo/footer';
import { TABLE_DEMO_INVOICES } from '@generated/components/table/demo/invoices';
import { TABLE_CLI_ADD } from '@generated/installation/cli/add-table';
import { TABLE_MANUAL_CODE } from '@generated/installation/manual/table';
import { TABLE_USAGE_CODE, TABLE_USAGE_IMPORT } from '@generated/usage/table';

import { ZardDemoTableFooterComponent } from './footer';
import { ZardDemoTableInvoicesComponent } from './invoices';
import { TABLE_API } from '../doc/api';

export const TABLE = {
  componentName: 'table',
  componentType: 'table',
  api: TABLE_API,
  description: 'A responsive table component.',
  installData: {
    cliAdd: TABLE_CLI_ADD,
    manualCode: TABLE_MANUAL_CODE,
  },
  usage: { importBlock: TABLE_USAGE_IMPORT, codeBlock: TABLE_USAGE_CODE },
  preview: {
    name: 'preview',
    component: ZardDemoTableInvoicesComponent,
    codeData: TABLE_DEMO_INVOICES,
  },
  examples: [
    {
      name: 'footer',
      component: ZardDemoTableFooterComponent,
      codeData: TABLE_DEMO_FOOTER,
    },
  ],
};
