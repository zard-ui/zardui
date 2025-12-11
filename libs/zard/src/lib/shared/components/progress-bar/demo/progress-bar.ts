import { ZardDemoProgressBarBasicComponent } from './basic';
import { ZardDemoProgressBarIndeterminateComponent } from './indeterminate';
import { ZardDemoProgressBarShapeComponent } from './shape';
import { ZardDemoProgressBarSizeComponent } from './size';

export const PROGRESS_BAR = {
  componentName: 'progress-bar',
  componentType: 'progress-bar',
  description:
    'Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.',
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
