```angular-ts showLineNumbers
import { ZardDemoProgressBarBasicComponent } from './basic';
import { ZardDemoProgressBarIndeterminateComponent } from './indeterminate';
import { ZardDemoProgressBarShapeComponent } from './shape';
import { ZardDemoProgressBarSizeComponent } from './size';

export const PROGRESS_BAR = {
  componentName: 'progress-bar',
  componentType: 'progress-bar',
  fullWidth: true,
  examples: [
    {
      name: 'basic',
      component: ZardDemoProgressBarBasicComponent,
    },
    {
      name: 'indeterminate',
      component: ZardDemoProgressBarIndeterminateComponent,
    },
    {
      name: 'shape',
      component: ZardDemoProgressBarShapeComponent,
    },
    {
      name: 'size',
      component: ZardDemoProgressBarSizeComponent,
    },
  ],
};

```