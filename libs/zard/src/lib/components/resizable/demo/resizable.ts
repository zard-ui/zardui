import { ZardDemoResizableDefaultComponent } from './default';
import { ZardDemoResizableVerticalComponent } from './vertical';
import { ZardDemoResizableWithMinMaxComponent } from './with-min-max';

export const RESIZABLE = {
  componentName: 'resizable',
  componentType: 'resizable',
  description: 'A resizable layout component that allows users to resize panels by dragging dividers between them.',
  fullWidth: true,
  examples: [
    {
      name: 'default',
      component: ZardDemoResizableDefaultComponent,
    },
    {
      name: 'vertical',
      component: ZardDemoResizableVerticalComponent,
    },
    {
      name: 'with-min-max',
      component: ZardDemoResizableWithMinMaxComponent,
    },
  ],
};
