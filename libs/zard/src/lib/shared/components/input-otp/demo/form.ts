import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardInputOtpImports } from '@/shared/components/input-otp/input-otp.imports';

@Component({
  selector: 'z-demo-input-otp-form',
  imports: [...ZardInputOtpImports, ...ZardFieldImports, ZardButtonComponent, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="w-2/3 space-y-6">
      <div z-field>
        <label z-field-label for="pin">One-Time Password</label>
        <z-input-otp id="pin" [zMaxLength]="6" formControlName="pin">
          <z-input-otp-group>
            <z-input-otp-slot [zIndex]="0" />
            <z-input-otp-slot [zIndex]="1" />
            <z-input-otp-slot [zIndex]="2" />
            <z-input-otp-slot [zIndex]="3" />
            <z-input-otp-slot [zIndex]="4" />
            <z-input-otp-slot [zIndex]="5" />
          </z-input-otp-group>
        </z-input-otp>
        <p z-field-description>Please enter the one-time password sent to your phone.</p>
        @if (form.controls.pin.touched && form.controls.pin.hasError('required')) {
          <z-field-error>Your one-time password is required.</z-field-error>
        }
        @if (form.controls.pin.touched && form.controls.pin.hasError('minlength')) {
          <z-field-error>Your one-time password must be 6 characters.</z-field-error>
        }
      </div>

      <button z-button type="submit" [disabled]="form.invalid">Submit</button>

      @if (submitted) {
        <p class="text-muted-foreground text-sm">Submitted: {{ submitted }}</p>
      }
    </form>
  `,
})
export class ZardDemoInputOtpFormComponent {
  submitted = '';

  form = new FormGroup({
    pin: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]),
  });

  onSubmit(): void {
    if (this.form.valid) {
      this.submitted = this.form.value.pin ?? '';
    }
  }
}
