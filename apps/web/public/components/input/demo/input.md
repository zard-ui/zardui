```angular-ts showLineNumbers
import { ZardDemoInputBorderlessComponent } from './borderless';
import { ZardDemoInputTextAreaComponent } from './text-area';
import { ZardDemoInputDefaultComponent } from './default';
import { ZardDemoInputStatusComponent } from './status';
import { ZardDemoInputSizeComponent } from './size';

export const INPUT = {
  componentName: 'input',
  componentType: 'input',
  examples: [
    {
      name: 'default',
      component: ZardDemoInputDefaultComponent,
      column: true,
    },
    {
      name: 'size',
      component: ZardDemoInputSizeComponent,
      column: true,
    },
    {
      name: 'status',
      component: ZardDemoInputStatusComponent,
      column: true,
    },
    {
      name: 'borderless',
      component: ZardDemoInputBorderlessComponent,
    },
    {
      name: 'text-area',
      component: ZardDemoInputTextAreaComponent,
      column: true,
    },
  ],
};

```