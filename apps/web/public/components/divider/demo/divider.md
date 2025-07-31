```angular-ts showLineNumbers
import { ZardDemoDividerVerticalComponent } from './vertical';
import { ZardDemoDividerDefaultComponent } from './default';

export const DIVIDER = {
  componentName: 'divider',
  componentType: 'divider',
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

```