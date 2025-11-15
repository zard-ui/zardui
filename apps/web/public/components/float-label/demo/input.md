```angular-ts showLineNumbers copyButton
import { ZardDemoFloatLabelTextareaComponent } from './text-area';
import { ZardDemoFloatLabelDefaultComponent } from './default';
import { ZardDemoFloatLabelStatusComponent } from './status';
import { ZardDemoFloatLabelSelectComponent } from './select';


export const FLOAT_LABEL = {
  componentName: 'float-label',
  componentType: 'wrapper',
  description: 'A wrapper that animates a label to float above an input when focused or filled.',
  examples: [
    {
      name: 'default',
      component: ZardDemoFloatLabelDefaultComponent,
      column: true,
    },
    {
      name: 'textarea',
      component: ZardDemoFloatLabelTextareaComponent,
      column: true,
    },
    {
      name: 'select',
      component: ZardDemoFloatLabelSelectComponent,
      column: true,
    },
    {
      name: 'status',
      component: ZardDemoFloatLabelStatusComponent,
      column: true,
    },
  ],
};
```