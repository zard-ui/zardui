import { ZardDemoDatePickerDefaultComponent } from './default';
import { ZardDatePickerFormatsComponent } from './formats';
import { ZardDemoDatePickerSizesComponent } from './sizes';

export const DATE_PICKER = {
  componentName: 'date-picker',
  componentType: 'date-picker',
  examples: [
    {
      name: 'default',
      component: ZardDemoDatePickerDefaultComponent,
    },
    {
      name: 'sizes',
      component: ZardDemoDatePickerSizesComponent,
    },
    {
      name: 'formats',
      component: ZardDatePickerFormatsComponent,
    },
  ],
};
