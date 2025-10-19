import { ZardDemoComboboxDisabledComponent } from './disabled';
import { ZardDemoComboboxGroupedComponent } from './grouped';
import { ZardDemoComboboxDefaultComponent } from './default';
import { ZardDemoComboboxFormComponent } from './form';

export const COMBOBOX = {
  componentName: 'combobox',
  componentType: 'combobox',
  description: 'Autocomplete input and command palette with a list of suggestions.',
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
