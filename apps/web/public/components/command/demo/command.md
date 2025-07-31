```angular-ts showLineNumbers
import { ZardDemoCommandDefaultComponent } from './default';
import { ZardDemoCommandJsonComponent } from './json';

export const COMMAND = {
  componentName: 'command',
  componentType: 'command',
  examples: [
    {
      name: 'default',
      component: ZardDemoCommandDefaultComponent,
    },
    {
      name: 'json',
      component: ZardDemoCommandJsonComponent,
    },
  ],
};

```