import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormField, form, minLength, required, submit } from '@angular/forms/signals';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardInputOtpImports } from '@/shared/components/input-otp/input-otp.imports';

@Component({
  selector: 'z-demo-input-otp-signal',
  imports: [...ZardInputOtpImports, ...ZardFieldImports, ZardButtonComponent, FormField],
  template: `
    <form (submit)="onSubmit($event)" class="w-2/3 space-y-4">
      <div z-field>
        <label z-field-label for="otp-signal">One-Time Password</label>
        <z-input-otp-signal id="otp-signal" [formField]="otpForm.pin">
          <z-input-otp-group>
            <z-input-otp-slot [zIndex]="0" />
            <z-input-otp-slot [zIndex]="1" />
            <z-input-otp-slot [zIndex]="2" />
            <z-input-otp-slot [zIndex]="3" />
            <z-input-otp-slot [zIndex]="4" />
            <z-input-otp-slot [zIndex]="5" />
          </z-input-otp-group>
        </z-input-otp-signal>
        <p z-field-description>Current value: {{ otpForm().value().pin }}</p>
      </div>

      <button z-button type="submit" [disabled]="otpForm().invalid()">Verify</button>

      @if (submitted()) {
        <p class="text-muted-foreground text-sm">Submitted: {{ submitted() }}</p>
      }
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoInputOtpSignalComponent {
  private readonly otpModel = signal({ pin: '' });

  protected readonly submitted = signal('');

  protected readonly otpForm = form(this.otpModel, otp => {
    required(otp.pin);
    minLength(otp.pin, 6);
  });

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    await submit(this.otpForm, async f => {
      this.submitted.set(f().value().pin);
    });
  }
}
