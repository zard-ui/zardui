import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardInputOtpImports } from '@/shared/components/input-otp/input-otp.imports';

@Component({
  selector: 'z-demo-input-otp-controlled',
  imports: [ZardInputOtpImports, FormsModule],
  template: `
    <div class="space-y-2">
      <z-input-otp [zMaxLength]="6" [(ngModel)]="value">
        <z-input-otp-group>
          <z-input-otp-slot [zIndex]="0" />
          <z-input-otp-slot [zIndex]="1" />
          <z-input-otp-slot [zIndex]="2" />
          <z-input-otp-slot [zIndex]="3" />
          <z-input-otp-slot [zIndex]="4" />
          <z-input-otp-slot [zIndex]="5" />
        </z-input-otp-group>
      </z-input-otp>
      <div class="text-center text-sm">
        @if (value === '') {
          Enter your one-time password.
        } @else {
          You entered: {{ value }}
        }
      </div>
    </div>
  `,
})
export class ZardDemoInputOtpControlledComponent {
  value = '';
}
