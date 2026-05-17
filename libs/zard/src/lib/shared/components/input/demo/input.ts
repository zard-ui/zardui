import { INPUT_DEMO_BADGE } from '@generated/components/input/demo/badge';
import { INPUT_DEMO_BASIC } from '@generated/components/input/demo/basic';
import { INPUT_DEMO_BUTTON_GROUP } from '@generated/components/input/demo/button-group';
import { INPUT_DEMO_DEFAULT } from '@generated/components/input/demo/default';
import { INPUT_DEMO_DISABLED } from '@generated/components/input/demo/disabled';
import { INPUT_DEMO_FIELD } from '@generated/components/input/demo/field';
import { INPUT_DEMO_FIELD_GROUP } from '@generated/components/input/demo/field-group';
import { INPUT_DEMO_FILE } from '@generated/components/input/demo/file';
import { INPUT_DEMO_FORM } from '@generated/components/input/demo/form';
import { INPUT_DEMO_GRID } from '@generated/components/input/demo/grid';
import { INPUT_DEMO_INLINE } from '@generated/components/input/demo/inline';
import { INPUT_DEMO_INPUT_GROUP } from '@generated/components/input/demo/input-group';
import { INPUT_DEMO_INVALID } from '@generated/components/input/demo/invalid';
import { INPUT_DEMO_REQUIRED } from '@generated/components/input/demo/required';
import { INPUT_CLI_ADD } from '@generated/installation/cli/add-input';
import { INPUT_MANUAL_CODE } from '@generated/installation/manual/input';
import { INPUT_USAGE_CODE, INPUT_USAGE_IMPORT } from '@generated/usage/input';

import { ZardDemoInputBadgeComponent } from './badge';
import { ZardDemoInputBasicComponent } from './basic';
import { ZardDemoInputButtonGroupComponent } from './button-group';
import { ZardDemoInputDefaultComponent } from './default';
import { ZardDemoInputDisabledComponent } from './disabled';
import { ZardDemoInputFieldComponent } from './field';
import { ZardDemoInputFieldGroupComponent } from './field-group';
import { ZardDemoInputFileComponent } from './file';
import { ZardDemoInputFormComponent } from './form';
import { ZardDemoInputGridComponent } from './grid';
import { ZardDemoInputInlineComponent } from './inline';
import { ZardDemoInputInputGroupComponent } from './input-group';
import { ZardDemoInputInvalidComponent } from './invalid';
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
    component: ZardDemoInputDefaultComponent,
    column: false,
    codeData: INPUT_DEMO_DEFAULT,
  },
  examples: [
    {
      name: 'basic',
      component: ZardDemoInputBasicComponent,
      codeData: INPUT_DEMO_BASIC,
    },
    {
      name: 'field',
      description: 'Use `Field`, `FieldLabel`, and `FieldDescription` to create an input with a label and description.',
      component: ZardDemoInputFieldComponent,
      codeData: INPUT_DEMO_FIELD,
    },
    {
      name: 'field-group',
      description: 'Use `FieldGroup` to show multiple `Field` blocks and to build forms.',
      component: ZardDemoInputFieldGroupComponent,
      codeData: INPUT_DEMO_FIELD_GROUP,
    },
    {
      name: 'disabled',
      description:
        'Use the `disabled` prop to disable the input. To style the disabled state, add the `data-disabled` attribute to the `Field` component.',
      component: ZardDemoInputDisabledComponent,
      codeData: INPUT_DEMO_DISABLED,
    },
    {
      name: 'invalid',
      description:
        'Use the `aria-invalid` prop to mark the input as invalid. To style the invalid state, add the `data-invalid` attribute to the `Field` component.',
      component: ZardDemoInputInvalidComponent,
      codeData: INPUT_DEMO_INVALID,
    },
    {
      name: 'file',
      description: 'Use the `type="file"` prop to create a file input.',
      component: ZardDemoInputFileComponent,
      codeData: INPUT_DEMO_FILE,
    },
    {
      name: 'inline',
      description:
        'Use `Field` with `orientation="horizontal"` to create an inline input. Pair with `Button` to create a search input with a button.',
      component: ZardDemoInputInlineComponent,
      codeData: INPUT_DEMO_INLINE,
    },
    {
      name: 'grid',
      description: 'Use a grid layout to place multiple inputs side by side.',
      component: ZardDemoInputGridComponent,
      codeData: INPUT_DEMO_GRID,
    },
    {
      name: 'required',
      description: 'Use the `required` attribute to indicate required inputs.',
      component: ZardDemoInputRequiredComponent,
      codeData: INPUT_DEMO_REQUIRED,
    },
    {
      name: 'badge',
      description: 'Use `Badge` in the label to highlight a recommended field.',
      component: ZardDemoInputBadgeComponent,
      codeData: INPUT_DEMO_BADGE,
    },
    {
      name: 'input-group',
      description:
        'To add icons, text, or buttons inside an input, use the `InputGroup` component. See the Input Group component for more examples.',
      component: ZardDemoInputInputGroupComponent,
      codeData: INPUT_DEMO_INPUT_GROUP,
    },
    {
      name: 'button-group',
      description:
        'To add buttons to an input, use the `ButtonGroup` component. See the Button Group component for more examples.',
      component: ZardDemoInputButtonGroupComponent,
      codeData: INPUT_DEMO_BUTTON_GROUP,
    },
    {
      name: 'form',
      description: 'A full form example with multiple inputs, a select, and a button.',
      component: ZardDemoInputFormComponent,
      codeData: INPUT_DEMO_FORM,
    },
  ],
};
