import { SELECT_DEMO_DEFAULT } from '@generated/components/select/demo/default';
import { SELECT_DEMO_MULTI_SELECT } from '@generated/components/select/demo/multi-select';
import { SELECT_CLI_ADD } from '@generated/installation/cli/add-select';
import { SELECT_MANUAL_CODE } from '@generated/installation/manual/select';

import { ZardDemoSelectBasicComponent } from './default';
import { ZardDemoMultiSelectBasicComponent } from './multi-select';

export const SELECT = {
  componentName: 'select',
  componentType: 'select',
  description: 'Displays a list of options for the user to pick from—triggered by a button.',
  installData: {
    cliAdd: SELECT_CLI_ADD,
    manualCode: SELECT_MANUAL_CODE,
  },
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
