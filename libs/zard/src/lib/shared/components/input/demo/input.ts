import { INPUT_DEMO_BADGE } from '@generated/components/input/demo/badge';
import { INPUT_DEMO_BASIC } from '@generated/components/input/demo/basic';
import { INPUT_DEMO_BUTTON_GROUP } from '@generated/components/input/demo/button-group';
import { INPUT_DEMO_DISABLED } from '@generated/components/input/demo/disabled';
import { INPUT_DEMO_FIELD } from '@generated/components/input/demo/field';
import { INPUT_DEMO_FIELD_GROUP } from '@generated/components/input/demo/field-group';
import { INPUT_DEMO_FILE } from '@generated/components/input/demo/file';
import { INPUT_DEMO_FORM } from '@generated/components/input/demo/form';
import { INPUT_DEMO_GRID } from '@generated/components/input/demo/grid';
import { INPUT_DEMO_INLINE } from '@generated/components/input/demo/inline';
import { INPUT_DEMO_INPUT_GROUP } from '@generated/components/input/demo/input-group';
import { INPUT_DEMO_INVALID } from '@generated/components/input/demo/invalid';
import { INPUT_DEMO_PREVIEW } from '@generated/components/input/demo/preview';
import { INPUT_DEMO_REQUIRED } from '@generated/components/input/demo/required';
import { INPUT_CLI_ADD } from '@generated/installation/cli/add-input';
import { INPUT_MANUAL_CODE } from '@generated/installation/manual/input';
import { INPUT_USAGE_CODE, INPUT_USAGE_IMPORT } from '@generated/usage/input';

import { ZardDemoInputBadgeComponent } from './badge';
import { ZardDemoInputBasicComponent } from './basic';
import { ZardDemoInputButtonGroupComponent } from './button-group';
import { ZardDemoInputDisabledComponent } from './disabled';
import { ZardDemoInputFieldComponent } from './field';
import { ZardDemoInputFieldGroupComponent } from './field-group';
import { ZardDemoInputFileComponent } from './file';
import { ZardDemoInputFormComponent } from './form';
import { ZardDemoInputGridComponent } from './grid';
import { ZardDemoInputInlineComponent } from './inline';
import { ZardDemoInputInputGroupComponent } from './input-group';
import { ZardDemoInputInvalidComponent } from './invalid';
import { ZardDemoInputPreviewComponent } from './preview';
import { ZardDemoInputRequiredComponent } from './required';
import { INPUT_API } from '../doc/api';

export const INPUT = {
  componentName: 'input',
  componentType: 'input',
  description: 'Displays a form input field or a component that looks like an input field.',
  api: INPUT_API,
  installData: {
    cliAdd: INPUT_CLI_ADD,
    manualCode: INPUT_MANUAL_CODE,
  },
  usage: { importBlock: INPUT_USAGE_IMPORT, codeBlock: INPUT_USAGE_CODE },
  preview: {
    name: 'preview',
    component: ZardDemoInputPreviewComponent,
    column: false,
    codeData: INPUT_DEMO_PREVIEW,
  },
  examples: [
    {
      name: 'basic',
      description: 'Use `input[z-input]` on its own for a simple, unlabeled input.',
      component: ZardDemoInputBasicComponent,
      codeData: INPUT_DEMO_BASIC,
    },
    {
      name: 'field',
      description:
        'Wrap `input[z-input]` in `z-field` with a `z-field-label` and `z-field-description` to add a label and helper text.',
      component: ZardDemoInputFieldComponent,
      codeData: INPUT_DEMO_FIELD,
    },
    {
      name: 'field-group',
      description:
        'Stack multiple `z-field` blocks inside `z-field-group` to build a mini form, and set `zOrientation="horizontal"` on the last one to lay the action buttons out in a row.',
      component: ZardDemoInputFieldGroupComponent,
      codeData: INPUT_DEMO_FIELD_GROUP,
    },
    {
      name: 'disabled',
      description:
        'Set the native `disabled` attribute on `input[z-input]`, and add `data-disabled="true"` to the surrounding `z-field` so its label and description dim along with the control.',
      component: ZardDemoInputDisabledComponent,
      codeData: INPUT_DEMO_DISABLED,
    },
    {
      name: 'invalid',
      description:
        'Set `aria-invalid="true"` on `input[z-input]` and `data-invalid="true"` on the surrounding `z-field` to mark the field as invalid; see the `form` example for wiring these attributes to a reactive form control.',
      component: ZardDemoInputInvalidComponent,
      codeData: INPUT_DEMO_INVALID,
    },
    {
      name: 'file',
      description: 'Set `type="file"` on `input[z-input]` to create a file picker.',
      component: ZardDemoInputFileComponent,
      codeData: INPUT_DEMO_FILE,
    },
    {
      name: 'inline',
      description:
        'Set `zOrientation="horizontal"` on `z-field` to lay the input and a `z-button` out in a row, for example to pair a search input with a submit button.',
      component: ZardDemoInputInlineComponent,
      codeData: INPUT_DEMO_INLINE,
    },
    {
      name: 'grid',
      description: 'Use a grid layout class on `z-field-group` to place multiple `z-field`s side by side.',
      component: ZardDemoInputGridComponent,
      codeData: INPUT_DEMO_GRID,
    },
    {
      name: 'required',
      description:
        'Set the native `required` attribute on `input[z-input]`, and add a visual required marker inside `z-field-label`.',
      component: ZardDemoInputRequiredComponent,
      codeData: INPUT_DEMO_REQUIRED,
    },
    {
      name: 'badge',
      description: 'Place a `z-badge` inside `z-field-label` to highlight a recommended field.',
      component: ZardDemoInputBadgeComponent,
      codeData: INPUT_DEMO_BADGE,
    },
    {
      name: 'input-group',
      description:
        'To add icons, text or buttons inside the input, wrap it in `z-input-group`. See the Input Group component for more examples.',
      component: ZardDemoInputInputGroupComponent,
      codeData: INPUT_DEMO_INPUT_GROUP,
    },
    {
      name: 'button-group',
      description:
        'To add a button next to the input, wrap both in `z-button-group`. See the Button Group component for more examples.',
      component: ZardDemoInputButtonGroupComponent,
      codeData: INPUT_DEMO_BUTTON_GROUP,
    },
    {
      name: 'form',
      description:
        "A full reactive form built from `z-field-group` and `z-field`, with `z-select` for the country and a live validation message on the email field once it's touched and invalid.",
      component: ZardDemoInputFormComponent,
      codeData: INPUT_DEMO_FORM,
    },
  ],
};
