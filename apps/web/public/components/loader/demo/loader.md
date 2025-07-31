```angular-ts showLineNumbers
import { ZardDemoLoaderDefaultComponent } from './default';
import { ZardDemoLoaderSizeComponent } from './size';

export const LOADER = {
  componentName: 'loader',
  componentType: 'loader',
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

```