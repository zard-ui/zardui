import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardInputComponent } from '@/shared/components/input/input.component';
import { ZardSelectImports } from '@/shared/components/select/select.imports';

@Component({
  selector: 'z-demo-input-form',
  imports: [ZardInputComponent, ZardButtonComponent, ZardSelectImports, ReactiveFormsModule, ...ZardFieldImports],
  template: `
    <form class="w-full min-w-sm" [formGroup]="form" (ngSubmit)="onSubmit()">
      <div z-field-group>
        <div z-field>
          <label z-field-label for="form-name">Name</label>
          <input z-input id="form-name" type="text" placeholder="Evil Rabbit" formControlName="name" />
        </div>
        @let emailControl = form.controls.email;
        @let emailInvalid = emailControl.invalid && emailControl.touched;
        <div z-field [attr.data-invalid]="emailInvalid || null">
          <label z-field-label for="form-email">Email</label>
          <input
            z-input
            id="form-email"
            type="email"
            placeholder="john@example.com"
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
            <p z-field-description>We'll never share your email with anyone.</p>
          }
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div z-field>
            <label z-field-label for="form-phone">Phone</label>
            <input z-input id="form-phone" type="tel" placeholder="+1 (555) 123-4567" formControlName="phone" />
          </div>
          <div z-field>
            <label z-field-label for="form-country">Country</label>
            <z-select id="form-country" formControlName="country">
              <z-select-item zValue="us">United States</z-select-item>
              <z-select-item zValue="uk">United Kingdom</z-select-item>
              <z-select-item zValue="ca">Canada</z-select-item>
            </z-select>
          </div>
        </div>
        <div z-field>
          <label z-field-label for="form-address">Address</label>
          <input z-input id="form-address" type="text" placeholder="123 Main St" formControlName="address" />
        </div>
        <div z-field zOrientation="horizontal">
          <button z-button type="button" zType="outline" (click)="onReset()">Cancel</button>
          <button z-button type="submit">Submit</button>
        </div>
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoInputFormComponent {
  readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    phone: new FormControl(''),
    country: new FormControl('us'),
    address: new FormControl(''),
  });

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      console.log('Form submitted:', this.form.getRawValue());
    }
  }

  onReset(): void {
    this.form.reset({ country: 'us' });
  }
}
