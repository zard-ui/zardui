import { INPUT_OTP_DEMO_PREVIEW } from '@generated/components/input-otp/demo/preview';
import { INPUT_OTP_CLI_ADD } from '@generated/installation/cli/add-input-otp';

import { ZardDemoInputOtpPreviewComponent } from '@zard/components/input-otp/demo/preview';

import { type ChangelogExample } from '../changelog-entry.interface';

export const AUGUST_2026_EXAMPLES: ChangelogExample[] = [
  {
    name: 'preview',
    description: 'Accessible one-time password input with grouped slots, custom separators, and copy-paste support.',
    component: ZardDemoInputOtpPreviewComponent,
    componentName: 'input-otp',
    codeData: INPUT_OTP_DEMO_PREVIEW,
    cliAdd: INPUT_OTP_CLI_ADD,
  },
];
