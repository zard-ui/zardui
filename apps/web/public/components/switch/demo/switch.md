```angular-ts showLineNumbers
import { ZardDemoSwitchDestructiveComponent } from './destructive';
import { ZardDemoSwitchDisabledComponent } from './disabled';
import { ZardDemoSwitchDefaultComponent } from './default';
import { ZardDemoSwitchSizeComponent } from './size';

export const SWITCH = {
  componentName: 'switch',
  componentType: 'switch',
  examples: [
    {
      name: 'default',
      component: ZardDemoSwitchDefaultComponent,
    },
    {
      name: 'destructive',
      component: ZardDemoSwitchDestructiveComponent,
    },
    {
      name: 'size',
      component: ZardDemoSwitchSizeComponent,
    },
    {
      name: 'disabled',
      component: ZardDemoSwitchDisabledComponent,
    },
  ],
};

```