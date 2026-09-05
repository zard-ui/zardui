import { TEXTAREA_DEMO_BUTTON } from '@generated/components/textarea/demo/button';
import { TEXTAREA_DEMO_DISABLED } from '@generated/components/textarea/demo/disabled';
import { TEXTAREA_DEMO_FIELD } from '@generated/components/textarea/demo/field';
import { TEXTAREA_DEMO_FORM } from '@generated/components/textarea/demo/form';
import { TEXTAREA_DEMO_INVALID } from '@generated/components/textarea/demo/invalid';
import { TEXTAREA_DEMO_PREVIEW } from '@generated/components/textarea/demo/preview';
import { TEXTAREA_CLI_ADD } from '@generated/installation/cli/add-textarea';
import { TEXTAREA_MANUAL_CODE } from '@generated/installation/manual/textarea';
import { TEXTAREA_USAGE_CODE, TEXTAREA_USAGE_IMPORT } from '@generated/usage/textarea';

import { ZardDemoTextareaButtonComponent } from './button';
import { ZardDemoTextareaDisabledComponent } from './disabled';
import { ZardDemoTextareaFieldComponent } from './field';
import { ZardDemoTextareaFormComponent } from './form';
import { ZardDemoTextareaInvalidComponent } from './invalid';
import { ZardDemoTextareaPreviewComponent } from './preview';
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
    component: ZardDemoTextareaPreviewComponent,
    column: false,
    codeData: TEXTAREA_DEMO_PREVIEW,
  },
  examples: [
    {
      name: 'field',
      description:
        'Wrap `textarea[z-textarea]` in `z-field` with a `z-field-label` and `z-field-description` to add a label and helper text.',
      component: ZardDemoTextareaFieldComponent,
      codeData: TEXTAREA_DEMO_FIELD,
    },
    {
      name: 'disabled',
      description:
        'Set the native `disabled` attribute on `textarea[z-textarea]`, and add `data-disabled="true"` to the surrounding `z-field` so its label dims along with the control.',
      component: ZardDemoTextareaDisabledComponent,
      codeData: TEXTAREA_DEMO_DISABLED,
    },
    {
      name: 'invalid',
      description:
        'Set `aria-invalid="true"` on `textarea[z-textarea]` and `data-invalid="true"` on the surrounding `z-field` to mark the field as invalid; see the `form` example for wiring these attributes to a reactive form control.',
      component: ZardDemoTextareaInvalidComponent,
      codeData: TEXTAREA_DEMO_INVALID,
    },
    {
      name: 'button',
      description: 'Pair `textarea[z-textarea]` with `z-button` to build a message box with a submit action.',
      component: ZardDemoTextareaButtonComponent,
      codeData: TEXTAREA_DEMO_BUTTON,
    },
    {
      name: 'form',
      description:
        "A reactive form built from `z-field` and `formControlName`, with a live validation message on the feedback textarea once it's touched and invalid.",
      component: ZardDemoTextareaFormComponent,
      codeData: TEXTAREA_DEMO_FORM,
    },
  ],
};
