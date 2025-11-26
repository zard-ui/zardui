import { ZardDemoLoaderDefaultComponent } from './default';
import { ZardDemoLoaderSizeComponent } from './size';

export const LOADER = {
  componentName: 'loader',
  componentType: 'loader',
  description:
    'The Loader is a visual component that displays a loading animation to indicate that an action or process is in progress.',
  examples: [
    {
      name: 'default',
      component: ZardDemoLoaderDefaultComponent,
    },
    {
      name: 'size',
      component: ZardDemoLoaderSizeComponent,
    },
  ],
};
