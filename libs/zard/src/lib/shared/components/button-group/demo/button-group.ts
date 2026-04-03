import { BUTTON_GROUP_DEMO_DEFAULT } from '@generated/components/button-group/demo/default';
import { BUTTON_GROUP_DEMO_DIVIDER } from '@generated/components/button-group/demo/divider';
import { BUTTON_GROUP_DEMO_INPUT } from '@generated/components/button-group/demo/input';
import { BUTTON_GROUP_DEMO_NESTED } from '@generated/components/button-group/demo/nested';
import { BUTTON_GROUP_DEMO_ORIENTATION } from '@generated/components/button-group/demo/orientation';
import { BUTTON_GROUP_DEMO_SELECT } from '@generated/components/button-group/demo/select';
import { BUTTON_GROUP_DEMO_SIZE } from '@generated/components/button-group/demo/size';
import { BUTTON_GROUP_CLI_ADD } from '@generated/installation/cli/add-button-group';
import { BUTTON_GROUP_MANUAL_CODE } from '@generated/installation/manual/button-group';

import { ZardDemoButtonGroupDefaultComponent } from './default';
import { ZardDemoButtonGroupDividerComponent } from './divider';
import { ZardDemoButtonGroupInputComponent } from './input';
import { ZardDemoButtonGroupNestedComponent } from './nested';
import { ZardDemoButtonGroupOrientationComponent } from './orientation';
import { ZardDemoButtonGroupSelectComponent } from './select';
import { ZardDemoButtonGroupSizeComponent } from './size';
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
  examples: [
    {
      name: 'default',
      component: ZardDemoButtonGroupDefaultComponent,
      codeData: BUTTON_GROUP_DEMO_DEFAULT,
    },
    {
      name: 'orientation',
      component: ZardDemoButtonGroupOrientationComponent,
      codeData: BUTTON_GROUP_DEMO_ORIENTATION,
    },
    {
      name: 'size',
      component: ZardDemoButtonGroupSizeComponent,
      codeData: BUTTON_GROUP_DEMO_SIZE,
    },
    {
      name: 'nested',
      component: ZardDemoButtonGroupNestedComponent,
      codeData: BUTTON_GROUP_DEMO_NESTED,
    },
    {
      name: 'divider',
      component: ZardDemoButtonGroupDividerComponent,
      codeData: BUTTON_GROUP_DEMO_DIVIDER,
    },
    {
      name: 'input',
      component: ZardDemoButtonGroupInputComponent,
      codeData: BUTTON_GROUP_DEMO_INPUT,
    },
    {
      name: 'select',
      component: ZardDemoButtonGroupSelectComponent,
      codeData: BUTTON_GROUP_DEMO_SELECT,
    },
  ],
};
