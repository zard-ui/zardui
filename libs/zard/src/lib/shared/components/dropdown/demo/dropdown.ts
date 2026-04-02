import { DROPDOWN_DEMO_DEFAULT } from '@generated/components/dropdown/demo/default';
import { DROPDOWN_DEMO_HOVER } from '@generated/components/dropdown/demo/hover';
import { DROPDOWN_CLI_ADD } from '@generated/installation/cli/add-dropdown';
import { DROPDOWN_MANUAL_CODE } from '@generated/installation/manual/dropdown';

import { ZardDropdownHoverDemoComponent } from '@/shared/components/dropdown/demo/hover';

import { ZardDropdownDemoComponent } from './default';

export const DROPDOWN = {
  componentName: 'dropdown',
  componentType: 'dropdown',
  description: 'Displays a menu to the user — such as a set of actions or functions — triggered by a button.',
  installData: {
    cliAdd: DROPDOWN_CLI_ADD,
    manualCode: DROPDOWN_MANUAL_CODE,
  },
  examples: [
    {
      name: 'default',
      component: ZardDropdownDemoComponent,
      codeData: DROPDOWN_DEMO_DEFAULT,
    },
    {
      name: 'hover',
      component: ZardDropdownHoverDemoComponent,
      codeData: DROPDOWN_DEMO_HOVER,
    },
  ],
};
