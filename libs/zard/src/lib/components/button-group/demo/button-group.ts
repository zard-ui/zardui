import { ZardDemoButtonGroupDefaultComponent } from './default';
import { ZardDemoButtonGroupDividerComponent } from './divider';
import { ZardDemoButtonGroupInputComponent } from './input';
import { ZardDemoButtonGroupNestedComponent } from './nested';
import { ZardDemoButtonGroupOrientationComponent } from './orientation';
import { ZardDemoButtonGroupSelectComponent } from './select';
import { ZardDemoButtonGroupSizeComponent } from './size';

export const BUTTON_GROUP = {
  componentName: 'button-group',
  componentType: 'button-group',
  description: 'A container that groups related buttons together with consistent styling.',
  examples: [
    {
      name: 'default',
      component: ZardDemoButtonGroupDefaultComponent,
    },
    {
      name: 'orientation',
      component: ZardDemoButtonGroupOrientationComponent,
    },
    {
      name: 'size',
      component: ZardDemoButtonGroupSizeComponent,
    },
    {
      name: 'nested',
      component: ZardDemoButtonGroupNestedComponent,
    },
    {
      name: 'divider',
      component: ZardDemoButtonGroupDividerComponent,
    },
    {
      name: 'input',
      component: ZardDemoButtonGroupInputComponent,
    },
    {
      name: 'select',
      component: ZardDemoButtonGroupSelectComponent,
    },
  ],
};
