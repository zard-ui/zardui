import { ZardDemoEmptyWithoutDescriptionComponent } from './without-description';
import { ZardDemoEmptyWithOtherComponent } from './with-other-components';
import { ZardDemoEmptyCustomTemplateComponent } from './custom-template';
import { ZardDemoEmptyCustomStyleComponent } from './custom-style';
import { ZardDemoEmptyCustomImageComponent } from './custom-image';
import { ZardDemoEmptyDefaultComponent } from './default';
import { ZardDemoEmptySizeComponent } from './size';

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
