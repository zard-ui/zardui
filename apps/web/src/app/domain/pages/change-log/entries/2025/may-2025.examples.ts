import { CHECKBOX_DEMO_DEFAULT } from '@generated/components/checkbox/demo/default';
import { RADIO_GROUP_DEMO_DEFAULT } from '@generated/components/radio-group/demo/default';
import { SELECT_DEMO_DEFAULT } from '@generated/components/select/demo/default';
import { SLIDER_DEMO_DEFAULT } from '@generated/components/slider/demo/default';
import { SWITCH_DEMO_DEFAULT } from '@generated/components/switch/demo/default';
import { CHECKBOX_CLI_ADD } from '@generated/installation/cli/add-checkbox';
import { RADIO_GROUP_CLI_ADD } from '@generated/installation/cli/add-radio-group';
import { SELECT_CLI_ADD } from '@generated/installation/cli/add-select';
import { SLIDER_CLI_ADD } from '@generated/installation/cli/add-slider';
import { SWITCH_CLI_ADD } from '@generated/installation/cli/add-switch';

import { ZardDemoCheckboxDefaultComponent } from '@zard/components/checkbox/demo/default';
import { ZardDemoRadioGroupDefaultComponent } from '@zard/components/radio-group/demo/default';
import { ZardDemoSelectDefaultComponent } from '@zard/components/select/demo/default';
import { ZardDemoSliderDefaultComponent } from '@zard/components/slider/demo/default';
import { ZardDemoSwitchDefaultComponent } from '@zard/components/switch/demo/default';

import { type ChangelogExample } from '../changelog-entry.interface';

export const MAY_2025_EXAMPLES: ChangelogExample[] = [
  {
    name: 'default',
    description:
      'Dropdown select with grouped options, multi-select support, keyboard navigation, and custom item rendering.',
    component: ZardDemoSelectDefaultComponent,
    componentName: 'select',
    codeData: SELECT_DEMO_DEFAULT,
    cliAdd: SELECT_CLI_ADD,
  },
  {
    name: 'default',
    description: 'Checkbox input component with indeterminate state support and full accessibility features.',
    component: ZardDemoCheckboxDefaultComponent,
    componentName: 'checkbox',
    codeData: CHECKBOX_DEMO_DEFAULT,
    cliAdd: CHECKBOX_CLI_ADD,
  },
  {
    name: 'default',
    description: 'Radio button group for mutually exclusive options with customizable layouts and orientation.',
    component: ZardDemoRadioGroupDefaultComponent,
    componentName: 'radio-group',
    codeData: RADIO_GROUP_DEMO_DEFAULT,
    cliAdd: RADIO_GROUP_CLI_ADD,
  },
  {
    name: 'default',
    description: 'Toggle switch component for boolean settings with smooth animation transitions.',
    component: ZardDemoSwitchDefaultComponent,
    componentName: 'switch',
    codeData: SWITCH_DEMO_DEFAULT,
    cliAdd: SWITCH_CLI_ADD,
  },
  {
    name: 'default',
    description: 'Range slider for numeric value selection with min/max bounds, step support, and value display.',
    component: ZardDemoSliderDefaultComponent,
    componentName: 'slider',
    codeData: SLIDER_DEMO_DEFAULT,
    cliAdd: SLIDER_CLI_ADD,
    // The slider takes its width from its parent, so it needs the preview area
    // to stretch it; without this it renders zero pixels wide.
    fillContainer: true,
  },
];
