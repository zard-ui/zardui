import { FIELD_DEMO_CHECKBOX } from '@generated/components/field/demo/checkbox';
import { FIELD_DEMO_CHOICE_CARD } from '@generated/components/field/demo/choice-card';
import { FIELD_DEMO_FIELD_GROUP } from '@generated/components/field/demo/field-group';
import { FIELD_DEMO_FIELDSET } from '@generated/components/field/demo/fieldset';
import { FIELD_DEMO_INPUT } from '@generated/components/field/demo/input';
import { FIELD_DEMO_INVALID } from '@generated/components/field/demo/invalid';
import { FIELD_DEMO_PREVIEW } from '@generated/components/field/demo/preview';
import { FIELD_DEMO_RADIO } from '@generated/components/field/demo/radio';
import { FIELD_DEMO_RESPONSIVE } from '@generated/components/field/demo/responsive';
import { FIELD_DEMO_SELECT } from '@generated/components/field/demo/select';
import { FIELD_DEMO_SLIDER } from '@generated/components/field/demo/slider';
import { FIELD_DEMO_SWITCH } from '@generated/components/field/demo/switch';
import { FIELD_DEMO_TEXTAREA } from '@generated/components/field/demo/textarea';
import { FIELD_CLI_ADD } from '@generated/installation/cli/add-field';
import { FIELD_MANUAL_CODE } from '@generated/installation/manual/field';
import { FIELD_USAGE_CODE, FIELD_USAGE_IMPORT } from '@generated/usage/field';

import { ZardDemoFieldCheckboxComponent } from './checkbox';
import { ZardDemoFieldChoiceCardComponent } from './choice-card';
import { ZardDemoFieldFieldGroupComponent } from './field-group';
import { ZardDemoFieldFieldsetComponent } from './fieldset';
import { ZardDemoFieldInputComponent } from './input';
import { ZardDemoFieldInvalidComponent } from './invalid';
import { ZardDemoFieldPreviewComponent } from './preview';
import { ZardDemoFieldRadioComponent } from './radio';
import { ZardDemoFieldResponsiveComponent } from './responsive';
import { ZardDemoFieldSelectComponent } from './select';
import { ZardDemoFieldSliderComponent } from './slider';
import { ZardDemoFieldSwitchComponent } from './switch';
import { ZardDemoFieldTextareaComponent } from './textarea';
import { FIELD_API } from '../doc/api';

export const FIELD = {
  api: FIELD_API,
  componentName: 'field',
  componentType: 'field',
  description: 'Composable building blocks for building accessible forms with labels, descriptions and errors.',
  installData: {
    cliAdd: FIELD_CLI_ADD,
    manualCode: FIELD_MANUAL_CODE,
  },
  usage: { importBlock: FIELD_USAGE_IMPORT, codeBlock: FIELD_USAGE_CODE },
  preview: {
    name: 'preview',
    description:
      'A checkout form composing `z-field-group`, `z-field-set` / `z-field-legend`, `z-field`, `z-field-label`, `z-field-description` and `z-field-separator` around `z-input`, `z-select`, `z-checkbox` and `z-textarea`.',
    component: ZardDemoFieldPreviewComponent,
    codeData: FIELD_DEMO_PREVIEW,
    column: false,
  },
  examples: [
    {
      name: 'input',
      description:
        'Stack `z-field-label`, `z-input` and `z-field-description` inside `z-field`; `z-field-description` can be placed above or below the control depending on where it sits in the template.',
      component: ZardDemoFieldInputComponent,
      codeData: FIELD_DEMO_INPUT,
    },
    {
      name: 'textarea',
      description:
        'Compose `z-field` with `z-field-label`, `z-textarea` and `z-field-description` the same way as an input.',
      component: ZardDemoFieldTextareaComponent,
      codeData: FIELD_DEMO_TEXTAREA,
    },
    {
      name: 'select',
      description:
        'Compose `z-field` with `z-field-label`, `z-select` and `z-field-description` to label and describe a select control.',
      component: ZardDemoFieldSelectComponent,
      codeData: FIELD_DEMO_SELECT,
    },
    {
      name: 'slider',
      description:
        "Use `z-field-title` instead of `z-field-label` when the control has no natural `for` target, and update `z-field-description` live from the `z-slider`'s `(zSlideIndexChange)` output.",
      component: ZardDemoFieldSliderComponent,
      codeData: FIELD_DEMO_SLIDER,
    },
    {
      name: 'fieldset',
      description:
        'Group related `z-field`s under `z-field-set` with a `z-field-legend` and a shared `z-field-description`; lay fields out side by side with a plain grid inside `z-field-group`.',
      component: ZardDemoFieldFieldsetComponent,
      codeData: FIELD_DEMO_FIELDSET,
    },
    {
      name: 'checkbox',
      description:
        'Set `zOrientation="horizontal"` on `z-field` to put `z-checkbox` before its `z-field-label`; use `z-field-content` when a checkbox needs both a title and a description.',
      component: ZardDemoFieldCheckboxComponent,
      codeData: FIELD_DEMO_CHECKBOX,
    },
    {
      name: 'radio',
      description:
        'Pair each `z-radio` (inside `z-radio-group`) with a horizontal `z-field` and `z-field-label`, wrapped in a `z-field-set` whose `z-field-legend` uses the `label` variant.',
      component: ZardDemoFieldRadioComponent,
      codeData: FIELD_DEMO_RADIO,
    },
    {
      name: 'switch',
      description:
        'Pair `z-switch` with `z-field-label` and `zOrientation="horizontal"` on `z-field` for a single inline toggle.',
      component: ZardDemoFieldSwitchComponent,
      codeData: FIELD_DEMO_SWITCH,
    },
    {
      name: 'choice-card',
      description:
        'Wrap `z-field` inside `z-field-label` (instead of the other way around) to make the whole card clickable, and use `z-field-content` for the title and description next to a `z-radio`.',
      component: ZardDemoFieldChoiceCardComponent,
      codeData: FIELD_DEMO_CHOICE_CARD,
    },
    {
      name: 'field-group',
      description:
        'Stack `z-field-set` blocks with `z-field-group` and divide them with `z-field-separator`; nest a `data-slot="checkbox-group"` `z-field-group` for tighter spacing between related checkboxes.',
      component: ZardDemoFieldFieldGroupComponent,
      codeData: FIELD_DEMO_FIELD_GROUP,
    },
    {
      name: 'responsive',
      description:
        'Set `zOrientation="responsive"` on `z-field` to stack the label and control on narrow containers and align them in a row once the parent `z-field-group` container query crosses its `@md` breakpoint.',
      component: ZardDemoFieldResponsiveComponent,
      codeData: FIELD_DEMO_RESPONSIVE,
    },
    {
      name: 'invalid',
      description:
        "Bind the `data-invalid` attribute on `z-field` and `aria-invalid` on the control to a reactive form control's `invalid && touched` state, then render the message from `control.hasError(...)` inside `z-field-error` — the pattern every other invalid-state demo in the library builds on.",
      component: ZardDemoFieldInvalidComponent,
      codeData: FIELD_DEMO_INVALID,
    },
  ],
};
