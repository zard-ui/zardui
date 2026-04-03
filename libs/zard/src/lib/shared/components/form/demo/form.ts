import { FORM_DEMO_COMPLEX } from '@generated/components/form/demo/complex';
import { FORM_DEMO_DEFAULT } from '@generated/components/form/demo/default';
import { FORM_DEMO_REACTIVE } from '@generated/components/form/demo/reactive';
import { FORM_DEMO_SIGNAL_FORM } from '@generated/components/form/demo/signal-form';
import { FORM_DEMO_VALIDATION } from '@generated/components/form/demo/validation';
import { FORM_CLI_ADD } from '@generated/installation/cli/add-form';
import { FORM_MANUAL_CODE } from '@generated/installation/manual/form';

import { ZardDemoFormComplexComponent } from '@/shared/components/form/demo/complex';
import { ZardDemoFormDefaultComponent } from '@/shared/components/form/demo/default';
import { ZardDemoFormReactiveComponent } from '@/shared/components/form/demo/reactive';
import { ZardDemoFormSignalComponent } from '@/shared/components/form/demo/signal-form';
import { ZardDemoFormValidationComponent } from '@/shared/components/form/demo/validation';

import { FORM_API } from '../doc/api';

export const FORM = {
  componentName: 'form',
  componentType: 'form',
  description: 'Building forms with proper structure, validation, and accessibility using composable form components.',
  api: FORM_API,
  installData: {
    cliAdd: FORM_CLI_ADD,
    manualCode: FORM_MANUAL_CODE,
  },
  examples: [
    {
      name: 'default',
      component: ZardDemoFormDefaultComponent,
      codeData: FORM_DEMO_DEFAULT,
    },
    {
      name: 'reactive',
      component: ZardDemoFormReactiveComponent,
      codeData: FORM_DEMO_REACTIVE,
    },
    {
      name: 'signal-form',
      component: ZardDemoFormSignalComponent,
      codeData: FORM_DEMO_SIGNAL_FORM,
    },
    {
      name: 'validation',
      component: ZardDemoFormValidationComponent,
      codeData: FORM_DEMO_VALIDATION,
    },
    {
      name: 'complex',
      component: ZardDemoFormComplexComponent,
      codeData: FORM_DEMO_COMPLEX,
    },
  ],
};
