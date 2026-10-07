import { CHECKBOX_DEMO_BASIC } from '@generated/components/checkbox/demo/basic';
import { CHECKBOX_DEMO_CONTROLLED } from '@generated/components/checkbox/demo/controlled';
import { CHECKBOX_DEMO_DESCRIPTION } from '@generated/components/checkbox/demo/description';
import { CHECKBOX_DEMO_DISABLED } from '@generated/components/checkbox/demo/disabled';
import { CHECKBOX_DEMO_GROUP } from '@generated/components/checkbox/demo/group';
import { CHECKBOX_DEMO_INVALID } from '@generated/components/checkbox/demo/invalid';
import { CHECKBOX_DEMO_PREVIEW } from '@generated/components/checkbox/demo/preview';
import { CHECKBOX_DEMO_REACTIVE_FORMS } from '@generated/components/checkbox/demo/reactive-forms';
import { CHECKBOX_DEMO_TABLE } from '@generated/components/checkbox/demo/table';
import { CHECKBOX_CLI_ADD } from '@generated/installation/cli/add-checkbox';
import { CHECKBOX_MANUAL_CODE } from '@generated/installation/manual/checkbox';
import { CHECKBOX_USAGE_CODE, CHECKBOX_USAGE_IMPORT } from '@generated/usage/checkbox';

import { ZardDemoCheckboxBasicComponent } from './basic';
import { ZardDemoCheckboxControlledComponent } from './controlled';
import { ZardDemoCheckboxDescriptionComponent } from './description';
import { ZardDemoCheckboxDisabledComponent } from './disabled';
import { ZardDemoCheckboxGroupComponent } from './group';
import { ZardDemoCheckboxInvalidComponent } from './invalid';
import { ZardDemoCheckboxPreviewComponent } from './preview';
import { ZardDemoCheckboxReactiveFormsComponent } from './reactive-forms';
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
    component: ZardDemoCheckboxPreviewComponent,
    column: false,
    codeData: CHECKBOX_DEMO_PREVIEW,
  },
  examples: [
    {
      name: 'invalid',
      description:
        'Set `zInvalid` on `z-checkbox` (which sets `aria-invalid`) and `data-invalid` on `z-field` to show the invalid styles.',
      component: ZardDemoCheckboxInvalidComponent,
      codeData: CHECKBOX_DEMO_INVALID,
    },
    {
      name: 'basic',
      description: 'Pair `z-checkbox` with `z-field` and `z-field-label` for proper layout and labeling.',
      component: ZardDemoCheckboxBasicComponent,
      codeData: CHECKBOX_DEMO_BASIC,
    },
    {
      name: 'description',
      description: 'Use `z-field-content` and `z-field-description` for helper text.',
      component: ZardDemoCheckboxDescriptionComponent,
      codeData: CHECKBOX_DEMO_DESCRIPTION,
    },
    {
      name: 'disabled',
      description:
        'Use `zDisabled` to prevent interaction, and add the `data-disabled` attribute to `z-field` for disabled styles.',
      component: ZardDemoCheckboxDisabledComponent,
      codeData: CHECKBOX_DEMO_DISABLED,
    },
    {
      name: 'group',
      description: 'Use multiple `z-field` rows inside a `fieldset[z-field-set]` to create a checkbox list.',
      component: ZardDemoCheckboxGroupComponent,
      codeData: CHECKBOX_DEMO_GROUP,
    },
    {
      name: 'table',
      description: 'Combine `z-checkbox` with `z-table` for selectable rows.',
      component: ZardDemoCheckboxTableComponent,
      codeData: CHECKBOX_DEMO_TABLE,
    },
    {
      name: 'controlled',
      description:
        'Drive `z-checkbox` from external state with a one-way `[ngModel]` binding and the `(checkChange)` output, the equivalent of a controlled checked/onCheckedChange pair.',
      component: ZardDemoCheckboxControlledComponent,
      codeData: CHECKBOX_DEMO_CONTROLLED,
    },
    {
      name: 'reactive-forms',
      description:
        'Bind `z-checkbox` with `formControlName`; the disabled state of a `FormControl` is respected out of the box.',
      component: ZardDemoCheckboxReactiveFormsComponent,
      codeData: CHECKBOX_DEMO_REACTIVE_FORMS,
    },
  ],
};
