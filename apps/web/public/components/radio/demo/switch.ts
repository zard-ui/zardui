import { ZardDemoRadioBasicComponent } from './basic';
import { ZardDemoRadioDisabledComponent } from './disabled';
import { ZardDemoRadioSizeComponent } from './size';

export const RADIO = {
  componentName: 'radio',
  componentType: 'radio',
  examples: [
    {
      name: 'basic',
      component: ZardDemoRadioBasicComponent,
    },
    {
      name: 'size',
      component: ZardDemoRadioSizeComponent,
    },
    {
      name: 'disabled',
      component: ZardDemoRadioDisabledComponent,
    },
  ],
};
