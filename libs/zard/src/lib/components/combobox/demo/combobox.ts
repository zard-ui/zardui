import { ZardDemoComboboxDefaultComponent } from './default';
import { ZardDemoComboboxDisabledComponent } from './disabled';
import { ZardDemoComboboxFormComponent } from './form';
import { ZardDemoComboboxGroupedComponent } from './grouped';

export const COMBOBOX = {
  componentName: 'combobox',
  componentType: 'combobox',
  examples: [
    {
      name: 'default',
      component: ZardDemoComboboxDefaultComponent,
    },
    {
      name: 'grouped',
      component: ZardDemoComboboxGroupedComponent,
    },
    {
      name: 'disabled',
      component: ZardDemoComboboxDisabledComponent,
    },
    {
      name: 'form',
      component: ZardDemoComboboxFormComponent,
    },
  ],
};
