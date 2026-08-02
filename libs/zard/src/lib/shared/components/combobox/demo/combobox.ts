import { COMBOBOX_DEMO_DEFAULT } from '@generated/components/combobox/demo/default';
import { COMBOBOX_DEMO_DISABLED } from '@generated/components/combobox/demo/disabled';
import { COMBOBOX_DEMO_FORM } from '@generated/components/combobox/demo/form';
import { COMBOBOX_DEMO_GROUPED } from '@generated/components/combobox/demo/grouped';
import { COMBOBOX_CLI_ADD } from '@generated/installation/cli/add-combobox';
import { COMBOBOX_MANUAL_CODE } from '@generated/installation/manual/combobox';
import { COMBOBOX_USAGE_IMPORT, COMBOBOX_USAGE_CODE } from '@generated/usage/combobox';

import { ZardDemoComboboxDefaultComponent } from './default';
import { ZardDemoComboboxDisabledComponent } from './disabled';
import { ZardDemoComboboxFormComponent } from './form';
import { ZardDemoComboboxGroupedComponent } from './grouped';
import { COMBOBOX_API } from '../doc/api';

export const COMBOBOX = {
  api: COMBOBOX_API,
  componentName: 'combobox',
  componentType: 'combobox',
  description: 'Autocomplete input and command palette with a list of suggestions.',
  installData: {
    cliAdd: COMBOBOX_CLI_ADD,
    manualCode: COMBOBOX_MANUAL_CODE,
  },
  usage: { importBlock: COMBOBOX_USAGE_IMPORT, codeBlock: COMBOBOX_USAGE_CODE },
  examples: [
    {
      name: 'default',
      component: ZardDemoComboboxDefaultComponent,
      codeData: COMBOBOX_DEMO_DEFAULT,
    },
    {
      name: 'grouped',
      component: ZardDemoComboboxGroupedComponent,
      codeData: COMBOBOX_DEMO_GROUPED,
    },
    {
      name: 'disabled',
      component: ZardDemoComboboxDisabledComponent,
      codeData: COMBOBOX_DEMO_DISABLED,
    },
    {
      name: 'form',
      component: ZardDemoComboboxFormComponent,
      codeData: COMBOBOX_DEMO_FORM,
    },
  ],
};
