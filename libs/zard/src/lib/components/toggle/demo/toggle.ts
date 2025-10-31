import { ZardDemoToggleDefaultComponent } from './default';
import { ZardDemoToggleDisabledComponent } from './disabled';
import { ZardDemoToggleLargeComponent } from './large';
import { ZardDemoToggleOutlineComponent } from './outline';
import { ZardDemoToggleSmallComponent } from './small';
import { ZardDemoToggleWithDefaultComponent } from './with-default';
import { ZardDemoToggleWithFormsComponent } from './with-forms';
import { ZardDemoToggleWithTextComponent } from './with-text';

export const TOGGLE = {
  componentName: 'toggle',
  componentType: 'toggle',
  description: 'A two-state button that can be either on or off.',
  examples: [
    {
      name: 'default',
      component: ZardDemoToggleDefaultComponent,
    },
    {
      name: 'with-forms',
      component: ZardDemoToggleWithFormsComponent,
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
