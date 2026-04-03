import { PAGINATION_DEMO_CUSTOM } from '@generated/components/pagination/demo/custom';
import { PAGINATION_DEMO_DEFAULT } from '@generated/components/pagination/demo/default';
import { PAGINATION_CLI_ADD } from '@generated/installation/cli/add-pagination';
import { PAGINATION_MANUAL_CODE } from '@generated/installation/manual/pagination';

import { ZardDemoPaginationCustomComponent } from './custom';
import { ZardDemoPaginationDefaultComponent } from './default';
import { PAGINATION_API } from '../doc/api';

export const PAGINATION = {
  componentName: 'pagination',
  componentType: 'pagination',
  description: 'Pagination with page navigation, next and previous links.',
  api: PAGINATION_API,
  installData: {
    cliAdd: PAGINATION_CLI_ADD,
    manualCode: PAGINATION_MANUAL_CODE,
  },
  examples: [
    {
      name: 'default',
      component: ZardDemoPaginationDefaultComponent,
      codeData: PAGINATION_DEMO_DEFAULT,
    },
    {
      name: 'custom',
      component: ZardDemoPaginationCustomComponent,
      codeData: PAGINATION_DEMO_CUSTOM,
    },
  ],
};
