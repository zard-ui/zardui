import { TEXTAREA_DEMO_BUTTON } from '@generated/components/textarea/demo/button';
import { TEXTAREA_DEMO_DEFAULT } from '@generated/components/textarea/demo/default';
import { TEXTAREA_DEMO_DISABLED } from '@generated/components/textarea/demo/disabled';
import { TEXTAREA_DEMO_FIELD } from '@generated/components/textarea/demo/field';
import { TEXTAREA_DEMO_INVALID } from '@generated/components/textarea/demo/invalid';
import { TEXTAREA_CLI_ADD } from '@generated/installation/cli/add-textarea';
import { TEXTAREA_MANUAL_CODE } from '@generated/installation/manual/textarea';
import { TEXTAREA_USAGE_CODE, TEXTAREA_USAGE_IMPORT } from '@generated/usage/textarea';

import { ZardDemoTextareaButtonComponent } from './button';
import { ZardDemoTextareaDefaultComponent } from './default';
import { ZardDemoTextareaDisabledComponent } from './disabled';
import { ZardDemoTextareaFieldComponent } from './field';
import { ZardDemoTextareaInvalidComponent } from './invalid';
import { TEXTAREA_API } from '../doc/api';

export const TEXTAREA = {
  componentName: 'textarea',
  componentType: 'textarea',
  description: 'Displays a form textarea or a component that looks like a textarea.',
  api: TEXTAREA_API,
  installData: {
    cliAdd: TEXTAREA_CLI_ADD,
    manualCode: TEXTAREA_MANUAL_CODE,
  },
  usage: { importBlock: TEXTAREA_USAGE_IMPORT, codeBlock: TEXTAREA_USAGE_CODE },
  preview: {
    name: 'preview',
    component: ZardDemoTextareaDefaultComponent,
    column: false,
    codeData: TEXTAREA_DEMO_DEFAULT,
  },
  examples: [
    {
      name: 'field',
      description: 'Use Field, FieldLabel, and FieldDescription to create a textarea with a label and description.',
      component: ZardDemoTextareaFieldComponent,
      codeData: TEXTAREA_DEMO_FIELD,
    },
    {
      name: 'disabled',
      description:
        'Use the disabled prop to disable the textarea. To style the disabled state, add the data-disabled attribute to the Field component.',
      component: ZardDemoTextareaDisabledComponent,
      codeData: TEXTAREA_DEMO_DISABLED,
    },
    {
      name: 'invalid',
      description:
        'Use the aria-invalid prop to mark the textarea as invalid. To style the invalid state, add the data-invalid attribute to the Field component.',
      component: ZardDemoTextareaInvalidComponent,
      codeData: TEXTAREA_DEMO_INVALID,
    },
    {
      name: 'button',
      description: 'Pair with Button to create a textarea with a submit button.',
      component: ZardDemoTextareaButtonComponent,
      codeData: TEXTAREA_DEMO_BUTTON,
    },
  ],
};
