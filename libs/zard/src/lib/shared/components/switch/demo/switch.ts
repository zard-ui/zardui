import { SWITCH_DEMO_CHOICE_CARD } from '@generated/components/switch/demo/choice-card';
import { SWITCH_DEMO_CONTROLLED } from '@generated/components/switch/demo/controlled';
import { SWITCH_DEMO_DESCRIPTION } from '@generated/components/switch/demo/description';
import { SWITCH_DEMO_DISABLED } from '@generated/components/switch/demo/disabled';
import { SWITCH_DEMO_INVALID } from '@generated/components/switch/demo/invalid';
import { SWITCH_DEMO_PREVIEW } from '@generated/components/switch/demo/preview';
import { SWITCH_DEMO_REACTIVE_FORMS } from '@generated/components/switch/demo/reactive-forms';
import { SWITCH_DEMO_SIZE } from '@generated/components/switch/demo/size';
import { SWITCH_CLI_ADD } from '@generated/installation/cli/add-switch';
import { SWITCH_MANUAL_CODE } from '@generated/installation/manual/switch';
import { SWITCH_USAGE_CODE, SWITCH_USAGE_IMPORT } from '@generated/usage/switch';

import { ZardDemoSwitchChoiceCardComponent } from './choice-card';
import { ZardDemoSwitchControlledComponent } from './controlled';
import { ZardDemoSwitchDescriptionComponent } from './description';
import { ZardDemoSwitchDisabledComponent } from './disabled';
import { ZardDemoSwitchInvalidComponent } from './invalid';
import { ZardDemoSwitchPreviewComponent } from './preview';
import { ZardDemoSwitchReactiveFormsComponent } from './reactive-forms';
import { ZardDemoSwitchSizeComponent } from './size';
import { SWITCH_API } from '../doc/api';

export const SWITCH = {
  componentName: 'switch',
  componentType: 'switch',
  api: SWITCH_API,
  description: 'A control that allows the user to toggle between checked and unchecked.',
  installData: {
    cliAdd: SWITCH_CLI_ADD,
    manualCode: SWITCH_MANUAL_CODE,
  },
  usage: { importBlock: SWITCH_USAGE_IMPORT, codeBlock: SWITCH_USAGE_CODE },
  preview: {
    name: 'preview',
    component: ZardDemoSwitchPreviewComponent,
    column: false,
    codeData: SWITCH_DEMO_PREVIEW,
  },
  examples: [
    {
      name: 'description',
      description: 'Pair `z-field-content` with `z-field-label` and `z-field-description` for helper text.',
      component: ZardDemoSwitchDescriptionComponent,
      codeData: SWITCH_DEMO_DESCRIPTION,
    },
    {
      name: 'choice-card',
      description:
        'Card-style selection where `label[z-field-label]` wraps the entire `z-field` for a clickable card pattern.',
      component: ZardDemoSwitchChoiceCardComponent,
      codeData: SWITCH_DEMO_CHOICE_CARD,
    },
    {
      name: 'disabled',
      description:
        'Use `zDisabled` to disable the switch, and add `data-disabled` to `z-field` for the matching wrapper styles.',
      component: ZardDemoSwitchDisabledComponent,
      codeData: SWITCH_DEMO_DISABLED,
    },
    {
      name: 'invalid',
      description:
        'Use `zInvalid` to mark the switch as invalid (sets `aria-invalid`), and add `data-invalid` to `z-field` for the matching wrapper styles.',
      component: ZardDemoSwitchInvalidComponent,
      codeData: SWITCH_DEMO_INVALID,
    },
    {
      name: 'size',
      description: 'Use `zSize` to change the size of the switch (`default` or `sm`).',
      component: ZardDemoSwitchSizeComponent,
      codeData: SWITCH_DEMO_SIZE,
    },
    {
      name: 'controlled',
      description:
        'Drive the switch from outside with a one-way `[zChecked]` binding and the `(zCheckedChange)` output, instead of the two-way `[(zChecked)]` binding.',
      component: ZardDemoSwitchControlledComponent,
      codeData: SWITCH_DEMO_CONTROLLED,
    },
    {
      name: 'reactive-forms',
      description:
        'Bind `z-switch` with `formControlName`; a control created with `disabled: true` renders the switch disabled and keeps it in sync.',
      component: ZardDemoSwitchReactiveFormsComponent,
      codeData: SWITCH_DEMO_REACTIVE_FORMS,
    },
  ],
};
