import { ZardDemoDatePickerDefaultComponent } from './default';
import { ZardDemoDatePickerSizesComponent } from './sizes';
import { ZardDatePickerFormatsComponent } from './formats';

export const DATE_PICKER = {
  componentName: 'date-picker',
  componentType: 'date-picker',
  description: 'A date picker component with range and presets.',
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
