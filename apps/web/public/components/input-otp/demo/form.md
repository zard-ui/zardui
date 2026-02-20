```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ZardButtonComponent } from '../../button/button.component';
import { ZardInputOtpGroupComponent } from '../input-otp-group.component';
import { ZardInputOtpSlotComponent } from '../input-otp-slot.component';
import { ZardInputOtpComponent } from '../input-otp.component';

@Component({
  selector: 'zard-demo-input-otp-form',
  imports: [
    ZardInputOtpComponent,
    ZardInputOtpSlotComponent,
    ZardInputOtpGroupComponent,
    ZardButtonComponent,
    ReactiveFormsModule,
  ],
  standalone: true,
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="w-2/3 space-y-6">
      <div class="space-y-2">
        <label
          for="pin"
          class="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          One-Time Password
        </label>
        <z-input-otp [zMaxLength]="6" formControlName="pin" id="pin" (zComplete)="onComplete($event)">
          <z-input-otp-group>
            <z-input-otp-slot [zIndex]="0" />
            <z-input-otp-slot [zIndex]="1" />
            <z-input-otp-slot [zIndex]="2" />
            <z-input-otp-slot [zIndex]="3" />
            <z-input-otp-slot [zIndex]="4" />
            <z-input-otp-slot [zIndex]="5" />
          </z-input-otp-group>
        </z-input-otp>
        <p class="text-muted-foreground text-sm">Please enter the one-time password sent to your phone.</p>
        @if (form.get('pin')?.hasError('required') && form.get('pin')?.touched) {
          <p class="text-destructive text-sm">Your one-time password is required.</p>
        }
        @if (form.get('pin')?.hasError('minlength') && form.get('pin')?.touched) {
          <p class="text-destructive text-sm">Your one-time password must be 6 characters.</p>
        }
      </div>

      <button z-button type="submit" [disabled]="!form.valid">Submit</button>
    </form>
  `,
})
export class ZardDemoInputOtpFormComponent {
  form = new FormGroup({
    pin: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]),
  });

  onSubmit(): void {
    if (this.form.valid) {
      console.log('Form submitted:', this.form.value);
      alert(`OTP submitted: ${this.form.value.pin}`);
    }
  }

  onComplete(value: string): void {
    console.log('OTP completed:', value);
  }
}

```