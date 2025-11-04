/* eslint-disable prettier/prettier */
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
      name: 'Orientation',
      component: ZardDemoButtonGroupOrientationComponent,
    },
    {
      name: 'Size',
      component: ZardDemoButtonGroupSizeComponent,
    },
    {
      name: 'Nested',
      component: ZardDemoButtonGroupNestedComponent,
    },
    {
      name: 'Divider',
      component: ZardDemoButtonGroupDividerComponent,
    },
    {
      name: 'Input',
      component: ZardDemoButtonGroupInputComponent,
    },
    {
      name: 'Select',
      component: ZardDemoButtonGroupSelectComponent,
    },
  ],
};
