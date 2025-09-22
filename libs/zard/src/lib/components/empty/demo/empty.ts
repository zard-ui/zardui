import { ZardDemoEmptyDefaultComponent } from './default';
import { ZardDemoEmptyCustomImageComponent } from './custom-image';
import { ZardDemoEmptyCustomTemplateComponent } from './custom-template';
import { ZardDemoEmptyCustomStyleComponent } from './custom-style';
import { ZardDemoEmptySizeComponent } from './size';
import { ZardDemoEmptyWithOtherComponent } from './with-other-components';
import { ZardDemoEmptyWithoutDescriptionComponent } from './without-description';

export const EMPTY = {
  componentName: 'empty',
  componentPath: 'empty',
  examples: [
    {
      name: 'default',
      component: ZardDemoEmptyDefaultComponent,
    },
    {
      name: 'size',
      component: ZardDemoEmptySizeComponent,
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
      name: 'without-description',
      component: ZardDemoEmptyWithoutDescriptionComponent,
    },
    {
      name: 'with-other-components',
      component: ZardDemoEmptyWithOtherComponent,
    },
  ],
};
