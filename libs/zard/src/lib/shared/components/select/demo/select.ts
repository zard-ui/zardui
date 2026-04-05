import { SELECT_DEMO_DEFAULT } from '@generated/components/select/demo/default';
import { SELECT_DEMO_MULTI_SELECT } from '@generated/components/select/demo/multi-select';
import { SELECT_CLI_ADD } from '@generated/installation/cli/add-select';
import { SELECT_MANUAL_CODE } from '@generated/installation/manual/select';
import { SELECT_USAGE_CODE, SELECT_USAGE_IMPORT } from '@generated/usage/select';

import { ZardDemoSelectBasicComponent } from './default';
import { ZardDemoMultiSelectBasicComponent } from './multi-select';
import { SELECT_API } from '../doc/api';

export const SELECT = {
  componentName: 'select',
  componentType: 'select',
  api: SELECT_API,
  description: 'Displays a list of options for the user to pick from—triggered by a button.',
  installData: {
    cliAdd: SELECT_CLI_ADD,
    manualCode: SELECT_MANUAL_CODE,
  },
  usage: { importBlock: SELECT_USAGE_IMPORT, codeBlock: SELECT_USAGE_CODE },
  examples: [
    {
      name: 'default',
      component: ZardDemoSelectBasicComponent,
      codeData: SELECT_DEMO_DEFAULT,
    },
    {
      name: 'multi-select',
      component: ZardDemoMultiSelectBasicComponent,
      codeData: SELECT_DEMO_MULTI_SELECT,
    },
  ],
};
