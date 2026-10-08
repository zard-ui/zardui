import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardInputComponent } from '@/shared/components/input/input.component';

@Component({
  selector: 'z-demo-field-invalid',
  imports: [...ZardFieldImports, ZardInputComponent, ReactiveFormsModule],
  template: `
    <div class="w-full min-w-xs">
      <form [formGroup]="signupForm">
        @let emailControl = signupForm.controls.email;
        @let emailInvalid = emailControl.invalid && emailControl.touched;
        <div z-field [attr.data-invalid]="emailInvalid || null">
          <label z-field-label for="signup-email">Email</label>
          <input
            z-input
            type="email"
            id="signup-email"
            placeholder="you@example.com"
            formControlName="email"
            [attr.aria-invalid]="emailInvalid || null"
          />
          @if (emailInvalid) {
            <z-field-error>
              @if (emailControl.hasError('required')) {
                Email is required.
              } @else if (emailControl.hasError('email')) {
                Enter a valid email address.
              }
            </z-field-error>
          } @else {
            <p z-field-description>We'll only use this to send you a receipt.</p>
          }
        </div>
      </form>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoFieldInvalidComponent {
  protected readonly signupForm = new FormGroup({
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
  });
}
