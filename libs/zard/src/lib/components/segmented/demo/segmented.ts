import { ZardDemoSegmentedDefaultComponent } from './default';
import { ZardDemoSegmentedDisabledComponent } from './disabled';
import { ZardDemoSegmentedSizesComponent } from './sizes';

export const SEGMENTED = {
  componentName: 'segmented',
  componentType: 'segmented',
  description:
    'A set of two or more segments, each of which functions as a mutually exclusive button. Based on shadcn/ui Tabs component pattern, providing a clean way to create toggle controls with single selection.',
  examples: [
    {
      name: 'default',
      component: ZardDemoSegmentedDefaultComponent,
    },
    {
      name: 'sizes',
      component: ZardDemoSegmentedSizesComponent,
    },
    {
      name: 'disabled',
      component: ZardDemoSegmentedDisabledComponent,
    },
  ],
};
