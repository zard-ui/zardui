import { ZardDemoFormComplexComponent } from './complex';
import { ZardDemoFormDefaultComponent } from './default';
import { ZardDemoFormReactiveComponent } from './reactive';
import { ZardDemoFormValidationComponent } from './validation';

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
