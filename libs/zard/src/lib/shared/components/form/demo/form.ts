import { ZardDemoFormComplexComponent } from '@/shared/components/form/demo/complex';
import { ZardDemoFormDefaultComponent } from '@/shared/components/form/demo/default';
import { ZardDemoFormReactiveComponent } from '@/shared/components/form/demo/reactive';
import { ZardDemoFormSignalComponent } from '@/shared/components/form/demo/signal-form';
import { ZardDemoFormValidationComponent } from '@/shared/components/form/demo/validation';

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
      name: 'signal-form',
      component: ZardDemoFormSignalComponent,
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
