import { ZardDemoSliderDefaultComponent } from './default';
import { ZardDemoSliderDisabledComponent } from './disabled';
import { ZardDemoSliderMinMaxComponent } from './min-max';
import { ZardDemoSliderVerticalComponent } from './vertical';

export const SLIDER = {
  componentName: 'slider',
  componentType: 'slider',
  description: 'An input where the user selects a value from within a given range.',
  fullWidth: true,
  examples: [
    {
      name: 'default',
      component: ZardDemoSliderDefaultComponent,
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
