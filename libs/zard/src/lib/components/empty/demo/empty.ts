import { ZardDemoEmptyDefaultComponent } from './default';
import { ZardDemoEmptyCustomImageComponent } from './custom-image';
import { ZardDemoEmptyCustomTemplateComponent } from './custom-template';
import { ZardDemoEmptyCustomStyleComponent } from './custom-style';
import { ZardDemoEmptySizeComponent } from './size';

export const EMPTY = {
  componentName: 'empty',
  componentPath: 'empty',
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
      name: 'custom-template',
      component: ZardDemoEmptyCustomTemplateComponent,
    },
    {
      name: 'custom-style',
      component: ZardDemoEmptyCustomStyleComponent,
    },
    {
      name: 'size',
      component: ZardDemoEmptySizeComponent,
    },
  ],
};
