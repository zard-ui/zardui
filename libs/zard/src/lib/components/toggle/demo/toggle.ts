import { ZardDemoToggleWithDefaultComponent } from './with-default';
import { ZardDemoToggleWithFormComponent } from './with-forms';
import { ZardDemoToggleWithTextComponent } from './with-text';
import { ZardDemoToggleDisabledComponent } from './disabled';
import { ZardDemoToggleOutlineComponent } from './outline';
import { ZardDemoToggleSmallComponent } from './small';
import { ZardDemoToggleLargeComponent } from './large';
import { ZardDemoToggleComponent } from './default';

export const TOGGLE = {
  componentName: 'toggle',
  componentType: 'toggle',
  examples: [
    {
      name: 'default',
      component: ZardDemoToggleComponent,
    },
    {
      name: 'with-forms',
      component: ZardDemoToggleWithFormComponent,
    },
    {
      name: 'with-default',
      component: ZardDemoToggleWithDefaultComponent,
    },
    {
      name: 'outline',
      component: ZardDemoToggleOutlineComponent,
    },
    {
      name: 'with-text',
      component: ZardDemoToggleWithTextComponent,
    },
    {
      name: 'small',
      component: ZardDemoToggleSmallComponent,
    },
    {
      name: 'large',
      component: ZardDemoToggleLargeComponent,
    },
    {
      name: 'disabled',
      component: ZardDemoToggleDisabledComponent,
    },
  ],
};
