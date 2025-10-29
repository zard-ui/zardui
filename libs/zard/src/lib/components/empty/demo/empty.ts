import { ZardDemoEmptyActionsComponent } from './actions';
import { ZardDemoEmptyAdvancedCustomizationComponent } from './advanced-customization';
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
      name: 'actions',
      component: ZardDemoEmptyActionsComponent,
    },
    {
      name: 'advanced-customization',
      component: ZardDemoEmptyAdvancedCustomizationComponent,
    },
    {
      name: 'custom-image',
      component: ZardDemoEmptyCustomImageComponent,
    },
  ],
};
