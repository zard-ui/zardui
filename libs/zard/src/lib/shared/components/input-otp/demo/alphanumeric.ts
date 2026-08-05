import { Component } from '@angular/core';

import { ZardInputOtpImports } from '@/shared/components/input-otp/input-otp.imports';
import { REGEXP_ONLY_DIGITS_AND_CHARS } from '@/shared/components/input-otp/input-otp.utils';

@Component({
  selector: 'z-demo-input-otp-alphanumeric',
  imports: [ZardInputOtpImports],
  template: `
    <z-input-otp [zMaxLength]="6" [zPattern]="REGEXP_ONLY_DIGITS_AND_CHARS" [zIntegerOnly]="false">
      <z-input-otp-group>
        <z-input-otp-slot [zIndex]="0" />
        <z-input-otp-slot [zIndex]="1" />
        <z-input-otp-slot [zIndex]="2" />
      </z-input-otp-group>
      <z-input-otp-separator />
      <z-input-otp-group>
        <z-input-otp-slot [zIndex]="3" />
        <z-input-otp-slot [zIndex]="4" />
        <z-input-otp-slot [zIndex]="5" />
      </z-input-otp-group>
    </z-input-otp>
  `,
})
export class ZardDemoInputOtpAlphanumericComponent {
  readonly REGEXP_ONLY_DIGITS_AND_CHARS = REGEXP_ONLY_DIGITS_AND_CHARS;
}
