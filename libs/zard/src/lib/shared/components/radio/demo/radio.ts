import { ZardDemoRadioDefaultComponent } from './default';
import { ZardDemoRadioDisabledComponent } from './disabled';

export const RADIO = {
  componentName: 'radio',
  componentType: 'radio',
  description: 'A control that allows the user to select one option from a set of options.',
  examples: [
    {
      name: 'default',
      component: ZardDemoRadioDefaultComponent,
    },
    {
      name: 'disabled',
      component: ZardDemoRadioDisabledComponent,
    },
  ],
};
