import { ZardDemoDividerVerticalComponent } from './vertical';
import { ZardDemoDividerDefaultComponent } from './default';

export const DIVIDER = {
  componentName: 'divider',
  componentType: 'divider',
  description: 'The Divider component is used to visually separate content with a horizontal or vertical line.',
  examples: [
    {
      name: 'default',
      component: ZardDemoDividerDefaultComponent,
    },
    {
      name: 'vertical',
      component: ZardDemoDividerVerticalComponent,
    },
  ],
};
