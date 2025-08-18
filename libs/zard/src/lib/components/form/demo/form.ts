import { ZardDemoFormDefaultComponent } from './default';
import { ZardDemoFormReactiveComponent } from './reactive';
import { ZardDemoFormValidationComponent } from './validation';
import { ZardDemoFormComplexComponent } from './complex';

export const FORM = {
  componentName: 'form',
  componentType: 'form',
  examples: [
    {
      name: 'default',
      component: ZardDemoFormDefaultComponent,
    },
    {
      name: 'reactive',
      component: ZardDemoFormReactiveComponent,
    },
    {
      name: 'validation',
      component: ZardDemoFormValidationComponent,
    },
    {
      name: 'complex',
      component: ZardDemoFormComplexComponent,
    },
  ],
};
