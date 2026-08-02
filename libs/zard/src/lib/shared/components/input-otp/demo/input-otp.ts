import { INPUT_OTP_DEMO_ALPHANUMERIC } from '@generated/components/input-otp/demo/alphanumeric';
import { INPUT_OTP_DEMO_CONTROLLED } from '@generated/components/input-otp/demo/controlled';
import { INPUT_OTP_DEMO_DISABLED } from '@generated/components/input-otp/demo/disabled';
import { INPUT_OTP_DEMO_FORM } from '@generated/components/input-otp/demo/form';
import { INPUT_OTP_DEMO_FOUR_DIGITS } from '@generated/components/input-otp/demo/four-digits';
import { INPUT_OTP_DEMO_INVALID } from '@generated/components/input-otp/demo/invalid';
import { INPUT_OTP_DEMO_PATTERN } from '@generated/components/input-otp/demo/pattern';
import { INPUT_OTP_DEMO_PREVIEW } from '@generated/components/input-otp/demo/preview';
import { INPUT_OTP_DEMO_SEPARATOR } from '@generated/components/input-otp/demo/separator';
import { INPUT_OTP_SNIPPET_PATTERN_ALPHANUMERIC } from '@generated/components/input-otp/snippets';
import { INPUT_OTP_CLI_ADD } from '@generated/installation/cli/add-input-otp';
import { INPUT_OTP_MANUAL_CODE } from '@generated/installation/manual/input-otp';
import { INPUT_OTP_USAGE_CODE, INPUT_OTP_USAGE_IMPORT } from '@generated/usage/input-otp';

import { ZardDemoInputOtpAlphanumericComponent } from './alphanumeric';
import { ZardDemoInputOtpControlledComponent } from './controlled';
import { ZardDemoInputOtpDisabledComponent } from './disabled';
import { ZardDemoInputOtpFormComponent } from './form';
import { ZardDemoInputOtpFourDigitsComponent } from './four-digits';
import { ZardDemoInputOtpInvalidComponent } from './invalid';
import { ZardDemoInputOtpPatternComponent } from './pattern';
import { ZardDemoInputOtpPreviewComponent } from './preview';
import { ZardDemoInputOtpSeparatorComponent } from './separator';
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
  preview: {
    name: 'preview',
    component: ZardDemoInputOtpPreviewComponent,
    column: false,
    codeData: INPUT_OTP_DEMO_PREVIEW,
  },
  examples: [
    {
      name: 'pattern',
      description: 'Use `zPattern` to restrict the characters a slot accepts.',
      component: ZardDemoInputOtpPatternComponent,
      column: true,
      codeData: INPUT_OTP_DEMO_PATTERN,
      codeBefore: { codeData: INPUT_OTP_SNIPPET_PATTERN_ALPHANUMERIC },
    },
    {
      name: 'separator',
      description: 'Use `InputOtpSeparator` between groups to split the slots into smaller blocks.',
      component: ZardDemoInputOtpSeparatorComponent,
      column: true,
      codeData: INPUT_OTP_DEMO_SEPARATOR,
    },
    {
      name: 'controlled',
      description: 'Bind the value with `ngModel` to read and write it from the parent component.',
      component: ZardDemoInputOtpControlledComponent,
      column: true,
      codeData: INPUT_OTP_DEMO_CONTROLLED,
    },
    {
      name: 'disabled',
      description: 'Use the `disabled` binding to disable every slot at once.',
      component: ZardDemoInputOtpDisabledComponent,
      column: true,
      codeData: INPUT_OTP_DEMO_DISABLED,
    },
    {
      name: 'invalid',
      description: 'Use `zInvalid` on a slot — or on the whole `InputOtp` — to mark the value as invalid.',
      component: ZardDemoInputOtpInvalidComponent,
      column: true,
      codeData: INPUT_OTP_DEMO_INVALID,
    },
    {
      name: 'four digits',
      description: 'Use `zMaxLength` to change how many slots the input holds.',
      component: ZardDemoInputOtpFourDigitsComponent,
      column: true,
      codeData: INPUT_OTP_DEMO_FOUR_DIGITS,
    },
    {
      name: 'alphanumeric',
      description: 'Pair `REGEXP_ONLY_DIGITS_AND_CHARS` with `[zIntegerOnly]="false"` to accept letters too.',
      component: ZardDemoInputOtpAlphanumericComponent,
      column: true,
      codeData: INPUT_OTP_DEMO_ALPHANUMERIC,
    },
    {
      name: 'form',
      description: 'Use `formControlName` to bind the OTP to a reactive form.',
      component: ZardDemoInputOtpFormComponent,
      column: true,
      codeData: INPUT_OTP_DEMO_FORM,
    },
  ],
};
