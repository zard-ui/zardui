import { BUTTON_GROUP_DEMO_DEFAULT } from '@generated/components/button-group/demo/default';
import { BUTTON_GROUP_DEMO_DIVIDER } from '@generated/components/button-group/demo/divider';
import { BUTTON_GROUP_DEMO_DROPDOWN } from '@generated/components/button-group/demo/dropdown';
import { BUTTON_GROUP_DEMO_INPUT } from '@generated/components/button-group/demo/input';
import { BUTTON_GROUP_DEMO_INPUT_GROUP } from '@generated/components/button-group/demo/input-group';
import { BUTTON_GROUP_DEMO_NESTED } from '@generated/components/button-group/demo/nested';
import { BUTTON_GROUP_DEMO_ORIENTATION } from '@generated/components/button-group/demo/orientation';
import { BUTTON_GROUP_DEMO_POPOVER } from '@generated/components/button-group/demo/popover';
import { BUTTON_GROUP_DEMO_SELECT } from '@generated/components/button-group/demo/select';
import { BUTTON_GROUP_DEMO_SIZE } from '@generated/components/button-group/demo/size';
import { BUTTON_GROUP_DEMO_SPLIT } from '@generated/components/button-group/demo/split';
import { BUTTON_GROUP_CLI_ADD } from '@generated/installation/cli/add-button-group';
import { BUTTON_GROUP_MANUAL_CODE } from '@generated/installation/manual/button-group';
import { BUTTON_GROUP_USAGE_IMPORT, BUTTON_GROUP_USAGE_CODE } from '@generated/usage/button-group';

import { ZardDemoButtonGroupDefaultComponent } from './default';
import { ZardDemoButtonGroupDividerComponent } from './divider';
import { ZardDemoButtonGroupDropdownComponent } from './dropdown';
import { ZardDemoButtonGroupInputComponent } from './input';
import { ZardDemoButtonGroupInputGroupComponent } from './input-group';
import { ZardDemoButtonGroupNestedComponent } from './nested';
import { ZardDemoButtonGroupOrientationComponent } from './orientation';
import { ZardDemoButtonGroupPopoverComponent } from './popover';
import { ZardDemoButtonGroupSelectComponent } from './select';
import { ZardDemoButtonGroupSizeComponent } from './size';
import { ZardDemoButtonGroupSplitComponent } from './split';
import { BUTTON_GROUP_API } from '../doc/api';

export const BUTTON_GROUP = {
  api: BUTTON_GROUP_API,
  componentName: 'button-group',
  componentType: 'button-group',
  description: 'A container that groups related buttons together with consistent styling.',
  installData: {
    cliAdd: BUTTON_GROUP_CLI_ADD,
    manualCode: BUTTON_GROUP_MANUAL_CODE,
  },
  usage: { importBlock: BUTTON_GROUP_USAGE_IMPORT, codeBlock: BUTTON_GROUP_USAGE_CODE },
  preview: {
    name: 'preview',
    component: ZardDemoButtonGroupDefaultComponent,
    column: false,
    codeData: BUTTON_GROUP_DEMO_DEFAULT,
  },
  examples: [
    {
      name: 'orientation',
      description: 'Set the `zOrientation` prop to change the button group layout.',
      component: ZardDemoButtonGroupOrientationComponent,
      codeData: BUTTON_GROUP_DEMO_ORIENTATION,
    },
    {
      name: 'size',
      description: 'Control the size of buttons using the `zSize` prop on individual buttons.',
      component: ZardDemoButtonGroupSizeComponent,
      codeData: BUTTON_GROUP_DEMO_SIZE,
    },
    {
      name: 'nested',
      description: 'Nest `z-button-group` components to create button groups with spacing.',
      component: ZardDemoButtonGroupNestedComponent,
      codeData: BUTTON_GROUP_DEMO_NESTED,
    },
    {
      name: 'separator',
      description:
        'The `z-button-group-divider` component visually divides buttons within a group. Buttons with `zType="outline"` do not need a separator since they have a border.',
      component: ZardDemoButtonGroupDividerComponent,
      codeData: BUTTON_GROUP_DEMO_DIVIDER,
    },
    {
      name: 'split',
      description: 'Create a split button group by adding two buttons separated by a `z-button-group-divider`.',
      component: ZardDemoButtonGroupSplitComponent,
      codeData: BUTTON_GROUP_DEMO_SPLIT,
    },
    {
      name: 'input',
      description: 'Wrap an `Input` component with buttons.',
      component: ZardDemoButtonGroupInputComponent,
      codeData: BUTTON_GROUP_DEMO_INPUT,
    },
    {
      name: 'input-group',
      description: 'Wrap an `InputGroup` component to create complex input layouts.',
      component: ZardDemoButtonGroupInputGroupComponent,
      codeData: BUTTON_GROUP_DEMO_INPUT_GROUP,
    },
    {
      name: 'dropdown',
      description: 'Create a split button group with a `Dropdown` component.',
      component: ZardDemoButtonGroupDropdownComponent,
      codeData: BUTTON_GROUP_DEMO_DROPDOWN,
    },
    {
      name: 'select',
      description: 'Pair with a `Select` component.',
      component: ZardDemoButtonGroupSelectComponent,
      codeData: BUTTON_GROUP_DEMO_SELECT,
    },
    {
      name: 'popover',
      description: 'Use with a `Popover` component.',
      component: ZardDemoButtonGroupPopoverComponent,
      codeData: BUTTON_GROUP_DEMO_POPOVER,
    },
  ],
};
