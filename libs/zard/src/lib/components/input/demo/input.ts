import { ZardDemoInputBorderlessComponent } from './borderless';
import { ZardDemoInputDefaultComponent } from './default';
import { ZardDemoInputSizeComponent } from './size';
import { ZardDemoInputStatusComponent } from './status';
import { ZardDemoInputTextAreaComponent } from './text-area';

export const INPUT = {
  componentName: 'input',
  componentType: 'input',
  description: 'Displays a form input field or a component that looks like an input field.',
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
