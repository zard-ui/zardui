import { CHECKBOX_DEMO_BASIC } from '@generated/components/checkbox/demo/basic';
import { CHECKBOX_DEMO_DEFAULT } from '@generated/components/checkbox/demo/default';
import { CHECKBOX_DEMO_DESCRIPTION } from '@generated/components/checkbox/demo/description';
import { CHECKBOX_DEMO_DISABLED } from '@generated/components/checkbox/demo/disabled';
import { CHECKBOX_DEMO_GROUP } from '@generated/components/checkbox/demo/group';
import { CHECKBOX_DEMO_INVALID } from '@generated/components/checkbox/demo/invalid';
import { CHECKBOX_DEMO_TABLE } from '@generated/components/checkbox/demo/table';
import { CHECKBOX_CLI_ADD } from '@generated/installation/cli/add-checkbox';
import { CHECKBOX_MANUAL_CODE } from '@generated/installation/manual/checkbox';
import { CHECKBOX_USAGE_CODE, CHECKBOX_USAGE_IMPORT } from '@generated/usage/checkbox';

import { ZardDemoCheckboxBasicComponent } from './basic';
import { ZardDemoCheckboxDefaultComponent } from './default';
import { ZardDemoCheckboxDescriptionComponent } from './description';
import { ZardDemoCheckboxDisabledComponent } from './disabled';
import { ZardDemoCheckboxGroupComponent } from './group';
import { ZardDemoCheckboxInvalidComponent } from './invalid';
import { ZardDemoCheckboxTableComponent } from './table';
import { CHECKBOX_API } from '../doc/api';

export const CHECKBOX = {
  api: CHECKBOX_API,
  componentName: 'checkbox',
  componentType: 'checkbox',
  description: 'A control that allows the user to toggle between checked and not checked.',
  installData: {
    cliAdd: CHECKBOX_CLI_ADD,
    manualCode: CHECKBOX_MANUAL_CODE,
  },
  usage: { importBlock: CHECKBOX_USAGE_IMPORT, codeBlock: CHECKBOX_USAGE_CODE },
  preview: {
    name: 'preview',
    component: ZardDemoCheckboxDefaultComponent,
    column: false,
    codeData: CHECKBOX_DEMO_DEFAULT,
  },
  examples: [
    {
      name: 'invalid',
      description:
        'Set `aria-invalid` on the checkbox and `data-invalid` on the field wrapper to show the invalid styles.',
      component: ZardDemoCheckboxInvalidComponent,
      codeData: CHECKBOX_DEMO_INVALID,
    },
    {
      name: 'basic',
      description: 'Pair the checkbox with `Field` and `FieldLabel` for proper layout and labeling.',
      component: ZardDemoCheckboxBasicComponent,
      codeData: CHECKBOX_DEMO_BASIC,
    },
    {
      name: 'description',
      description: 'Use `FieldContent` and `FieldDescription` for helper text.',
      component: ZardDemoCheckboxDescriptionComponent,
      codeData: CHECKBOX_DEMO_DESCRIPTION,
    },
    {
      name: 'disabled',
      description:
        'Use the `disabled` prop to prevent interaction and add the `data-disabled` attribute to the `Field` component for disabled styles.',
      component: ZardDemoCheckboxDisabledComponent,
      codeData: CHECKBOX_DEMO_DISABLED,
    },
    {
      name: 'group',
      description: 'Use multiple fields to create a checkbox list.',
      component: ZardDemoCheckboxGroupComponent,
      codeData: CHECKBOX_DEMO_GROUP,
    },
    {
      name: 'table',
      description: 'Combine the checkbox with the `Table` component for selectable rows.',
      component: ZardDemoCheckboxTableComponent,
      codeData: CHECKBOX_DEMO_TABLE,
    },
  ],
};
