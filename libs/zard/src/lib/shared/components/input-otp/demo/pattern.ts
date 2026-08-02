import { Component } from '@angular/core';

import { ZardInputOtpImports } from '@/shared/components/input-otp/input-otp.imports';

export const REGEXP_ONLY_DIGITS = '[0-9]';
export const REGEXP_ONLY_CHARS = '[a-zA-Z]';
export const REGEXP_ONLY_DIGITS_AND_CHARS = '[a-zA-Z0-9]';

@Component({
  selector: 'z-demo-input-otp-pattern',
  imports: [...ZardInputOtpImports],
  template: `
    <div class="space-y-4">
      <div>
        <p class="text-muted-foreground mb-2 text-sm">Only digits</p>
        <z-input-otp [zMaxLength]="6" [zPattern]="REGEXP_ONLY_DIGITS">
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

      <div>
        <p class="text-muted-foreground mb-2 text-sm">Letters and numbers</p>
        <z-input-otp [zMaxLength]="6" [zPattern]="REGEXP_ONLY_DIGITS_AND_CHARS" [zIntegerOnly]="false">
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
    </div>
  `,
})
export class ZardDemoInputOtpPatternComponent {
  REGEXP_ONLY_DIGITS = REGEXP_ONLY_DIGITS;
  REGEXP_ONLY_DIGITS_AND_CHARS = REGEXP_ONLY_DIGITS_AND_CHARS;
}
