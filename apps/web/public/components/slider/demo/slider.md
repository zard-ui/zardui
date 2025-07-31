```angular-ts showLineNumbers
import { ZardDemoSliderVerticalComponent } from './vertical';
import { ZardDemoSliderDisabledComponent } from './disabled';
import { ZardDemoSliderMinMaxComponent } from './min-max';
import { ZardDemoSliderComponent } from './default';

export const SLIDER = {
  componentName: 'slider',
  componentType: 'slider',
  fullWidth: true,
  examples: [
    {
      name: 'default',
      component: ZardDemoSliderComponent,
    },
    {
      name: 'disabled',
      component: ZardDemoSliderDisabledComponent,
    },
    {
      name: 'min-max',
      component: ZardDemoSliderMinMaxComponent,
    },
    {
      name: 'vertical',
      component: ZardDemoSliderVerticalComponent,
    },
  ],
};

```