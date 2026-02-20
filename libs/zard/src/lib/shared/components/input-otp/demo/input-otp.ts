import { ZardDemoInputOtpControlledComponent } from '@/shared/components/input-otp/demo/controlled';
import { ZardDemoInputOtpDefaultComponent } from '@/shared/components/input-otp/demo/default';
import { ZardDemoInputOtpFormComponent } from '@/shared/components/input-otp/demo/form';
import { ZardDemoInputOtpPatternComponent } from '@/shared/components/input-otp/demo/pattern';
import { ZardDemoInputOtpSeparatorComponent } from '@/shared/components/input-otp/demo/separator';

export const INPUT_OTP = {
  componentName: 'input-otp',
  componentType: 'input-otp',
  description:
    'An OTP Input component for entering one-time passwords, verification codes, or short numeric/alphanumeric PINs.',
  examples: [
    {
      name: 'default',
      component: ZardDemoInputOtpDefaultComponent,
      column: true,
    },
    {
      name: 'controlled',
      component: ZardDemoInputOtpControlledComponent,
      column: true,
    },

    {
      name: 'form',
      component: ZardDemoInputOtpFormComponent,
      column: true,
    },
    {
      name: 'pattern',
      component: ZardDemoInputOtpPatternComponent,
      column: true,
    },
    {
      name: 'separator',
      component: ZardDemoInputOtpSeparatorComponent,
      column: true,
    },
  ],
};
