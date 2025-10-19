import { ZardDemoFormValidationComponent } from './validation';
import { ZardDemoFormReactiveComponent } from './reactive';
import { ZardDemoFormDefaultComponent } from './default';
import { ZardDemoFormComplexComponent } from './complex';

export const FORM = {
  componentName: 'form',
  componentType: 'form',
  description: 'Building forms with proper structure, validation, and accessibility using composable form components.',
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
