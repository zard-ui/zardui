import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardInputOtpGroupComponent } from '../input-otp-group.component';
import { ZardInputOtpSlotComponent } from '../input-otp-slot.component';
import { ZardInputOtpComponent } from '../input-otp.component';

@Component({
  selector: 'zard-demo-input-otp-controlled',
  imports: [ZardInputOtpComponent, ZardInputOtpSlotComponent, ZardInputOtpGroupComponent, FormsModule],
  standalone: true,
  template: `
    <div class="space-y-2">
      <z-input-otp [zMaxLength]="6" [(ngModel)]="value" (zValueChange)="handleValueChange($event)">
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
          <span class="text-muted-foreground">Enter your one-time password.</span>
        } @else {
          <span>You entered: {{ value }}</span>
        }
      </div>
    </div>
  `,
})
export class ZardDemoInputOtpControlledComponent {
  value = '';

  handleValueChange(value: string): void {
    console.log('OTP value changed:', value);
  }
}
