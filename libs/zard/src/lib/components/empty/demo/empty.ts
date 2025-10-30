import { ZardDemoEmptyAdvancedComponent } from './advanced';
import { ZardDemoEmptyCustomImageComponent } from './custom-image';
import { ZardDemoEmptyDefaultComponent } from './default';

export const EMPTY = {
  componentName: 'empty',
  componentPath: 'empty',
  description: 'Use the Empty component to display a empty state.',
  examples: [
    {
      name: 'default',
      component: ZardDemoEmptyDefaultComponent,
    },
    {
      name: 'custom-image',
      component: ZardDemoEmptyCustomImageComponent,
    },
    {
      name: 'advanced',
      component: ZardDemoEmptyAdvancedComponent,
    },
  ],
};
