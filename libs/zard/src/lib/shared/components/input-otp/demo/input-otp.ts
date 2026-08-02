import { INPUT_OTP_DEMO_CONTROLLED } from '@generated/components/input-otp/demo/controlled';
import { INPUT_OTP_DEMO_DEFAULT } from '@generated/components/input-otp/demo/default';
import { INPUT_OTP_DEMO_FORM } from '@generated/components/input-otp/demo/form';
import { INPUT_OTP_DEMO_PATTERN } from '@generated/components/input-otp/demo/pattern';
import { INPUT_OTP_DEMO_SEPARATOR } from '@generated/components/input-otp/demo/separator';
import { INPUT_OTP_DEMO_SIGNAL } from '@generated/components/input-otp/demo/signal';
import { INPUT_OTP_CLI_ADD } from '@generated/installation/cli/add-input-otp';
import { INPUT_OTP_MANUAL_CODE } from '@generated/installation/manual/input-otp';
import { INPUT_OTP_USAGE_CODE, INPUT_OTP_USAGE_IMPORT } from '@generated/usage/input-otp';

import { ZardDemoInputOtpControlledComponent } from './controlled';
import { ZardDemoInputOtpDefaultComponent } from './default';
import { ZardDemoInputOtpFormComponent } from './form';
import { ZardDemoInputOtpPatternComponent } from './pattern';
import { ZardDemoInputOtpSeparatorComponent } from './separator';
import { ZardDemoInputOtpSignalComponent } from './signal';
import { INPUT_OTP_API } from '../doc/api';

export const INPUT_OTP = {
  componentName: 'input-otp',
  componentType: 'input-otp',
  description: 'Accessible one-time password component with copy-paste functionality.',
  api: INPUT_OTP_API,
  installData: {
    cliAdd: INPUT_OTP_CLI_ADD,
    manualCode: INPUT_OTP_MANUAL_CODE,
  },
  usage: { importBlock: INPUT_OTP_USAGE_IMPORT, codeBlock: INPUT_OTP_USAGE_CODE },
  examples: [
    {
      name: 'default',
      description: 'Six slots split into two groups by a separator.',
      component: ZardDemoInputOtpDefaultComponent,
      column: true,
      codeData: INPUT_OTP_DEMO_DEFAULT,
    },
    {
      name: 'separator',
      description: 'Use `InputOtpSeparator` between every `InputOtpGroup` to split the slots into smaller blocks.',
      component: ZardDemoInputOtpSeparatorComponent,
      column: true,
      codeData: INPUT_OTP_DEMO_SEPARATOR,
    },
    {
      name: 'controlled',
      description:
        'Bind the value with `ngModel` and listen to `(zComplete)` to react as soon as every slot is filled.',
      component: ZardDemoInputOtpControlledComponent,
      column: true,
      codeData: INPUT_OTP_DEMO_CONTROLLED,
    },
    {
      name: 'pattern',
      description:
        'Use `zPattern` to restrict the accepted characters. Set `[zIntegerOnly]="false"` when letters are allowed.',
      component: ZardDemoInputOtpPatternComponent,
      column: true,
      codeData: INPUT_OTP_DEMO_PATTERN,
    },
    {
      name: 'form',
      description: 'Use `formControlName` to bind the OTP to a reactive form.',
      component: ZardDemoInputOtpFormComponent,
      column: true,
      codeData: INPUT_OTP_DEMO_FORM,
    },
    {
      name: 'signal',
      description:
        'Use `InputOtpSignal` with `[formField]` to bind the OTP to a signal form from `@angular/forms/signals`.',
      component: ZardDemoInputOtpSignalComponent,
      column: true,
      codeData: INPUT_OTP_DEMO_SIGNAL,
    },
  ],
};
