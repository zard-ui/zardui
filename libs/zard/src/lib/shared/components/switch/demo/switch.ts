import { SWITCH_DEMO_CHOICE_CARD } from '@generated/components/switch/demo/choice-card';
import { SWITCH_DEMO_DEFAULT } from '@generated/components/switch/demo/default';
import { SWITCH_DEMO_DESCRIPTION } from '@generated/components/switch/demo/description';
import { SWITCH_DEMO_DISABLED } from '@generated/components/switch/demo/disabled';
import { SWITCH_DEMO_INVALID } from '@generated/components/switch/demo/invalid';
import { SWITCH_DEMO_SIZE } from '@generated/components/switch/demo/size';
import { SWITCH_CLI_ADD } from '@generated/installation/cli/add-switch';
import { SWITCH_MANUAL_CODE } from '@generated/installation/manual/switch';
import { SWITCH_USAGE_CODE, SWITCH_USAGE_IMPORT } from '@generated/usage/switch';

import { ZardDemoSwitchChoiceCardComponent } from './choice-card';
import { ZardDemoSwitchDefaultComponent } from './default';
import { ZardDemoSwitchDescriptionComponent } from './description';
import { ZardDemoSwitchDisabledComponent } from './disabled';
import { ZardDemoSwitchInvalidComponent } from './invalid';
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
    component: ZardDemoSwitchDefaultComponent,
    column: false,
    codeData: SWITCH_DEMO_DEFAULT,
  },
  examples: [
    {
      name: 'description',
      component: ZardDemoSwitchDescriptionComponent,
      codeData: SWITCH_DEMO_DESCRIPTION,
    },
    {
      name: 'choice-card',
      description: 'Card-style selection where `FieldLabel` wraps the entire `Field` for a clickable card pattern.',
      component: ZardDemoSwitchChoiceCardComponent,
      codeData: SWITCH_DEMO_CHOICE_CARD,
    },
    {
      name: 'disabled',
      description:
        'Add the `zDisabled` prop to the `Switch` component to disable the switch. Add the `data-disabled` prop to the `Field` component for styling.',
      component: ZardDemoSwitchDisabledComponent,
      codeData: SWITCH_DEMO_DISABLED,
    },
    {
      name: 'invalid',
      description:
        'Add the `zInvalid` prop to the `Switch` component to indicate an invalid state. Add the `data-invalid` prop to the `Field` component for styling.',
      component: ZardDemoSwitchInvalidComponent,
      codeData: SWITCH_DEMO_INVALID,
    },
    {
      name: 'size',
      description: 'Use the `zSize` prop to change the size of the switch.',
      component: ZardDemoSwitchSizeComponent,
      codeData: SWITCH_DEMO_SIZE,
    },
  ],
};
