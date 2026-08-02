import { Component } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardInputOtpImports } from '@/shared/components/input-otp/input-otp.imports';
import { REGEXP_ONLY_DIGITS } from '@/shared/components/input-otp/input-otp.utils';

@Component({
  selector: 'z-demo-input-otp-pattern',
  imports: [ZardInputOtpImports, ZardFieldImports],
  template: `
    <div z-field class="w-fit">
      <label z-field-label for="digits-only">Digits Only</label>
      <z-input-otp id="digits-only" [zMaxLength]="6" [zPattern]="REGEXP_ONLY_DIGITS">
        <z-input-otp-group>
          <z-input-otp-slot [zIndex]="0" />
          <z-input-otp-slot [zIndex]="1" />
          <z-input-otp-slot [zIndex]="2" />
          <z-input-otp-slot [zIndex]="3" />
          <z-input-otp-slot [zIndex]="4" />
          <z-input-otp-slot [zIndex]="5" />
        </z-input-otp-group>
      </z-input-otp>
    </div>
  `,
})
export class ZardDemoInputOtpPatternComponent {
  readonly REGEXP_ONLY_DIGITS = REGEXP_ONLY_DIGITS;
}
