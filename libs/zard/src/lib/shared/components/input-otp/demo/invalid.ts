import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardInputOtpImports } from '@/shared/components/input-otp/input-otp.imports';

@Component({
  selector: 'z-demo-input-otp-invalid',
  imports: [ZardInputOtpImports, FormsModule],
  template: `
    <z-input-otp [zMaxLength]="6" [(ngModel)]="value">
      <z-input-otp-group>
        <z-input-otp-slot [zIndex]="0" zInvalid />
        <z-input-otp-slot [zIndex]="1" zInvalid />
      </z-input-otp-group>
      <z-input-otp-separator />
      <z-input-otp-group>
        <z-input-otp-slot [zIndex]="2" zInvalid />
        <z-input-otp-slot [zIndex]="3" zInvalid />
      </z-input-otp-group>
      <z-input-otp-separator />
      <z-input-otp-group>
        <z-input-otp-slot [zIndex]="4" zInvalid />
        <z-input-otp-slot [zIndex]="5" zInvalid />
      </z-input-otp-group>
    </z-input-otp>
  `,
})
export class ZardDemoInputOtpInvalidComponent {
  value = '000000';
}
