```angular-ts showLineNumbers
import { ZardDemoCheckboxDestructiveComponent } from './destructive';
import { ZardDemoCheckboxDisabledComponent } from './disabled';
import { ZardDemoCheckboxDefaultComponent } from './default';
import { ZardDemoCheckboxShapeComponent } from './shape';
import { ZardDemoCheckboxSizeComponent } from './size';

export const CHECKBOX = {
  componentName: 'checkbox',
  componentType: 'checkbox',
  examples: [
    {
      name: 'default',
      component: ZardDemoCheckboxDefaultComponent,
    },
    {
      name: 'destructive',
      component: ZardDemoCheckboxDestructiveComponent,
    },
    {
      name: 'size',
      component: ZardDemoCheckboxSizeComponent,
    },
    {
      name: 'shape',
      component: ZardDemoCheckboxShapeComponent,
    },
    {
      name: 'disabled',
      component: ZardDemoCheckboxDisabledComponent,
    },
  ],
};

```