import { ZardDemoSegmentedDefaultComponent } from './default';
import { ZardDemoSegmentedDisabledComponent } from './disabled';
import { ZardDemoSegmentedSizesComponent } from './sizes';

export const SEGMENTED = {
  componentName: 'segmented',
  componentType: 'segmented',
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
