import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardInputOtpImports } from '@/shared/components/input-otp/input-otp.imports';
import { REGEXP_ONLY_DIGITS } from '@/shared/components/input-otp/input-otp.utils';

@Component({
  selector: 'z-demo-input-otp-four-digits',
  imports: [ZardInputOtpImports],
  template: `
    <z-input-otp [zMaxLength]="4" [zPattern]="REGEXP_ONLY_DIGITS">
      <z-input-otp-group>
        <z-input-otp-slot [zIndex]="0" />
        <z-input-otp-slot [zIndex]="1" />
        <z-input-otp-slot [zIndex]="2" />
        <z-input-otp-slot [zIndex]="3" />
      </z-input-otp-group>
    </z-input-otp>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoInputOtpFourDigitsComponent {
  readonly REGEXP_ONLY_DIGITS = REGEXP_ONLY_DIGITS;
}
