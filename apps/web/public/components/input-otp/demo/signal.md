```angular-ts showLineNumbers copyButton
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormField, form, minLength, required, submit } from '@angular/forms/signals';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardInputOtpGroupComponent } from '@/shared/components/input-otp/input-otp-group.component';
import { ZardInputOtpSignalComponent } from '@/shared/components/input-otp/input-otp-signal.component';
import { ZardInputOtpSlotComponent } from '@/shared/components/input-otp/input-otp-slot.component';

@Component({
  selector: 'zard-demo-input-otp-signal',
  imports: [
    ZardButtonComponent,
    ZardInputOtpSignalComponent,
    ZardInputOtpSlotComponent,
    ZardInputOtpGroupComponent,
    FormField,
  ],
  standalone: true,
  template: `
    <form (submit)="onSubmit($event)" class="w-2/3 space-y-4">
      <label class="text-sm font-medium" for="otp">One-Time Password</label>
      <z-input-otp-signal id="otp" [formField]="otpForm.pin">
        <z-input-otp-group>
          <z-input-otp-slot [zIndex]="0" />
          <z-input-otp-slot [zIndex]="1" />
          <z-input-otp-slot [zIndex]="2" />
          <z-input-otp-slot [zIndex]="3" />
          <z-input-otp-slot [zIndex]="4" />
          <z-input-otp-slot [zIndex]="5" />
        </z-input-otp-group>
      </z-input-otp-signal>
      <p class="text-muted-foreground text-sm">Current value: {{ otpForm().value().pin }}</p>
      <button z-button type="submit" [disabled]="otpForm().invalid()">Verify</button>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoInputOtpSignalComponent {
  private readonly otpModel = signal({ pin: '' });

  protected readonly otpForm = form(this.otpModel, otp => {
    required(otp.pin);
    minLength(otp.pin, 6);
  });

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    await submit(this.otpForm, async f => {
      console.log('OTP submitted:', f().value());
    });
  }
}

```