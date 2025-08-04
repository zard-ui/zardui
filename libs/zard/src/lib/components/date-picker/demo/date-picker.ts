import { ZardDemoDatePickerDefaultComponent } from './default';
import { ZardDemoDatePickerSizesComponent } from './sizes';
import { ZardDemoDatePickerVariantsComponent } from './variants';
import { ZardDemoDatePickerWithConstraintsComponent } from './with-constraints';

export const DATE_PICKER = {
  componentName: 'date-picker',
  componentType: 'date-picker',
  examples: [
    {
      name: 'default',
      component: ZardDemoDatePickerDefaultComponent,
    },
    {
      name: 'variants',
      component: ZardDemoDatePickerVariantsComponent,
    },
    {
      name: 'sizes',
      component: ZardDemoDatePickerSizesComponent,
    },
    {
      name: 'with-constraints',
      component: ZardDemoDatePickerWithConstraintsComponent,
    },
  ],
};
