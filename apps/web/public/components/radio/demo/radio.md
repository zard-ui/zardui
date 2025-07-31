```angular-ts showLineNumbers
import { ZardDemoRadioDestructiveComponent } from './destructive';
import { ZardDemoRadioSecondaryComponent } from './secondary';
import { ZardDemoRadioDisabledComponent } from './disabled';
import { ZardDemoRadioDefaultComponent } from './default';
import { ZardDemoRadioSizeComponent } from './size';

export const RADIO = {
  componentName: 'radio',
  componentType: 'radio',
  examples: [
    {
      name: 'default',
      component: ZardDemoRadioDefaultComponent,
    },
    {
      name: 'secondary',
      component: ZardDemoRadioSecondaryComponent,
    },
    {
      name: 'destructive',
      component: ZardDemoRadioDestructiveComponent,
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

```